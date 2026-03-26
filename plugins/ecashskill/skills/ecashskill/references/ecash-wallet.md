---
name: ecash-wallet
description: HD wallet library for eCash with XEC and token support
version: 5.1.0
tags: [wallet, hd, bip44, tokens, utxo]
---

# ecash-wallet

HD wallet library for eCash with XEC and token support.

**npm**: `ecash-wallet`
**Dependencies**: chronik-client, ecash-lib

## Quick Start

```typescript
import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.e.cash/']);
const wallet = Wallet.fromMnemonic('your mnemonic here', chronik);
await wallet.sync();
```

## Sending XEC

```typescript
const { hex } = await wallet.send(toAddress, sendSats);
await wallet.broadcast(hex);
```

## HD Wallet

```typescript
const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  accountNumber: 0,
});
await hdWallet.sync();

const receiveAddr = hdWallet.getNextReceiveAddress();
hdWallet.incrementReceiveIndex();
```

## Watch-Only Wallet

```typescript
const wow = WatchOnlyWallet.fromAddress(address, chronik);
await wow.sync();
```

## BIP44 Derivation Path

```
m/44'/1899'/<accountNumber>'/0/<index>  // Receive
m/44'/1899'/<accountNumber>'/1/<index>  // Change
```

**1899** is the BIP44 coin type used by ecash-wallet (Bitcoin ABC official).

Note: Other wallets may use different coin types (e.g., Electrum ABC uses 899).

## API Reference

| Property | Type | Description |
|------|------|------|
| `address` | string | Current address |
| `balanceSats` | bigint | XEC balance (satoshis) |
| `utxos` | WalletUtxo[] | UTXO list |

| Method | Return Value | Description |
|------|--------|------|
| `sync()` | Promise<void> | Sync UTXOs and balance |
| `send(address, sats)` | Promise<{ hex: string }> | Send XEC |
| `broadcast(hex)` | Promise<string> | Broadcast transaction |
| `getNextReceiveAddress()` | string | Get next receive address |
| `action(tokenType, tokenId, quantity, outputs)` | Action | Create Token operation |

## Token Operations

```typescript
const action = wallet.action(
  'SLP',  // or 'ALP'
  tokenId,
  quantity,
  outputs
);
await action.build();
await action.sign();
await action.broadcast();
```
