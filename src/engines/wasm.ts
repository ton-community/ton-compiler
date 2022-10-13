import { CompilationResult } from "../types";
import { base64Decode } from "./utils/base64Decode";

// Compilators
const CompilerModule_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.js');
const FuncFiftLibWasm_2022_10 = require('../../bin/distrib/v2022.10/funcfiftlib.wasm.js').FuncFiftLibWasm;

export async function wasmBuild(opts: { version: 'v2022.10', files: string[], stdlib: boolean }): Promise<CompilationResult> {

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
    mod.FS.mount(mod.FS.filesystems.NODEFS, { root: '/' }, '/');


    // Execute
    let configStr = JSON.stringify({
        sources: opts.files,
        optLevel: 2 // compileConfig.optLevel || 2
    });
    let configStrPointer = mod._malloc(configStr.length + 1);
    mod.stringToUTF8(configStr, configStrPointer, configStr.length + 1);
    let resultPointer = mod._func_compile(configStrPointer);
    let retJson = mod.UTF8ToString(resultPointer);
    console.warn(retJson);

    throw Error('Not implemented');
}