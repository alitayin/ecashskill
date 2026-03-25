---
name: ecash-lib
description: Bitcoin ABC official library for building and signing eCash transactions
version: 4.11.0
tags: [ecash-lib, transaction, signing, script, crypto]
---

# ecash-lib

Bitcoin ABC official JavaScript/TypeScript library for building and signing eCash transactions.

## Overview

ecash-lib is the core library for eCash development, providing:
- Transaction building (TxBuilder) and signing
- Script creation (P2PKH, P2SH, multisig, etc.)
- Elliptic curve cryptography (ECDSA, Schnorr)
- SLP/ALP Token support
- HD wallet and mnemonic
- PSBT partially signed transactions
- WASM acceleration for performance

**npm**: `ecash-lib`
**Version**: 4.11.0
**Repository**: github.com/Bitcoin-ABC/bitcoin-abc

---

## Claude Code Usage Guide

### Installation

```bash
npm install ecash-lib
```

### Core Concepts

```typescript
import {
  Ecc,              // Elliptic curve cryptography
  Script,           // Script creation
  TxBuilder,        // Transaction building
  Tx,               // Signed transaction
  P2PKHSignatory,   // P2PKH signatory
  Address,          // Address handling
  fromHex,          // Hex to Uint8Array
  toHex,            // Uint8Array to hex
  shaRmd160,        // Hash160
  sha256,           // SHA256
  hash256,          // SHA256d (double)
  ALL_BIP143,       // BIP143 signature hash mode
} from 'ecash-lib';
```

### Building Basic Transactions

```typescript
import {
  Ecc,
  P2PKHSignatory,
  Script,
  TxBuilder,
  fromHex,
  shaRmd160,
  toHex,
  ALL_BIP143,
} from 'ecash-lib';

const ecc = new Ecc();

// 1. Prepare keys
const walletSk = fromHex('e6ae1669c47d092eff3eb652bea535331c338e29f34be709bc4055655cd0e950');
const walletPk = ecc.derivePubkey(walletSk);
const walletPkh = shaRmd160(walletPk);

// 2. Create P2PKH script
const walletP2pkh = Script.p2pkh(walletPkh);

// 3. Prepare UTXO
const walletUtxo = {
  txid: '0000000000000000000000000000000000000000000000000000000000000000',
  outIdx: 0,
};

// 4. Build transaction
const txBuild = new TxBuilder({
  inputs: [
    {
      input: {
        prevOut: walletUtxo,
        signData: {
          sats: 1000n,           // UTXO amount (satoshi)
          outputScript: walletP2pkh,
        },
      },
      signatory: P2PKHSignatory(walletSk, walletPk, ALL_BIP143),
    },
  ],
  outputs: [
    { sats: 500n, script: walletP2pkh },  // Transfer
    { sats: 0n, script: walletP2pkh },   // Change (sats=0 is auto-calculated by library)
  ],
});

// 5. Sign
const tx = txBuild.sign({ feePerKb: 1000n, dustSats: 546n });
const rawTx = tx.ser();
console.log('Raw TX:', toHex(rawTx));
console.log('TXID:', tx.txid());
```

### Script Creation

```typescript
import { Script } from 'ecash-lib';

// P2PKH script
const pkh = fromHex('1181600f8a4f3f3f4f5f6f7f8f9fafbfcfdfeff');
const p2pkhScript = Script.p2pkh(pkh);

// P2SH script
const scriptHash = fromHex('1181600f8a4f3f3f4f5f6f7f8f9fafbfcfdfeff');
const p2shScript = Script.p2sh(scriptHash);

// Create script from address
const scriptFromAddr = Script.fromAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');

// Multisig script
const pubkeys = [pubkey1, pubkey2, pubkey3];
const multisigScript = Script.multisig(pubkeys, 2, false); // 2-of-3

// OP_RETURN output
const opReturnScript = new Script(fromHex('6a68656c6c6f')); // "hello" as OP_RETURN
```

