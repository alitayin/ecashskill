---
name: bitcoin-abc
description: Bitcoin ABC eCash node implementation, Chronik indexer, ecash-lib and contribution guidelines
version: 0.1.0
tags: [ecash, blockchain, node, indexer, contribution]
---

# Bitcoin ABC

Bitcoin ABC is a full node implementation for the eCash (XEC) blockchain, including the Chronik indexer, ecash-lib and other core modules.

## Overview

Bitcoin ABC provides:
- Full eCash blockchain node
- Chronik high-performance indexer
- ecash-lib transaction library
- Consensus protocol implementation (Avalanche)
- SLP/ALP Token support

**Repository**: github.com/Bitcoin-ABC/bitcoin-abc
**Code Review**: reviews.bitcoinabc.org (Phabricator)
**Languages**: C++, Rust, TypeScript/JavaScript

---

## Claude Code Usage Guide

### Project Structure

```
bitcoin-abc/
├── src/                    # C++ node implementation
├── modules/               # TypeScript/JavaScript modules
│   ├── ecash-lib/        # eCash transaction library
│   ├── ecash-wallet/     # Wallet functionality
│   ├── ecashaddrjs/      # Address handling
│   ├── chronik-client/   # Chronik client
│   └── cashtab/          # Cashtab wallet
├── chronik/              # Rust indexer implementation
├── apps/                 # Web applications
├── doc/                  # Documentation
└── cmake/                # CMake configuration
```

### Module Directory Structure

```
modules/ecash-lib/
├── src/                   # TypeScript source
├── tests/                 # Test files
├── testkeys/             # Test keys
├── wordlists/            # HD wallet wordlists
├── package.json
├── tsconfig.json
└── README.md
```

### Development Environment Requirements

```bash
# Node.js (using pnpm)
node >= 20
pnpm >= 8

# C++ Build
cmake >= 3.21
ninja
clang-16 / gcc-12+
llvm-16

# Rust (for Chronik)
rustup
cargo
```

### Build Steps

```bash
# Clone repository
git clone ssh://vcs@reviews.bitcoinabc.org:2221/source/bitcoin-abc.git
cd bitcoin-abc

# Create build directory
mkdir build && cd build

# Configure CMake (Debug)
cmake -GNinja .. -DCMAKE_BUILD_TYPE=Debug

# Build
ninja

# Run tests
ninja check        # Unit tests
ninja check-functional  # Functional tests
```

### Code Style

**C++ Standards** (following LLVM):
- 4-space indentation (except namespaces)
- Class/function/namespace braces on new line
- Other cases braces on same line
- Functions use CamelCase
- Variables use lowerCamelCase
- Member variables prefix `m_`
- Constants use UPPER_SNAKE_CASE
- Namespaces use lower_snake_case

```cpp
// Correct example
class TransactionValidator {
public:
    Result validate(const Transaction& tx) const;

private:
    int m_validationDepth;
    std::string m_lastError;
};

// Incorrect example
class transaction_validator {  // namespace should be lower_snake_case
public:
    bool ValidateTransaction(transaction TX);  // parameters should be lowerCamelCase
private:
    int validation_depth_;  // member variables should prefix m_
};
```

**TypeScript Standards**:
- Use ESLint + Prettier
- Enable `strict: true`
- Use named exports

### Testing Requirements

```bash
# Run all tests
ninja check

# Run unit tests
ninja check-unit

# Run functional tests
ninja check-functional

# View test coverage
ninja coverage-check-all

# Using Sanitizers for debugging
cmake -GNinja .. \
  -DCMAKE_BUILD_TYPE=Debug \
  -DSANITIZERS_ENABLED=address,thread,undefined
```

### Prompt Templates

