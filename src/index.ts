import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as child from 'child_process';
import which from 'which';

const arch = os.arch();

async function createTempFile(postfix: string) {
    return await new Promise<{ name: string, removeCallback: () => void }>((resolve, reject) => {
        tmp.file({postfix}, (err, name, fd, removeCallback) => {
            if (err) {
                reject(err);
            } else {
                resolve({name, removeCallback});
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

export function executeFunc(args: string[], onlyBundled: Boolean) {
    let installedBinary: string | undefined;
    if (!onlyBundled) {
        const binPath = which.sync('func', {nothrow: true, all: true})
        if (binPath) installedBinary = binPath.filter(x => !x.includes("node_modules/.bin"))[0];
    }
    const funcPath = installedBinary || path.resolve(__dirname, '..', 'bin', 'macos', arch === 'arm64' ? 'func-arm64' : 'func');
    child.execSync(funcPath + ' ' + args.join(' '), {
        stdio: 'inherit'
    });
}

export function executeFift(args: string[], onlyBundled: Boolean) {
    let installedBinary: string | undefined;
    if (!onlyBundled) {
        const binPath = which.sync('fift', {nothrow: true, all: true});
        if (binPath) installedBinary = binPath.filter(x => !x.includes("node_modules/.bin"))[0];
    }
    const fiftPath = installedBinary || path.resolve(__dirname, '..', 'bin', 'macos', arch === 'arm64' ? 'fift-arm64' : 'fift');
    child.execSync(fiftPath + ' ' + args.join(' '), {
        stdio: 'inherit',
        env: {
            FIFTPATH: path.resolve(__dirname, '..', 'fiftlib')
        }
    });
}

export async function compileFunc(source: string, onlyBundled: Boolean = false): Promise<string> {
    let sourceFile = await createTempFile('.fc');
    let fiftFile = await createTempFile('.fif');
    let funcLib = path.resolve(__dirname, '..', 'funclib', 'stdlib.fc');
    try {
        await writeFile(sourceFile.name, source);
        executeFunc(['-PS', '-o', fiftFile.name, funcLib, sourceFile.name], onlyBundled);
        let fiftContent = await readFile(fiftFile.name);
        fiftContent = fiftContent.slice(fiftContent.indexOf('\n') + 1); // Remove first line
        return fiftContent;
    } finally {
        sourceFile.removeCallback();
        fiftFile.removeCallback();
    }
}

export async function compileFift(source: string, onlyBundled: Boolean = false): Promise<Buffer> {
    let fiftOpFile = await createTempFile('.fif');
    let cellFile = await createTempFile('.cell');
    try {
        let body = '';
        body += `"Asm.fif" include\n`;
        body += source;
        body += '\n';
        body += `boc>B "${cellFile.name}" B>file`;
        fs.writeFileSync(fiftOpFile.name, body, 'utf-8');
        executeFift([fiftOpFile.name], onlyBundled);
        return await readFileBuffer(cellFile.name);
    } finally {
        fiftOpFile.removeCallback();
        cellFile.removeCallback();
    }
}