### Using WebSocket + Chronik to Monitor and Spend UTXO

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';
import { Ecc, P2PKHSignatory, Script, TxBuilder, shaRmd160, ALL_BIP143, fromHex } from 'ecash-lib';

const ecc = new Ecc();
const seckey = fromHex('your_private_key_hex');
const pubkey = ecc.derivePubkey(seckey);
const pkh = shaRmd160(pubkey);
const p2pkhScript = Script.p2pkh(pkh);

// Connect to Chronik
const chronik = new ChronikClient(['https://chronik.e.cash/xec']);

// Subscribe to address
const ws = chronik.ws({
  onMessage: async (msg) => {
    if (msg.type === 'TX_ADDED_TO_MEMPOOL') {
      const { txid } = msg.txData;
      const tx = await chronik.tx(txid);

      // Find outputs paying to us
      for (const output of tx.outputs) {
        if (output.script === toHex(p2pkhScript.bytecode)) {
          console.log('Payment received!', output.satoshis, 'sats');

          // Build spending transaction
          const txBuilder = new TxBuilder({
            inputs: [{
              input: {
                prevOut: { txid, outIdx: output.outputIndex },
                signData: {
                  sats: BigInt(output.satoshis),
                  outputScript: p2pkhScript,
                },
              },
              signatory: P2PKHSignatory(seckey, pubkey, ALL_BIP143),
            }],
            outputs: [{ sats: BigInt(output.satoshis - 200n), script: p2pkhScript }],
          });

          const signedTx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
          await chronik.broadcastTx(toHex(signedTx.ser()));
        }
      }
    }
  },
});

await ws.waitForOpen();
ws.subscribeToAddress('ecash:' + toHex(pkh));
```

### Prompt Templates

```
I need to build a transaction to send XEC

I need to create a P2PKH script

I need to derive public key and address from private key

I need to implement a wallet listener to automatically confirm received payments

I need to create and sign a multisig transaction
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# ecash-lib Configuration
- name: "ecash-lib"
  description: "eCash transaction building and signing library"
  files:
    - "**/*wallet*"
    - "**/*tx*"
    - "**/*sign*"
    - "**/*ecash*"
  rules:
    - type: "import"
      statement: |
        import {
          Ecc,
          P2PKHSignatory,
          Script,
          TxBuilder,
          Tx,
          Address,
          fromHex,
          toHex,
          shaRmd160,
          sha256,
          hash256,
          ALL_BIP143,
          SINGLE_BIP143,
          NONE_BIP143,
        } from 'ecash-lib';

    - type: "best-practice"
      statement: |
        // Use BIP143 signing (eCash recommended)
        // ALL_BIP143 = SIGHASH_ALL | SIGHASH_BIP143
        // SINGLE_BIP143 = SIGHASH_SINGLE | SIGHASH_BIP143
        // NONE_BIP143 = SIGHASH_NONE | SIGHASH_BIP143

    - type: "bigint"
      statement: |
        // Note: eCash uses bigint for satoshi amounts
        // Use BigInt() literals: 1000n, 546n
        // Do not use Number() as it has precision issues

    - type: "error-handling"
      statement: |
        // Signing error handling
        try {
          const tx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
        } catch (error) {
          if (error.message.includes('Insufficient funds')) {
            throw new Error('Insufficient balance to pay fee');
          }
          throw error;
        }

    - type: "key-management"
      statement: |
        // Private key handling best practices
        // 1. Never hardcode private keys in code
        // 2. Use environment variables or key management service
        // 3. Use mock private keys in test environment
```

### AI Role Settings

```
When writing code involving ecash-lib:

