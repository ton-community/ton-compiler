import { CompilationResult } from "../types";
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as child from 'child_process';

const arch = os.arch();

async function createTempFile(postfix: string) {
    return await new Promise<{ name: string, removeCallback: () => void }>((resolve, reject) => {
        tmp.file({ postfix }, (err, name, fd, removeCallback) => {
            if (err) {
                reject(err);
            } else {
                resolve({ name, removeCallback });
            }
        });
    });
}

async function writeFile(name: string, content: string) {
    await new Promise<void>((resolve, reject) => {
        fs.writeFile(name, content, 'utf-8', (e) => {
            if (e) {
                reject(e);
            } else {
                resolve();
            }
        });
    })
}

async function readFile(name: string) {
    return await new Promise<string>((resolve, reject) => {
        fs.readFile(name, 'utf-8', (e, d) => {
            if (e) {
                reject(e);
            } else {
                resolve(d);
            }
        });
    })
}
async function readFileBuffer(name: string) {
    return await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(name, (e, d) => {
            if (e) {
                reject(e);
            } else {
                resolve(d);
            }
        });
    })
}

async function executeFunc(args: string[]) {
    const fiftPath = path.resolve(__dirname, '..', '..', 'bin', 'distrib', 'legacy', 'macos', arch === 'arm64' ? 'func-arm64' : 'func');
    try {
        let res = child.execSync(fiftPath + ' ' + args.join(' '));
        return {
            ok: true,
            log: res.toString() as string
        }
    } catch (e) {
        return {
            ok: false,
            log: (e as any).stderr.toString() as string
        }
    }
}

async function executeFift(args: string[]) {
    const fiftPath = path.resolve(__dirname, '..', '..', 'bin', 'distrib', 'legacy', 'macos', arch === 'arm64' ? 'fift-arm64' : 'fift');
    try {
        let res = child.execSync(fiftPath + ' ' + args.join(' '), {
            env: {
                FIFTPATH: path.resolve(__dirname, '..', '..', 'bin', 'distrib', 'legacy')
            }
        });
        return {
            ok: true,
            log: res.toString() as string
        }
    } catch (e) {
        return {
            ok: false,
            log: (e as any).stderr.toString() as string
        }
    }
}

export async function legacyBuild(opts: { files: string[], stdlib: boolean }): Promise<CompilationResult> {
    if (os.type() !== 'Darwin') {
        throw Error('Legacy builds are supported only on MacOS');
    }

    // Compile to fift
    let fiftFile = await createTempFile('.fif');
    let fiftContent: string;
    let logs: string;
    try {
        let args: string[] = ['-PS', '-o', fiftFile.name];
        if (opts.stdlib) {
            args.push(path.resolve(__dirname, '..', '..', 'bin', 'distrib', 'legacy', 'stdlib.fc'))
        }
        for (let f of opts.files) {
            args.push(f);
        }
        let funcOutput = await executeFunc(args);
        if (!funcOutput.ok) {
            return { ok: false, log: funcOutput.log, fift: null, output: null };
        } else {
            logs = funcOutput.log
        }
        fiftContent = await readFile(fiftFile.name);
        fiftContent = fiftContent.slice(fiftContent.indexOf('\n') + 1); // Remove first line
    } finally {
        fiftFile.removeCallback();
    }

    // Compile fift to binary
    let fiftOpFile = await createTempFile('.fif');
    let cellFile = await createTempFile('.cell');
    let output: Buffer;
    try {
        let body = '';
        body += `"Asm.fif" include\n`;
        body += fiftContent;
        body += '\n';
        body += `boc>B "${cellFile.name}" B>file`;
        fs.writeFileSync(fiftOpFile.name, body, 'utf-8');
        let fiftOutput = await executeFift([fiftOpFile.name]);
        if (!fiftOutput.ok) {
            return { ok: false, log: fiftOutput.log, fift: fiftContent, output: null };
        } else {
            if (logs.length !== 0) {
                logs = logs + '\n';
            }
            logs += fiftOutput.log;
        }
        output = await readFileBuffer(cellFile.name);
    } catch (e) {
        console.warn(e);
        return { ok: false, log: '', fift: fiftContent, output: null };
    } finally {
        fiftOpFile.removeCallback();
        cellFile.removeCallback();
    }

    return { ok: true, log: '', fift: fiftContent, output };
}