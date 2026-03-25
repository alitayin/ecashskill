# Chronik Code Examples

## Real-time Transaction Monitor

```typescript
import { ChronikClient } from 'chronik-client';

class TransactionMonitor {
  private chronik: ChronikClient;
  private ws: any;
  private handlers: Map<string, (tx: any) => void>;

  constructor(endpoints: string[]) {
    this.chronik = new ChronikClient(endpoints);
    this.handlers = new Map();
  }

  async start() {
    this.ws = this.chronik.ws({
      onMessage: (msg) => this.handleMessage(msg),
      onReconnect: () => console.log('Chronik reconnecting...'),
      autoReconnect: true,
      keepAlive: true,
    });

    await this.ws.waitForOpen();
    console.log('Connected to Chronik');
  }

  subscribeToAddress(address: string, handler: (tx: any) => void) {
    this.handlers.set(address, handler);
    this.ws.subscribeToAddress(address);
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'TX_ADDED_TO_MEMPOOL':
        this.notifyHandlers(msg.txData, 'mempool');
        break;
      case 'TX_CONFIRMED':
        this.notifyHandlers(msg.txData, 'confirmed');
        break;
      case 'BLK_CONNECTED':
        console.log(`Block ${msg.blockHash} connected`);
        break;
    }
  }

  private notifyHandlers(txData: any, source: string) {
    for (const output of txData.outputs) {
      const handler = this.handlers.get(output.address);
      if (handler) {
        handler({ ...txData, source });
      }
    }
  }
}

// Usage
const monitor = new TransactionMonitor(['https://chronik.e.cash/xec']);
await monitor.start();
monitor.subscribeToAddress('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx', (tx) => {
  console.log('New transaction:', tx.txid);
});
```

## Block Scanner

```typescript
async function scanBlocks(
  chronik: ChronikClient,
  startHeight: number,
  endHeight: number,
  callback: (block: any, txs: any[]) => void
) {
  for (let height = startHeight; height <= endHeight; height++) {
    const blockTxs = await chronik.blockTxs(height, 0, 100);

    for (const txid of blockTxs.txHistory) {
      const tx = await chronik.tx(txid);
      callback({ height }, [tx]);
    }

    console.log(`Scanned block ${height}`);
  }
}

// Usage
await scanBlocks(chronik, 800000, 800100, (block, txs) => {
  console.log(`Block ${block.height}: ${txs.length} transactions`);
});
```

## SLP Token Query

```typescript
// SLP Token query
const token = await chronik.token('token_genesis_txid');
console.log(token.tokenType);    // SLP_TOKEN_TYPE_FUNGIBLE
console.log(token.genesisPoint); // Genesis transaction
console.log(token.tokenMeta);    // Token metadata

// SLP Token transaction history
const txs = await chronik.tokenId('token_id').history(0, 50);
```

## Debug Checklist

```typescript
// 1. Check Chronik connection
const info = await chronik.chronikInfo();
console.log('Chronik version:', info.version);

// 2. Check blockchain sync status
const chainInfo = await chronik.blockchainInfo();
console.log('Tip height:', chainInfo.tipHeight);
console.log('Synced:', chainInfo.synced);

// 3. Check if transaction exists
try {
  const tx = await chronik.tx(txid);
} catch (e) {
  if (e.message.includes('Not Found')) {
    console.log('Tx not found or not indexed');
  }
}
```
