---
name: cashtab
description: Full-featured eCash web wallet application and reference implementation
version: 1.0.0
tags: [wallet, web, reference, implementation, badger]
---

# Cashtab

Full-featured eCash web wallet - reference implementation.

**Note**: Cashtab is a web application, not an npm package. Use `ecash-wallet` for library integration.

**Website**: https://wallet.badger.cash/
**Repo**: github.com/badger-cash/cashtab

## BIP44 Derivation Paths

| Path | Coin Type |
|------|-----------|
| `m/44'/1899'/0'/0/0` | eCash (recommended) |
| `m/44'/245'/0'/0/0` | Cash (legacy) |
| `m/44'/145'/0'/0/0` | BCH (legacy) |

## Key Utilities

```typescript
import { fromSmallestDenomination } from './cashMethods';

// Format XEC (1 XEC = 100 sats)
const xecBalance = fromSmallestDenomination(balanceSats, 2);

// Address conversion
import ecashaddr from 'ecashaddrjs';
const { type, hash } = ecashaddr.decode(address);
const ecashAddress = ecashaddr.encode('ecash', type, hash);
```

## Related Libraries

- `bcash` - Transaction building
- `ecashaddrjs` - Address handling
- `bignumber.js` - Precision calculation