1. Use BigInt for amounts (n suffix), e.g., 1000n satoshis
2. Always use BIP143 signing (ALL_BIP143)
3. Use named exports for imports: import { Ecc, Script } from 'ecash-lib'
4. Never hardcode private keys, use environment variables
5. TxBuilder.sign() returns a Tx object, call .ser() to get raw transaction
6. Script.bytecode is Uint8Array, use toHex() to convert
7. Recommended to use with chronik-client to monitor UTXO changes
```

---

## API Reference

### Ecc

Elliptic curve cryptography class.

| Method | Description |
|------|------|
| `derivePubkey(seckey)` | Derive public key from private key |
| `ecdsaSign(seckey, msg)` | ECDSA sign |
| `ecdsaVerify(sig, msg, pk)` | ECDSA verify |
| `schnorrSign(seckey, msg)` | Schnorr sign (eCash default) |
| `schnorrVerify(sig, msg, pk)` | Schnorr verify |
| `isValidSeckey(seckey)` | Validate private key |
| `compressPk(pk)` | Compress public key |
| `signRecoverable(seckey, msg)` | Recoverable sign (for message signing) |
| `recoverSig(sig, msg)` | Recover recoverable signature |

### TxBuilder

Transaction builder.

| Method/Property | Description |
|----------|------|
| `constructor(params)` | Create builder |
| `inputs` | Input array |
| `outputs` | Output array |
| `sign(params?)` | Sign and return Tx |
| `static fromTx(tx)` | Create from signed transaction (for追加signing) |

**sign() parameters**:
- `feePerKb`: fee rate (bigint)
- `dustSats`: minimum output amount
- `ecc`: Ecc instance (optional)
- `changeScript`: change script (optional)

### Tx

Signed transaction.

| Method | Description |
|------|------|
| `ser()` | Serialize to Uint8Array |
| `serSize()` | Serialized size |
| `toHex()` | Serialize to hex string |
| `txid()` | Get transaction ID |
| `version` | Transaction version |
| `inputs` | Input array |
| `outputs` | Output array |
| `locktime` | Locktime |

### Script

Script creation and manipulation.

| Static Method | Description |
|---------|------|
| `p2pkh(pkh)` | Create P2PKH script |
| `p2sh(scriptHash)` | Create P2SH script |
| `multisig(pubkeys, threshold, isP2sh)` | Create multisig script |
| `fromAddress(address)` | Create script from address |
| `fromOps(ops)` | Create script from OP codes |
| `instance method` | `isP2pkh()`, `isP2sh()`, `isOpReturn()` |

### P2PKHSignatory(seckey, pubkey, sigHashType)

Create P2PKH signatory.

### Signatory Types

| Type | Purpose |
|------|------|
| `P2PKHSignatory(sk, pk, hashType)` | P2PKH signing |
| `P2PKSignatory(sk, hashType)` | P2PK signing (not recommended) |

### SigHashType

| Constant | Description |
|------|------|
| `ALL_BIP143` | All inputs, BIP143 (recommended) |
| `SINGLE_BIP143` | Single input match, BIP143 |
| `NONE_BIP143` | No input lock, BIP143 |

### Address Operations

```typescript
import { Address } from 'ecash-lib';

// Parse CashAddr
const addr = Address.fromCashAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');
console.log(addr.prefix);  // 'ecash'
console.log(addr.type);    // 'P2PKH'
console.log(addr.hash);    // Uint8Array

// Parse Legacy address
const legacyAddr = Address.fromLegacyAddress('1BoSBLqB8X5mVrWyaCuB7JuE5KK9SsJf9z');

// Change prefix
const bchAddr = addr.withPrefix('bitcoincash');
```

### Hash Functions

```typescript
import { shaRmd160, sha256, hash256 } from 'ecash-lib';

const hash160 = shaRmd160(pubkey);  // RIPEMD160(SHA256(x))
const hash256x = sha256(data);     // SHA256
const doubleHash = hash256(data);   // SHA256(SHA256(x)) - used for signing
```

### Utility Functions

```typescript
import { fromHex, toHex } from 'ecash-lib';

