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
} catch (e) {
  if (e.message.includes('Not Found')) {
    console.log('Tx not indexed');
  }
}
```