```
I need to add a new signature type to ecash-lib

I need to understand how to contribute to Bitcoin ABC

I need to find the source location of the chronik indexer

I need to add test cases in ecash-lib

I need to understand the dependencies between modules
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# Bitcoin ABC Configuration
- name: "bitcoin-abc"
  description: "eCash full node and development framework"
  files:
    - "**/*bitcoin*abc*"
    - "**/modules/**"
    - "**/chronik/**"
  rules:
    - type: "cpp-style"
      statement: |
        # C++ Code Standards
        - Indentation: 4 spaces (LLVM style)
        - Functions: CamelCase
        - Variables: lowerCamelCase
        - Member variables: m_ prefix
        - Constants: UPPER_SNAKE_CASE
        - Namespaces: lower_snake_case

    - type: "imports"
      statement: |
        # TypeScript Module Import Order
        1. External dependencies (node_modules)
        2. Internal modules (@ecash-lib, chronik-client)
        3. Relative imports (./, ../)
        4. Type imports use import type

    - type: "testing"
      statement: |
        # Testing Requirements
        - All new features must have unit tests
        - Public APIs must have documentation comments
        - Use describe/it style
        - Mock external dependencies

    - type: "commit"
      statement: |
        # Commit Standards
        - Use arc diff to create diff
        - Follow Conventional Commits
        - feat: new feature
        - fix: bug fix
        - test: test related
        - docs: documentation related
```

### AI Role Settings

```
When writing code for the Bitcoin ABC project:

1. C++ code follows LLVM coding standards
2. TypeScript uses strict mode
3. All public APIs must have JSDoc comments
4. Run relevant tests before committing
5. Use arc lint for code checking
6. Do not commit directly to master/main, create a topic branch first
```

---

## Module Description

### ecash-lib

**Location**: `modules/ecash-lib/`
**Purpose**: Core library for eCash transaction building and signing

```typescript
import {
  Ecc,
  Script,
  TxBuilder,
  Tx,
  P2PKHSignatory,
  ALL_BIP143,
} from 'ecash-lib';
```

### chronik-client

**Location**: `modules/chronik-client/`
**Purpose**: Chronik indexer API client

```typescript
import { ChronikClient } from 'chronik-client';
const chronik = new ChronikClient(['https://chronik.e.cash/xec']);
```

### ecashaddrjs

**Location**: `modules/ecashaddrjs/`
**Purpose**: eCash address format encoding/decoding

```typescript
import ecashaddr from 'ecashaddrjs';
const { prefix, type, hash } = ecashaddr.decode(address);
```

### ecash-wallet

**Location**: `modules/ecash-wallet/`
**Purpose**: HD wallet implementation

```typescript
import { Wallet, Mnemonic } from 'ecash-wallet';
```

### cashtab

**Location**: `modules/cashtab/`
**Purpose**: Full-featured Web wallet reference implementation

---

## Contribution Process

### 1. Environment Setup

```bash
# Install Arcanist (Phabricator CLI)
# Requires PHP 7.4+
curl -s https://getcomposer.org/installer | php
composer global require phacility/arcanist

# Add to PATH
echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> ~/.bashrc

# Clone repository
git clone ssh://vcs@reviews.bitcoinabc.org:2221/source/bitcoin-abc.git
cd bitcoin-abc
```

### 2. Create Branch

```bash
# Create topic branch from master/main
git checkout -b 'your-feature-name'

# Or create from specific version
git checkout -b 'your-feature-name' v0.24.0
```

### 3. Development and Commit

```bash
# View changes
git status
git diff

# Commit (use English description)
git commit -a -m 'description'

# Create diff for code review
arc diff

# Or update existing diff
arc diff HEAD^
```

### 4. Code Review

```bash
# Merge after review approval
arc land

# Or manual merge
git checkout master
git merge your-feature-branch
git push
```

### Code Review Checklist

```cpp
// Checklist
1. Any memory leaks (using RAII)
2. Thread safety issues
3. Error handling completeness
4. Performance issues
5. Test coverage adequacy
6. Documentation updated

// Common rejection reasons
- Violation of coding standards
- Missing tests
- Test failures
- Memory leaks
- Thread unsafe
```

---

## API Reference

