---
name: ecash-lib
description: eCash transaction building and signing library. Use when creating raw transactions, custom signing logic, working with scripts, or handling low-level cryptographic operations.
---

# ecash-lib

Low-level library for building and signing eCash transactions.

## Quick Start

```typescript
import { Ecc, TxBuilder, P2PKHSignatory, Script } from 'ecash-lib';
```

## References

- `references/ecash-lib.md` — Full API reference

## When to Use

- Building raw transactions
- Custom signing logic
- Script construction
- Low-level cryptographic operations
- Production transaction workflows (prefer over ecash-quicksend)
