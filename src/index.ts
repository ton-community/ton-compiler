import { legacyBuild } from "./engines/legacy";
import { CompilationResult } from "./types";
import path from 'path';
import { wasmBuild } from "./engines/wasm";

type Version =
    | 'v2022.10'
    | 'legacy'

export async function compileContract(opts: { files: string[], version?: Version | 'latest', stdlib?: boolean | null }): Promise<CompilationResult> {

    // Resolve stdlib
    let stdlib = true;
    if (opts.stdlib === false) {
        opts.stdlib = false;
    }

    // Resolve version
    let version: Version = 'v2022.10'; // Latest
    if (opts.version !== 'latest' && typeof opts.version === 'string') {
        version = opts.version;
    }

    // Resolve files
    let files = opts.files.map((v) => path.resolve(v));

    // Compile
    if (version === 'legacy') {
        return await legacyBuild({ files: files, stdlib });
    } else if (version === 'v2022.10') {
        return await wasmBuild({ files, version, stdlib });
    } else {
        throw Error('Unsupported compiler version ' + version);
    }
}