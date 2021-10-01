import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import * as child from 'child_process';

async function createTempFile() {
    return await new Promise<{ name: string, removeCallback: () => void }>((resolve, reject) => {
        tmp.file((err, name, fd, removeCallback) => {
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

export function executeFunc(args: string[]) {
    const fiftPath = path.resolve(__dirname, '..', 'bin', 'macos', 'func');
    child.execSync(fiftPath + ' ' + args.join(' '), {
        stdio: 'inherit'
    });
}

export function executeFift(args: string[]) {
    const fiftPath = path.resolve(__dirname, '..', 'bin', 'macos', 'fift');
    child.execSync(fiftPath + ' ' + args.join(' '), {
        stdio: 'inherit',
        env: {
            FIFTPATH: path.resolve(__dirname, '..', 'fiftlib')
        }
    });
}

export async function compileFunc(source: string): Promise<{ fift: string, cell: Buffer }> {
    let sourceFile = await createTempFile();
    let fiftFile = await createTempFile();
    let fiftOpFile = await createTempFile();
    let cellFile = await createTempFile();
    let funcLib = path.resolve(__dirname, '..', 'funclib', 'stdlib.fc');
    try {
        await writeFile(sourceFile.name, source);

        // Func -> Fift
        executeFunc(['-PS', '-o', fiftFile.name, funcLib, sourceFile.name]);
        let fiftContent = await readFile(fiftFile.name);
        fiftContent = fiftContent.substr(fiftContent.indexOf('\n') + 1); // Remove first line

        // Fift -> Boc
        fs.writeFileSync(fiftOpFile.name, `
        "Asm.fif" include
        ${fiftContent}
        boc>B "${cellFile.name}" B>file`, 'utf-8');
        executeFift([fiftOpFile.name]);
        let cell = await readFileBuffer(cellFile.name);
        
        return { fift: fiftContent, cell: cell };
    } finally {
        sourceFile.removeCallback();
        fiftFile.removeCallback();
        fiftOpFile.removeCallback();
    }
}