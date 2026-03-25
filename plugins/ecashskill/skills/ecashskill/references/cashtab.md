---
name: cashtab
description: Full-featured eCash web wallet application and reference implementation
version: 1.0.0
tags: [wallet, web, reference, implementation, badger]
---

# Cashtab

Full-featured eCash web wallet application, serving as a reference implementation for the eCash ecosystem.

## Overview

Cashtab is the official eCash web wallet:
- XEC and eToken sending/receiving
- BIP39 mnemonic import
- Message signing
- SLP/ALP Token support
- Browser extension (Chrome/Brave)
- Docker deployment

**Website**: https://wallet.badger.cash/
**Repository**: github.com/badger-cash/cashtab
**Frontend Framework**: React 17 + Ant Design

---

## Claude Code Usage Guide

### Tech Stack

```
Frontend: React 17 + React Router
UI: Ant Design
Wallet Library: bcash (forked)
Address Handling: ecashaddrjs
Storage: localforage (IndexedDB)
Big Number: bignumber.js
QR Code: zxing/library
```

### Core Architecture

#### Directory Structure

```
src/
├── components/
│   ├── Authentication/   # Wallet unlock/authentication
│   ├── Common/          # Shared components (QRCode, BalanceHeader, Ticker)
│   ├── Configure/      # Settings
│   ├── OnBoarding/     # New wallet creation
│   ├── Send/           # Send XEC/eTokens
│   ├── Tokens/         # Token management
│   └── Wallet/         # Main wallet view
├── hooks/
│   ├── useWallet.js    # Core wallet state
│   └── useBCH.js       # Blockchain interaction
├── utils/
│   ├── cashMethods.js  # Balance formatting, address conversion
│   ├── tokenMethods.js # Token utilities
│   ├── context.js      # React Context
│   └── validation.js   # Input validation
```

#### State Management

```typescript
// WalletContext provides global wallet state
const { wallet, balance, tokens, sendTx } = useWallet();

// Wallet object structure
{
  mnemonic: string,
  Path245: { cashAddress, slpAddress, legacyAddress, publicKey },
  Path145: { ... },
  Path1899: { ... },
  state: {
    balances: { totalBalance, totalBalanceInSatoshis },
    tokens: [{ tokenId, balance, hasBaton, info }],
    utxos: [...],
    parsedTxHistory: [...]
  }
}
```

### BIP44 Derivation Path

Cashtab supports three derivation paths:

| Path | Purpose | Coin Type |
|------|--------|-----------|
| `m/44'/245'/0'/0/0` | Path245 (main) | 245 |
| `m/44'/145'/0'/0/0` | Path145 | 145 |
| `m/44'/1899'/0'/0/0` | Path1899 (eCash) | 1899 |

### API Calls

Cashtab uses bcash backend REST API:

```javascript
// Environment variables
REACT_APP_BCASH_API=https://ecash.badger.cash:8332

// Get address UTXO
GET /coin/address/{address}?slp=true

// Get transaction history
GET /tx/address/{address}?slp=true&limit=30&reverse=true

// Get Token information
GET /token/{tokenId}

// Get specific UTXO
GET /coin/{hash}/{index}?slp=true
```

### Key Patterns

#### Address Conversion

```typescript
import ecashaddr from 'ecashaddrjs';

// eCash address conversion
function convertAddress(address, fromPrefix, toPrefix) {
  const { type, hash } = ecashaddr.decode(address);
  return ecashaddr.encode(toPrefix, type, hash);
}

// Example
convertAddress('ecash:q...', 'ecash', 'simpleledger');
```

#### Balance Formatting

```typescript
import { fromSmallestDenomination } from './cashMethods';

// XEC formatting (1 XEC = 100 satoshis)
const xecBalance = fromSmallestDenomination(balanceSats, 2); // 2 decimals
// 1000000 sats = 10000.00 XEC

// Token formatting
const tokenBalance = fromSmallestDenomination(tokenSats, tokenDecimals);
```

