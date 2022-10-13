export type CompilationResult = {
    ok: false,
    log: string,
    fift: string | null,
    output: Buffer | null
} | {
    ok: true,
    log: string,
    fift: string,
    output: Buffer
}