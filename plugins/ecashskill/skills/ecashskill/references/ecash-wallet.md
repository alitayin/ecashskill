---
name: ecash-wallet
description: HD wallet library for eCash with XEC and token support
version: 5.1.0
tags: [wallet, hd, bip44, tokens, utxo]
---

# ecash-wallet

eCash HD wallet library with support for XEC transfers, Token operations, UTXO management, and wallet synchronization.

## Overview

ecash-wallet provides:
- HD wallet support (BIP44)
- XEC and Token transfers
- Wallet synchronization (Chronik)
- On-chain transaction building
- Watch-Only wallet
- SLP/ALP Token operations

**npm**: `ecash-wallet`
**Version**: 5.1.0
**Official Repository**: github.com/Bitcoin-ABC/bitcoin-abc (modules/ecash-wallet)
**Dependencies**: chronik-client, ecash-lib

---

## Claude Code Usage Guide

### Installation

```bash
npm install ecash-wallet
```

### Basic Usage

```typescript
import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.e.cash/xec']);

// Create wallet from mnemonic
const mnemonic = 'morning average minor stable parrot refuse credit exercise february mirror just begin';
const wallet = Wallet.fromMnemonic(mnemonic, chronik);
await wallet.sync();

console.log('Address:', wallet.address);
console.log('Balance:', wallet.balanceSats, 'sats');
```

### Sending XEC

```typescript
// Send XEC
const { hex } = await wallet.send(toAddress, sendSats);
await wallet.broadcast(hex);

// Or one-step
await wallet.send(toAddress, sendSats);
```

### HD Wallet

```typescript
// Create HD wallet
const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  accountNumber: 0,
  receiveIndex: 0,
  changeIndex: 0,
});
await hdWallet.sync();

// Get next receive address
const receiveAddr = hdWallet.getNextReceiveAddress();

// Get next change address
const changeAddr = hdWallet.getNextChangeAddress();

// Re-fetch after sync
hdWallet.incrementReceiveIndex();
```

### Watch-Only Wallet

```typescript
import { WatchOnlyWallet } from 'ecash-wallet';

// Single address watch-only
const wow = WatchOnlyWallet.fromAddress(address, chronik);
await wow.sync();
console.log(wow.balanceSats);

// HD watch-only (via xpub)
const hdWow = WatchOnlyWallet.fromXpub(xpub, chronik, {
  hd: true,
  accountNumber: 0,
});
await hdWow.sync();
```

### Token Operations

```typescript
// SLP/ALP Token operations
const action = wallet.action(
  tokenType,    // 'SLP' or 'ALP'
  tokenId,
  quantity,
  outputs
);

await action.build();
await action.sign();
await action.broadcast();
```

### Prompt Templates

```
I need to create an eCash wallet

I need to send XEC to a specified address

I need to create an HD wallet and derive addresses

I need to create a watch-only wallet

I need to query wallet balance and UTXOs

I need to send SLP Token
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# ecash-wallet Configuration
- name: "ecash-wallet"
  description: "eCash HD wallet library"
  files:
    - "**/*wallet*"
    - "**/*ecash*wallet*"
  rules:
    - type: "import"
      statement: |
        import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "initialization"
      statement: |
        // Wallet initialization flow
        const chronik = new ChronikClient(['https://chronik.e.cash/xec']);
        const wallet = Wallet.fromMnemonic(mnemonic, chronik);
        await wallet.sync(); // Sync UTXOs and balance

    - type: "hd-wallet"
      statement: |
        // HD wallet configuration
        const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
          hd: true,
          accountNumber: 0,
          receiveIndex: 0,
          changeIndex: 0,
        });

    - type: "best-practice"
      statement: |
        // Never store private keys in frontend
        // Use wallet signing instead of directly manipulating private keys
        // Call wallet.sync() after each send to update UTXOs

    - type: "balance"
      statement: |
        // Balance is BigInt
        console.log(wallet.balanceSats); // 1000000n
```

### AI Role Settings

```
When using ecash-wallet:

1. Always sync() wallet first before getting balance
2. Use BigInt for amounts (n suffix)
3. Need to re-sync() after sending to update UTXOs
4. WatchOnlyWallet cannot sign, only query
5. HD wallet uses BIP44 derivation path
6. Use with chronik-client
```

---

## API Reference

### Wallet

**Properties:**

| Property | Type | Description |
|------|------|------|
| `address` | string | Current address |
| `balanceSats` | bigint | XEC balance (satoshis) |
| `utxos` | WalletUtxo[] | UTXO list |
| `sk` | Uint8Array | Private key (if not watch-only) |
| `pk` | Uint8Array | Public key |
| `pkh` | Uint8Array | Public key hash |
| `script` | Script | P2PKH script |
| `isHD` | boolean | Whether HD wallet |

**Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `sync()` | Promise<void> | Sync UTXOs and balance |
| `send(address, sats)` | Promise<{ hex: string }> | Send XEC |
| `broadcast(hex)` | Promise<string> | Broadcast transaction |
| `getNextReceiveAddress()` | string | Get next receive address |
| `getNextChangeAddress()` | string | Get next change address |
| `incrementReceiveIndex()` | void | Increment receive address index |
| `action(tokenType, tokenId, quantity, outputs)` | Action | Create Token operation |

### WatchOnlyWallet

**Static Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `fromAddress(address, chronik)` | WatchOnlyWallet | Create from address |
| `fromXpub(xpub, chronik, options?)` | WatchOnlyWallet | Create from xpub |

**Properties:**

