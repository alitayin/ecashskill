---
name: examples
description: Practical Chronik, transaction, and debugging snippets for eCash development
version: 1.0.0
tags: [examples, chronik, websocket, debugging, snippets]
---

# Chronik Code Examples

## Transaction Monitor

```typescript
import { ChronikClient } from 'chronik-client';

const ws = chronik.ws({
  onMessage: (msg) => {
    if (msg.type === 'TX_ADDED_TO_MEMPOOL') {
      console.log('New tx:', msg.txData.txid);
    }
  },
  autoReconnect: true,
});

await ws.waitForOpen();
ws.subscribeToAddress('ecash:q...');
```

## Block Scanner

```typescript
for (let height = startHeight; height <= endHeight; height++) {
  const blockTxs = await chronik.blockTxs(height, 0, 100);
  for (const txid of blockTxs.txHistory) {
    const tx = await chronik.tx(txid);
    // Process tx
  }
}
```

## Debug Checklist

```typescript
// 1. Check connection
const info = await chronik.chronikInfo();

// 2. Check sync status
const chainInfo = await chronik.blockchainInfo();
console.log('Tip height:', chainInfo.tipHeight);

// 3. Check transaction
try {
  const tx = await chronik.tx(txid);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('Not Found')) {
    console.log('Tx not indexed');
  }
}
```

## Address Validation Before Send

```typescript
import ecashaddr from 'ecashaddrjs';

function assertEcashAddress(address: string) {
  const { prefix } = ecashaddr.decode(address);
  if (prefix !== 'ecash') {
    throw new Error(`Expected ecash mainnet address, got ${prefix}`);
  }
}
```

## Unit Conversion Boundary

```typescript
function xecToSats(input: string) {
  const [whole, fraction = ''] = input.split('.');
  const cents = `${whole}${fraction.padEnd(2, '0').slice(0, 2)}`;
  return BigInt(cents);
}
```
