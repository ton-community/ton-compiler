/// <reference types="node" />
export declare function executeFunc(args: string[], onlyBundled: Boolean): void;
export declare function executeFift(args: string[], onlyBundled: Boolean): void;
export declare function compileFunc(source: string, onlyBundled?: Boolean): Promise<string>;
export declare function compileFift(source: string, onlyBundled?: Boolean): Promise<Buffer>;
