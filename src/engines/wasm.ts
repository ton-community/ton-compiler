import path from "path";
import fs from 'fs';
import { CompilationResult } from "../types";
import { base64Decode } from "./utils/base64Decode";
import { cutFirstLine } from "./utils/cutFirstLine";
import { unescape } from "./utils/unescape";

// Compilators
const CompilerModule_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.js');
const FuncFiftLibWasm_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.wasm.js').FuncFiftLibWasm;
const CompilerModule_2022_12 = require('../../bin/distrib/v2022.12/funcfiftlib.js');
const FuncFiftLibWasm_2022_12 = require('../../bin/distrib/v2022.12/funcfiftlib.wasm.js').FuncFiftLibWasm;

type CompileResult = {
    status: "error",
    message: string
} | {
    status: "ok",
    codeBoc: string,
    fiftCode: string,
    warnings: string
};

type Pointer = unknown;
const writeToCString = (mod: any, data: string): Pointer => {
    const len = mod.lengthBytesUTF8(data) + 1;
    const ptr = mod._malloc(len);
    mod.stringToUTF8(data, ptr, len);
    return ptr;
};
const writeToCStringPtr = (mod: any, str: string, ptr: any) => {
    const allocated = writeToCString(mod, str);
    mod.setValue(ptr, allocated, '*');
    return allocated;
};

const readFromCString = (mod: any, pointer: Pointer): string => mod.UTF8ToString(pointer);

export async function wasmBuild(opts: { version: 'v2022.10' | 'v2022.12', files: string[], stdlib: boolean, workdir: string }): Promise<CompilationResult> {

    // Resolve version
    let CompilerModule: any;
    let FuncFiftLibWasm: any;
    if (opts.version === 'v2022.10') {
        CompilerModule = CompilerModule_2022_10;
        FuncFiftLibWasm = FuncFiftLibWasm_2022_10;
    } else if (opts.version === 'v2022.12') {
        CompilerModule = CompilerModule_2022_12;
        FuncFiftLibWasm = FuncFiftLibWasm_2022_12;
    } else {
        throw Error('Unknown compiler version: ' + opts.version);
    }
    const WasmBinary = base64Decode(FuncFiftLibWasm);

    // Create compiler
    let mod = await CompilerModule({ wasmBinary: WasmBinary, printErr: (e: any) => { } });
    try {

        // Mount filesystem
        // mod.FS.mkdir('/libs');
        // mod.FS.mount(mod.FS.filesystems.NODEFS, { root: path.resolve(__dirname, '..', '..', 'bin', 'distrib', opts.version) }, '/libs');
        // mod.FS.mkdir('/working');
        // mod.FS.mount(mod.FS.filesystems.NODEFS, { root: opts.workdir }, '/working');
        let content: { [path: string]: { content: string } } = {};
        content['/libs/stdlib.fc'] = { content: fs.readFileSync(path.resolve(__dirname, '..', '..', 'bin', 'distrib', opts.version, 'stdlib.fc'), 'utf-8') };

        // Resolve files
        let files: string[] = [];
        if (opts.stdlib) {
            files.push('/libs/stdlib.fc');
        }
        for (let f of opts.files) {
            files.push('/working/' + f);
        }

        // Parameters
        let configStr = JSON.stringify({
            sources: files,
            optLevel: 2 // compileConfig.optLevel || 2
        });

        // Pointer tracking
        const allocatedPointers: Pointer[] = [];
        const trackPointer = (pointer: Pointer): Pointer => {
            allocatedPointers.push(pointer);
            return pointer;
        };

        // Execute
        try {
            let configPointer = trackPointer(writeToCString(mod, configStr));
            const callbackPtr = trackPointer(mod.addFunction((_kind: any, _data: any, contents: any, error: any) => {
                const kind: string = readFromCString(mod, _kind);
                const data: string = readFromCString(mod, _data);
                if (kind === 'realpath') {
                    if (data.startsWith('/libs')) {
                        allocatedPointers.push(writeToCStringPtr(mod, path.resolve(__dirname, '..', '..', 'bin', 'distrib', opts.version, data.slice('/libs/'.length)), contents));
                    } else if (data.startsWith('/working')) {
                        allocatedPointers.push(writeToCStringPtr(mod, path.resolve(opts.workdir, data.slice('/working/'.length)), contents));
                    } else {
                        allocatedPointers.push(writeToCStringPtr(mod, data, contents));
                    }
                } else if (kind === 'source') {
                    try {
                        let pp: string;
                        if (data.startsWith('/libs')) {
                            pp = path.resolve(__dirname, '..', '..', 'bin', 'distrib', opts.version, data.slice('/libs/'.length));
                        } else if (data.startsWith('/working')) {
                            pp = path.resolve(opts.workdir, data.slice('/working/'.length));
                        } else {
                            throw Error('Unknown path: ' + data);
                        }
                        let source: string = fs.readFileSync(pp, 'utf-8');
                        allocatedPointers.push(writeToCStringPtr(mod, source, contents));
                    } catch (err) {
                        const e = err as any;
                        allocatedPointers.push(writeToCStringPtr(mod, 'message' in e ? e.message : e.toString(), error));
                    }
                } else {
                    allocatedPointers.push(writeToCStringPtr(mod, 'Unknown callback kind ' + kind, error));
                }
            }, 'viiii'));
            let resultPointer = trackPointer(mod._func_compile(configPointer, callbackPtr));
            let retJson = readFromCString(mod, resultPointer);
            let result = JSON.parse(retJson) as CompileResult;
            if (result.status === 'error') {
                return {
                    ok: false,
                    log: result.message ? result.message : 'Unknown error',
                    fift: null,
                    output: null
                };
            } else if (result.status === 'ok') {
                return {
                    ok: true,
                    log: result.warnings ? result.warnings : '',
                    fift: cutFirstLine(unescape(result.fiftCode)),
                    output: Buffer.from(result.codeBoc, 'base64')
                };
            } else {
                throw Error('Unexpected compiler response');
            }
        } finally {
            allocatedPointers.forEach((pointer) => mod._free(pointer));
        }
    } catch (e) {
        console.warn(e);
        throw Error('Unexpected compiler response');
    }
}