#### Token Operations

```typescript
// SLP Token transfer
async function sendToken(toAddress, tokenId, quantity, decimals) {
  // Build OP_RETURN output
  const opReturn = buildSlpOpReturn(tokenId, 'SEND', quantity, decimals);

  // Build transaction
  const tx = await buildTransaction({
    inputs: selectedUtxos,
    outputs: [
      { script: opReturn, sats: 0 },
      { address: toAddress, sats: 546 },
    ],
  });

  return tx.serialize().toString('hex');
}
```

### Prompt Templates

```
I need to understand Cashtab's wallet architecture

I need to implement balance display similar to Cashtab

I need to implement SLP Token transfer

I need to implement address format conversion

I need to understand Cashtab's state management pattern
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# Cashtab Reference Configuration
- name: "cashtab"
  description: "Cashtab eCash wallet reference implementation"
  files:
    - "**/*wallet*"
    - "**/*cashtab*"
    - "**/useWallet*"
    - "**/cashMethods*"
  rules:
    - type: "dependencies"
      statement: |
        # Core libraries used by Cashtab
        - bcash (forked): Transaction building and signing
        - ecashaddrjs: Address encoding/decoding
        - localforage: IndexedDB storage
        - bignumber.js: Precision calculation

    - type: "derivation-paths"
      statement: |
        # BIP44 Derivation Paths
        - Path245: m/44'/245'/0'/0/0 (main)
        - Path145: m/44'/145'/0'/0/0
        - Path1899: m/44'/1899'/0'/0/0 (eCash)

    - type: "address-types"
      statement: |
        # Supported address formats
        - cashAddress: ecash:q...
        - slpAddress: simpleledger:q...
        - legacyAddress: 1... or 3...
        - etokenAddress: etoken:q...

    - type: "bip70"
      statement: |
        # BIP70 payment protocol support
        - Use b70 library for PaymentDetails
        - Support Simple Ledger Payment Protocol

    - type: "storage"
      statement: |
        # Storage strategy
        - Prefer localforage (IndexedDB)
        - Fallback to localStorage
        - Encrypted wallet storage

    - type: "state-management"
      statement: |
        # React Context pattern
        - WalletContext: Wallet state
        - AuthenticationContext: Authentication state
        - useWallet hook for state access
```

### AI Role Settings

```
When referencing Cashtab to implement eCash features:

1. Use React Context for global state management
2. BIP44 derivation path uses Path1899 (coin type 1899)
3. Address conversion uses ecashaddrjs
4. Amount calculation uses bignumber.js to avoid precision issues
5. SLP Token uses OP_RETURN encoding
6. Prefer IndexedDB (localforage) for storage
7. Browser extension uses chrome.storage
```

---

## API Reference

### cashMethods.js

```typescript
// Format balance
fromSmallestDenomination(sats: number, decimals: number): string
toSmallestDenomination(amount: string, decimals: number): bigint

// Address validation
isValidAddress(address: string): boolean
isValidEcashAddress(address: string): boolean

// Address conversion
convertPrefix(address: string, newPrefix: string): string
```

### tokenMethods.js

```typescript
// SLP OP_RETURN building
buildSlpOpReturn(tokenId: string, type: string, quantity: bigint, decimals: number): Uint8Array

// Token ID validation
isValidTokenId(tokenId: string): boolean

// Token quantity formatting
formatTokenQuantity(quantity: bigint, decimals: number): string
parseTokenQuantity(amount: string, decimals: number): bigint
```

### OP_RETURN Encoding

```typescript
// eToken prefix
const ETOKEN_PREFIX = '6a04534c5000'; // OP_RETURN + SLP0

// Cashtab prefix
const CASHTAB_PREFIX = '6a0400746162'; // OP_RETURN + tab
```

---

## Code Examples

### Wallet State Hook

