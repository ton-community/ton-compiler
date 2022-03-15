import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as child from 'child_process';

const arch = os.arch();
const platform = os.platform()
const commandSuffix = platform === "win32" ? ".exe" : "";

async function createTempFile(postfix: string) {
    return await new Promise<{ name: string, removeCallback: () => void }>((resolve, reject) => {
        tmp.file({ postfix }, (err, name, fd, removeCallback) => {
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

export function executeFunc(args: string[]) {
    const command = (arch === 'arm64' ? 'func-arm64' : 'func') + commandSuffix;
    const funcPath = path.resolve(__dirname, '..', 'bin', platform, command);
    child.execSync(funcPath + ' ' + args.join(' '), {
        stdio: 'inherit'
    });
}

export function executeFift(args: string[]) {
    const command = (arch === 'arm64' ? 'fift-arm64' : 'fift') + commandSuffix;
    const fiftPath = path.resolve(__dirname, '..', 'bin', platform, command);
    child.execSync(fiftPath + ' ' + args.join(' '), {
        stdio: 'inherit',
        env: {
            FIFTPATH: path.resolve(__dirname, '..', 'fiftlib')
        }
    });
}

export async function compileFunc(source: string): Promise<string> {
    let sourceFile = await createTempFile('.fc');
    let fiftFile = await createTempFile('.fif');
    let funcLib = path.resolve(__dirname, '..', 'funclib', 'stdlib.fc');
    try {
        await writeFile(sourceFile.name, source);
        executeFunc(['-PS', '-o', fiftFile.name, funcLib, sourceFile.name]);
        let fiftContent = await readFile(fiftFile.name);
        fiftContent = fiftContent.slice(fiftContent.indexOf('\n') + 1); // Remove first line
        return fiftContent;
    } finally {
        sourceFile.removeCallback();
        fiftFile.removeCallback();
    }
}

export async function compileFift(source: string): Promise<Buffer> {
    let fiftOpFile = await createTempFile('.fif');
    let cellFile = await createTempFile('.cell');
    try {
        let body = '';
        body += `"Asm.fif" include\n`;
        body += source;
        body += '\n';
        body += `boc>B "${cellFile.name}" B>file`;
        fs.writeFileSync(fiftOpFile.name, body, 'utf-8');
        executeFift([fiftOpFile.name]);
        return await readFileBuffer(cellFile.name);
    } finally {
        fiftOpFile.removeCallback();
        cellFile.removeCallback();
    }
}