// Hex conversion
const bytes = fromHex('deadbeef');  // Uint8Array
const hex = toHex(bytes);           // string

// Other
import { randomBytes } from 'ecash-lib';
const randomKey = randomBytes(32);  // Generate random bytes
```

---

## Code Examples

### HD Wallet Support

```typescript
import {
  Ecc,
  HdNode,
  entropyToMnemonic,
  mnemonicToSeed,
  toHex,
  fromHex,
} from 'ecash-lib';

const ecc = new Ecc();

// Derive from mnemonic
const mnemonic = entropyToMnemonic(crypto.getRandomValues(new Uint8Array(16)));
console.log('Mnemonic:', mnemonic);

const seed = mnemonicToSeed(mnemonic);
const root = HdNode.fromSeed(seed);

// Derive path m/44'/0'/0'/0/0
const child = root.derive(44 + 0x80000000)
  .derive(0 + 0x80000000)
  .derive(0 + 0x80000000)
  .derive(0)
  .derive(0);

const seckey = child.privateKey!;
const pubkey = ecc.derivePubkey(seckey);
console.log('Address:', child.address);
```

### SLP Token Transfer

```typescript
import {
  Ecc,
  Script,
  TxBuilder,
  P2PKHSignatory,
  fromHex,
  shaRmd160,
  toHex,
  ALL_BIP143,
} from 'ecash-lib';
import { ALPH_TOKEN_TYPE_STANDARD } from 'ecash-lib/dist/token/alp';

const tokenId = fromHex('token_id_here');
const tokenReceiver = 'ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d';
const amount = 1000n;

// Create ALP output
const alpOutput = Script.alpMintableOutput(
  tokenId,
  amount,
  ALPH_TOKEN_TYPE_STANDARD,
  receiverScript.bytecode
);

// Use in transaction
const txBuild = new TxBuilder({
  inputs: [...],
  outputs: [
    { sats: 0n, script: alpOutput },
    { sats: 0n, script: receiverScript },
  ],
});
```

### PSBT (Partially Signed Transaction)

```typescript
import { Psbt, PsbtBuilder, Script } from 'ecash-lib';

// Create PSBT
const psbtBuilder = new PsbtBuilder({ ... });
const psbt = psbtBuilder.toPsbt();

// Add signature
psbt.sign(0, signatory);

// Verify and extract
const tx = psbt.finalizeAll().extractTx();
```

---

## Troubleshooting

### Common Issues

**Q: Signing fails "Invalid signature"**
- Ensure using ALL_BIP143 instead of simple SIGHASH_ALL
- Check public key and private key match
- Verify signData.sats amount is correct

**Q: Transaction broadcast fails "dust"**
- Increase output amount above dustSats (546 sats)
- Or reduce fee

**Q: "Insufficient funds"**
- UTXO total not enough to cover amount + fee
- Need to consolidate multiple UTXOs or reduce amount

**Q: TypeScript can't find types**
- ecash-lib has built-in TypeScript type definitions
- Ensure using `./dist/indexNodeJs.d.ts` entry

**Q: bigint precision issues**
- Use BigInt literals (1000n)
- Don't convert to Number and back
- Keep BigInt during serialization

### Debugging Tips

```typescript
// View transaction details
const tx = txBuild.sign({ feePerKb: 1000n, debug: true });
console.log(tx.inspect()); // Detailed debug info

// Calculate fee
const estimatedSize = txBuild.estimateSize();
const fee = estimatedSize * feePerKb / 1000n;

// Verify signature
const valid = ecc.ecdsaVerify(sig, sighash, pubkey);
```

### Working with chronik-client

```typescript
// Recommended workflow
1. Use chronik-client to subscribe to address
2. Get UTXO details after notification
3. Use ecash-lib to build transaction
4. Use chronik-client.broadcastTx() to broadcast
5. Use chronik-client.broadcastAndFinalizeTx() to wait for confirmation
```
