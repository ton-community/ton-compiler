import path from "path";
import { CompilationResult } from "../types";
import { base64Decode } from "./utils/base64Decode";
import { cutFirstLine } from "./utils/cutFirstLine";
import { unescape } from "./utils/unescape";

// Compilators
const CompilerModule_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.js');
const FuncFiftLibWasm_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.wasm.js').FuncFiftLibWasm;

type CompileResult = {
    status: "error",
    message: string
} | {
    status: "ok",
    codeBoc: string,
    fiftCode: string,
    warnings: string
};

export async function wasmBuild(opts: { version: 'v2022.10', files: string[], stdlib: boolean, workdir: string }): Promise<CompilationResult> {

    // Resolve version
    let CompilerModule: any;
    let FuncFiftLibWasm: any;
    if (opts.version === 'v2022.10') {
        CompilerModule = CompilerModule_2022_10;
        FuncFiftLibWasm = FuncFiftLibWasm_2022_10;
    } else {
        throw Error('Unknown compiler version: ' + opts.version);
    }
    const WasmBinary = base64Decode(FuncFiftLibWasm);

    // Create compiler
    let mod = await CompilerModule({ wasmBinary: WasmBinary });
    try {

        // Mount filesystem
        mod.FS.mkdir('/libs');
        mod.FS.mount(mod.FS.filesystems.NODEFS, { root: path.resolve(__dirname, '..', '..', 'bin', 'distrib', opts.version) }, '/libs');
        mod.FS.mkdir('/working');
        mod.FS.mount(mod.FS.filesystems.NODEFS, { root: opts.workdir }, '/working');

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

        // Execute
        let configStrPointer = mod._malloc(configStr.length + 1);
        try {
            mod.stringToUTF8(configStr, configStrPointer, configStr.length + 1);
            let resultPointer = mod._func_compile(configStrPointer);
            let retJson = mod.UTF8ToString(resultPointer);
            mod._free(resultPointer);
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
                throw Error('Unexpected compiler response')
            }
        } finally {
            mod._free(configStrPointer);
        }
    } catch (e) {
        throw Error('Unexpected compiler response')

    }
}