### Building C++ Modules

```bash
# Build in specified directory
cd modules/ecash-lib
pnpm install
pnpm build

# Run tests
pnpm test

# Type checking
pnpm lint
```

### Testing Tools

```bash
# Run chronik functional tests
./test/functional/chronik_test

# Run ecash-lib tests
pnpm test

# Generate coverage report
pnpm coverage
```

### Debugging Tools

```bash
# Enable ASan (Address Sanitizer)
ASAN_OPTIONS=detect_leaks=1 ./bitcoin-abc

# Enable TSan (Thread Sanitizer)
TSAN_OPTIONS=halt_on_errors=1 ./bitcoin-abc

# Enable UBSan (Undefined Behavior Sanitizer)
UBSAN_OPTIONS=halt_on_error=1 ./bitcoin-abc
```

---

## Code Examples

### Adding New ecash-lib Function

```typescript
// modules/ecash-lib/src/myNewFeature.ts

/**

* Description of the new feature
* @param param1 - Description of param1
* @returns Description of return value
* @throws Error - Description of possible errors
*/
export function myNewFeature(param1: string): number {
  // Implementation
  return param1.length;
}
```

### Adding Tests

```typescript
// modules/ecash-lib/tests/myNewFeature.test.ts

import { describe, it, expect } from 'vitest';
import { myNewFeature } from '../src/myNewFeature';

describe('myNewFeature', () => {
  it('should return correct length', () => {
    expect(myNewFeature('hello')).toBe(5);
  });

  it('should handle empty string', () => {
    expect(myNewFeature('')).toBe(0);
  });
});
```

### Documentation Comments Example

```cpp
// src/validation.h

/**
 * @class TransactionValidator
 * @brief Validates transactions against consensus rules
 *
 * This class performs various checks including:
 * - Script validation
 * - Signature verification
 * - Token protocol compliance
 *
 * @note Not thread-safe, use separate instances per thread
 */
class TransactionValidator {
public:
    /**
     * @brief Constructs a new transaction validator
     * @param rules The consensus validation rules to use
     * @param coinsView The coins view for UTXO lookup
     */
    explicit TransactionValidator(
        const ConsensusRules& rules,
        std::shared_ptr<CoinsView> coinsView);

    /**
     * @brief Validates a transaction
     * @param tx The transaction to validate
     * @returns ValidationResult containing success or error info
     * @throws std::runtime_error if internal error occurs
     */
    ValidationResult validate(const Transaction& tx) const;

private:
    const ConsensusRules& m_rules;
    std::shared_ptr<const CoinsView> m_coinsView;
    int m_validationDepth;
};
```

---

## Troubleshooting

### Common Issues

**Q: arc diff fails**
- Ensure logged into Phabricator: `arc install-certificate`
- Check SSH key configuration
- Confirm code review permissions

**Q: Build fails**
- Ensure using supported compiler version (clang-16 or gcc-12+)
- Clean build directory: `rm -rf build && mkdir build`
- Check dependencies are complete

**Q: Tests fail**
- Ensure code is up to date: `git pull`
- Clean and rebuild
- Check test logs for details

**Q: pnpm install fails**
- Ensure Node version >= 20
- Clear cache: `pnpm store prune`
- Delete node_modules and reinstall

**Q: Chronik tests fail**
- Ensure local node is running
- Check port 8331 is available
- Check node logs

### Resource Links

- **Code Review**: https://reviews.bitcoinabc.org
- **Issue Tracking**: https://reviews.bitcoinabc.org/maniphest
- **Development Telegram**: https://t.me/eCashDevelopment
- **Documentation**: https://github.com/Bitcoin-ABC/bitcoin-abc/tree/master/doc

### Version Compatibility

```bash
# Check module version requirements
cat modules/ecash-lib/package.json | grep '"version"'
cat modules/chronik-client/package.json | grep '"version"'

# Node Compatibility
node --version  # requires >= 20
pnpm --version  # requires >= 8
```