```typescript
// useWallet.js reference implementation
import { createContext, useContext } from 'react';
import { WalletContext } from './context';

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

// Usage
function BalanceDisplay() {
  const { wallet, loading } = useWallet();

  if (loading) return <Spinner />;

  return (
    <div>
      <span>XEC: {wallet.state.balances.totalBalance}</span>
      <span>Tokens: {wallet.state.tokens.length}</span>
    </div>
  );
}
```

### Address Derivation

```typescript
// Reference bcash BIP44 derivation
import { HD } from 'bcash';

function deriveAddress(mnemonic, path) {
  const seed = HD.fromMnemonic(mnemonic).toSeed();
  const hd = HD.fromSeed(seed);

  // m/44'/1899'/0'/0/0
  const child = hd.derive(44 + 0x80000000)  // purpose
               .derive(1899 + 0x80000000)    // coin type
               .derive(0 + 0x80000000)      // account
               .derive(0)                    // change
               .derive(0);                   // index

  const keyring = KeyRing.fromHD(child);
  return keyring.getAddress('ecash');
}
```

### Send Transaction

```typescript
// Reference Send component sending logic
async function sendXec(toAddress, amountSats) {
  // 1. Get available UTXOs
  const utxos = await fetchUtxos(wallet.address);

  // 2. Select UTXOs (greedy algorithm)
  const selectedUtxos = selectUtxos(utxos, amountSats);

  // 3. Build transaction
  const mtX = new MTX();
  mtX.addOutput(toAddress, amountSats);

  // Add change
  const change = totalInput - amountSats - fee;
  if (change > 0) {
    mtX.addOutput(wallet.address, change);
  }

  // 4. Sign
  for (const utxo of selectedUtxos) {
    mtX.sign(utxo.keyring);
  }

  // 5. Broadcast
  const rawTx = mtX.toString();
  return await broadcastTx(rawTx);
}
```

### Token Transfer

```typescript
// SLP Token transfer reference
function buildSlpSend(tokenId, toAddress, quantity, decimals) {
  // 1. Build OP_RETURN
  const opReturn = new Script([
    Opcode.OP_RETURN,
    Buffer.from('SLP', 'ascii'),
    Buffer.from([0]), // SLP version
    Buffer.from('SEND', 'ascii'),
    encodeQuantity(quantity, decimals),
  ]);

  // 2. Build Token output (Qty=0 means only send token, not XEC)
  const tokenOutput = new Script([
    Opcode.OP_RETURN,
    tokenId,
    Buffer.from([0x02]), // SEND type
    encodeQuantity(quantity, decimals),
  ]);

  // 3. Build transaction
  // ...
}
```

---

## Troubleshooting

### Common Issues

**Q: Wallet import fails**
- Check BIP39 mnemonic validity
- Confirm 12/24 word format is correct
- Verify derivation path

**Q: Balance display incorrect**
- Check if API endpoint is accessible
- Confirm address format is correct
- Verify parsing precision

**Q: Transaction broadcast fails**
- Check network connection
- Verify transaction fee is sufficient
- Confirm UTXO is spendable

**Q: Token not displaying**
- Check if Token ID is correct
- Confirm Token type (SLP/ALP)
- Verify OP_RETURN encoding

### Debugging Tips

```typescript
// Enable debug logs
localStorage.setItem('debug', 'true');

// View wallet state
console.log('Wallet:', wallet);

// View API response
console.log('UTXOs:', utxos);

// Check derivation
console.log('Derived address:', derivedAddress);
```

### Browser Extension Integration

```typescript
// Detect Cashtab extension
if (window.bitcoinAbc === 'cashtab') {
  // Use extension connection
  const address = await window.bitcoinAbc.requestAddress();
}

// Extension message protocol
window.postMessage({
  type: 'FROM_PAGE',
  addressRequest: true,
}, '*');
```

---

## Related Links

- **Cashtab Website**: https://wallet.badger.cash/
- **GitHub**: https://github.com/badger-cash/cashtab
- **bcash fork**: https://github.com/badger-cash/bcash
- **bcash documentation**: https://github.com/badger-cash/bcash/blob/webpack-ecash/docs/
