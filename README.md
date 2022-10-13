# TON COMPILER

[![Version npm](https://img.shields.io/npm/v/ton-compiler.svg?logo=npm)](https://www.npmjs.com/package/ton-compiler)

Packaged Func compiler for TON smart contracts.

BETA: right now works only on MacOS

## Features

- ⭐️ Multiple func compiler versions
- 🚀 Doesn't need to install and compile TON
- 🍰 Programmatic and CLI interfaces
- 💸 Ready to use in unit-testing

## Supported Versions
- `latest` (default) - by default library and cli use latest available compiler
- `v2022.10`
- `legacy` - Legacy compiler

## Install

```bash
yarn add ton-compiler
```

## How to use

This packages adds `ton-compiler` binary to a project. FunC compilation is a multi-stage process. One is compiling Func to Fift code that then compiled to a binary representation. Fift compiler already have `Asm.fif` bundled. Func stdlib is bundled, but could be disabled at runtime.

### Console Use

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debuging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to fift and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

## Programmatic use

```typescript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

# License

MIT
