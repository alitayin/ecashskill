---
name: bitcoin-abc
description: Bitcoin ABC eCash node implementation, Chronik indexer, ecash-lib and contribution guidelines
version: 0.1.0
tags: [ecash, blockchain, node, indexer, contribution]
---

# Bitcoin ABC

Full node implementation for eCash blockchain.

**Repository**: github.com/Bitcoin-ABC/bitcoin-abc

## Modules

| Module | Purpose |
|--------|---------|
| `ecash-lib` | Transaction building and signing |
| `ecash-wallet` | Wallet functionality |
| `ecashaddrjs` | Address handling |
| `chronik-client` | Chronik API client |
| `cashtab` | Web wallet reference |

## Development

```bash
# C++ Build
cmake -GNinja .. -DCMAKE_BUILD_TYPE=Debug
ninja

# Run tests
ninja check
```

## C++ Code Style

- 4-space indentation (LLVM style)
- Functions: CamelCase
- Variables: lowerCamelCase
- Member variables: `m_` prefix
- Namespaces: lower_snake_case
