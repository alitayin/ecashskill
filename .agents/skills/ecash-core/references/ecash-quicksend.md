---
name: ecash-quicksend
description: Simple transaction sender for eCash XEC, SLP, and ALP tokens
version: 1.0.7
tags: [ecash, transaction, quicksend, xec, tokens, payment]
---

# ecash-quicksend

A unified transaction manager for eCash (XEC), SLP, and ALP token transactions.

**npm**: `ecash-quicksend`
**Repository**: https://github.com/alitayin/quicksend

## When to Use

- Quick prototyping and small projects
- Simple payment flows
- When you need a lightweight alternative to full wallet libraries

## When NOT to Use

- Large production applications (limited maintenance)
- Complex wallet scenarios requiring HD derivation
- Projects needing long-term dependency support

## Quick Start

```typescript
import { Quicksend } from 'ecash-quicksend';
import 'dotenv/config';

const qs = new Quicksend({
  privateKey: process.env.PRIVATE_KEY,
  chronikUrl: 'https://chronik.e.cash/',
});

// Send XEC
const result = await qs.send([
  { address: 'ecash:qp...', amount: 1000n },
]);

console.log(result); // { txid, hex }
```

## Send Token

```typescript
// Send SLP/ALP Token
const tokenResult = await qs.sendToken({
  address: 'ecash:qp...',
  tokenId: 'token_id_here',
  amount: '100.5', // String for decimal support
});
```

## API Reference

| Method | Description |
|------|------|
| `send(outputs)` | Send XEC to one or more addresses |
| `sendToken(params)` | Send SLP/ALP token |
| `broadcast(txHex)` | Broadcast raw transaction |

## Limitations

- Requires private key management (not HD wallet)
- Limited maintenance - not suitable for production-critical applications
- No built-in UTXO management or coin selection
- For larger projects, use `ecash-wallet` with `ecash-lib`
