---
name: ecash-lib
description: Bitcoin ABC official library for building and signing eCash transactions
version: 4.11.0
tags: [ecash-lib, transaction, signing, script, crypto]
---

# ecash-lib

Bitcoin ABC official library for building and signing eCash transactions.

**npm**: `ecash-lib`

## Core Imports

```typescript
import {
  Ecc,              // Elliptic curve cryptography
  Script,           // Script creation
  TxBuilder,        // Transaction building
  P2PKHSignatory,   // P2PKH signing
  fromHex,          // Hex to Uint8Array
  toHex,            // Uint8Array to hex
  ALL_BIP143,       // BIP143 signing (recommended)
} from 'ecash-lib';
```

## Building Transactions

```typescript
const txBuild = new TxBuilder({
  inputs: [{
    input: {
      prevOut: { txid: '...', outIdx: 0 },
      signData: { sats: 1000n, outputScript: p2pkhScript },
    },
    signatory: P2PKHSignatory(seckey, pubkey, ALL_BIP143),
  }],
  outputs: [
    { sats: 500n, script: p2pkhScript },
    { sats: 0n, script: p2pkhScript }, // Change
  ],
});

const tx = txBuild.sign({ feePerKb: 1000n, dustSats: 546n });
const rawTx = tx.ser();
```

## Script Creation

```typescript
// P2PKH
const p2pkhScript = Script.p2pkh(hash160(pubkey));

// P2SH
const p2shScript = Script.p2sh(scriptHash);

// From address
const script = Script.fromAddress('ecash:q...');
```

## Key Methods

| Ecc | Description |
|------|------|
| `derivePubkey(seckey)` | Derive public key |
| `ecdsaSign(seckey, msg)` | ECDSA sign |
| `schnorrSign(seckey, msg)` | Schnorr sign |

| TxBuilder | Description |
|------|------|
| `sign(params)` | Sign and return Tx |
| `.inputs` | Input array |
| `.outputs` | Output array |

| Tx | Description |
|------|------|
| `ser()` | Serialize to Uint8Array |
| `txid()` | Get transaction ID |
| `toHex()` | Serialize to hex |

## Important Notes

- Use **BigInt** for amounts (1000n satoshis)
- Use **ALL_BIP143** signing (eCash recommended)
- Use `toHex()` to convert bytecode to string
