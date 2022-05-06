# TON COMPILER

[![Version npm](https://img.shields.io/npm/v/ton-compiler.svg?logo=npm)](https://www.npmjs.com/package/ton-compiler)

Packaged Func compiler for TON smart contracts.

BETA: right now bundled binaries works only on MacOS

## Features

- 🚀 Doesn't need to install and compile TON
- 🍰 Programmatic and CLI interfaces
- 💸 Ready to use in unit-testing

## Install

```bash
yarn add ton-compiler
```

## How to use

This packages adds multiple binaries: func, fift and ton-compiler.

- Fift compiler already have stdlib included
- Func compiler need stdlib to be provided, you can use bundled-in: `./node_modules/ton-compioler/funclib/stdblib.fc`
- Ton Compiler is a wrapper around them to be able to compile everything in one go
- Uses system TON binaries if available (configurable)

### Console Use

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debuging)
ton-compiler --input ./wallet.fc --output ./wallet.fif --fift
```

## Programmatic use

```typescript
import { compileFunc } from "ton-compiler";
let compiled = await compileFunc("source code");
console.log(compiled.fift); // Compiled Fift assembler
console.log(compiled.cell.toString('hex')); // Compiled cell
```

### Use only bundled binaries

The optional flag `onlyBundled` can be passed to ignore system binaries and only use bundled ones
```bash
# Add --onlyBundled to func / fift / ton-compiler
ton-compiler --input ./wallet.fc --output ./wallet.cell --onlyBundled
```
```typescript
import { compileFunc } from "ton-compiler";
let compiled = await compileFunc("source code", true); // add optional param true for onlyBundled
console.log(compiled.fift);
console.log(compiled.cell.toString('hex'));
```
# License

MIT
