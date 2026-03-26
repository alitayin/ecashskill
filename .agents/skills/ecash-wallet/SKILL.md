---
name: ecash-wallet
description: HD wallet implementation for eCash. Use when managing wallets, deriving keys from mnemonic, sending XEC or tokens, or handling wallet state.
---

# ecash-wallet

HD wallet with XEC and token support for eCash applications.

## Quick Start

```typescript
import { Wallet } from 'ecash-wallet';
const wallet = await Wallet.fromMnemonic(mnemonic);
```

## References

- `references/ecash-wallet.md` — Full API reference

## When to Use

- Creating or restoring wallets from mnemonic
- Sending XEC or SLP/ALP tokens
- Managing UTXOs and wallet state
- Production wallet applications
