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

This packages adds multiple binaries: func, fift and ton-compiler.

- Fift compiler already have stdlib included
- Func compiler need stdlib to be provided, you can use bundled-in: `./node_modules/ton-compioler/funclib/stdblib.fc`
- Ton Compiler is a wrapper around them to be able to compile everything in one go

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
  console.log(result.cell); // Compiled cell in base64
} else {
  console.warn(result.logs); // Output logs
}
```

# License

MIT
