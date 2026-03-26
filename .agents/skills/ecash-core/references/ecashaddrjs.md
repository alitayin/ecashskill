---
name: ecashaddrjs
description: JavaScript implementation of CashAddr address format for eCash
version: 2.0.0
tags: [address, cashaddr, encoding, decoding]
---

# ecashaddrjs

Address encoding/decoding for eCash (CashAddr format).

**npm**: `ecashaddrjs`

## Usage

```typescript
import ecashaddr from 'ecashaddrjs';

// Decode
const { prefix, type, hash } = ecashaddr.decode('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');
// prefix: 'ecash', type: 'P2PKH', hash: Uint8Array

// Encode
const address = ecashaddr.encode('ecash', type, hash);
```

## Address Validation

```typescript
function isValidEcashAddress(address: string): boolean {
  try {
    const { prefix } = ecashaddr.decode(address);
    return prefix === 'ecash';
  } catch {
    return false;
  }
}
```

## API Reference

| Method | Description |
|------|------|
| `encode(prefix, type, hash)` | Encode to CashAddr format |
| `decode(address)` | Decode CashAddr address |

| Address Type | Description |
|------|------|
| P2PKH | Pay to Public Key Hash (20 bytes) |
| P2SH | Pay to Script Hash (20 bytes) |

| Prefix | Network |
|--------|---------|
| ecash | eCash mainnet |
| ectest | eCash testnet |
| bitcoincash | Bitcoin Cash |