| Property | Type | Description |
|------|------|------|
| `address` | string | Monitored address |
| `balanceSats` | bigint | Balance |
| `utxos` | ScriptUtxo[] | UTXO list |

### BIP44 Derivation Path

```
Base path: m/44'/1899'/<accountNumber>'

Receive address: m/44'/1899'/<accountNumber>'/0/<index>
Change address: m/44'/1899'/<accountNumber>'/1/<index>
```

**1899** is the BIP44 coin type dedicated to eCash.

---

## Code Examples

### Complete Wallet Application

```typescript
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

class EcashWalletApp {
  private wallet: Wallet;
  private chronik: ChronikClient;

  constructor(mnemonic: string) {
    this.chronik = new ChronikClient(['https://chronik.e.cash/xec']);
    this.wallet = Wallet.fromMnemonic(mnemonic, this.chronik, { hd: true });
  }

  async start() {
    await this.wallet.sync();
    console.log(`Wallet ready`);
    console.log(`Address: ${this.wallet.address}`);
    console.log(`Balance: ${this.wallet.balanceSats} sats`);
  }

  async getNewAddress(): Promise<string> {
    const addr = this.wallet.getNextReceiveAddress();
    this.wallet.incrementReceiveIndex();
    return addr;
  }

  async send(to: string, amount: bigint) {
    if (amount > this.wallet.balanceSats) {
      throw new Error('Insufficient balance');
    }

    const { hex } = await this.wallet.send(to, amount);
    const txid = await this.wallet.broadcast(hex);

    // Re-sync to update UTXOs
    await this.wallet.sync();

    return txid;
  }
}
```

### Handling Multiple UTXOs

```typescript
// Get all UTXOs
for (const utxo of wallet.utxos) {
  console.log(`TXID: ${utxo.txid}:${utxo.outIdx}`);
  console.log(`Amount: ${utxo.sats} sats`);
  console.log(`Script: ${utxo.script}`);
}

// Get UTXO combination for specific amount
function selectUtxos(utxos: WalletUtxo[], target: bigint): WalletUtxo[] {
  let total = 0n;
  const selected: WalletUtxo[] = [];

  for (const utxo of utxos) {
    selected.push(utxo);
    total += utxo.sats;
    if (total >= target) break;
  }

  if (total < target) {
    throw new Error('Insufficient UTXO');
  }

  return selected;
}
```

### HD Wallet Address Derivation

```typescript
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.e.cash/xec']);

// Create HD wallet
const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  accountNumber: 0,
  receiveIndex: 0,
  changeIndex: 0,
});

await hdWallet.sync();

// Generate batch of receive addresses
const receiveAddresses: string[] = [];
for (let i = 0; i < 5; i++) {
  receiveAddresses.push(hdWallet.address);
  hdWallet.incrementReceiveIndex();
}

console.log('Receive addresses:', receiveAddresses);
```

### Watch-Only Monitoring

```typescript
import { WatchOnlyWallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

async function monitorAddress(address: string) {
  const chronik = new ChronikClient(['https://chronik.e.cash/xec']);
  const wow = WatchOnlyWallet.fromAddress(address, chronik);

  // WebSocket monitoring
  const ws = chronik.ws({
    onMessage: async (msg) => {
      if (msg.type === 'TX_ADDED_TO_MEMPOOL' || msg.type === 'TX_CONFIRMED') {
        await wow.sync(); // Update balance
        console.log(`New transaction! Current balance: ${wow.balanceSats} sats`);
      }
    },
    autoReconnect: true,
  });

  await ws.waitForOpen();
  ws.subscribeToAddress(address);

  return wow;
}
```

---

## Token Operations

### SLP Token Transfer

```typescript
// Send SLP Token
const action = wallet.action(
  'SLP',
  tokenId,
  1000n,  // token quantity
  [
    { address: recipientAddress, amount: 1000n }
  ]
);

await action.build();
await action.sign();
await action.broadcast();
```

### ALP Token Operations

```typescript
// ALP Genesis (Create Token)
const action = wallet.action(
  'ALP',
  'GENESIS',  // Use 'GENESIS' for new token
  initialSupply,
  [{ address: wallet.address, amount: initialSupply }]
);

// ALP Send
const action = wallet.action(
  'ALP',
  tokenId,
  sendAmount,
  [{ address: recipientAddress, amount: sendAmount }]
);
```

---

## Troubleshooting

### Common Issues

**Q: Balance is 0 after sync()**
- Confirm Chronik node is reachable
- Check if address is correct
- Confirm on-chain transfer has occurred

**Q: send() fails "Insufficient funds"**
- Insufficient balance (need to include fee)
- UTXO is locked
- Need to sync() first to update UTXOs

**Q: HD wallet address mismatch**
- Check if derivation path is correct
- Confirm mnemonic word order is correct
- Verify accountNumber

**Q: WatchOnlyWallet cannot sign**
- This is by design, WatchOnly is read-only
- Use Wallet class if signing is needed

**Q: Token operation fails**
- Check if tokenId is correct
- Confirm Token balance is sufficient
- Check tokenType ('SLP' or 'ALP')

### Debugging Tips

```typescript
// Enable verbose logs
const wallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  verbose: true, // if supported
});

// View all UTXOs
console.log(JSON.stringify(wallet.utxos, null, 2));

// Calculate available balance (minus fee)
const feeEstimate = 1000n; // ~1k sats
const availableBalance = wallet.balanceSats - feeEstimate;
```

### Dependency Versions

```json
{
  "dependencies": {
    "chronik-client": "^4.1.0",
    "ecash-lib": "^4.8.0"
  }
}
```
