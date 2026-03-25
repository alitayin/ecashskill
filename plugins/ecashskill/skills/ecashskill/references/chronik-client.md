---
name: chronik-client
description: JavaScript/TypeScript client for Chronik Indexer API
version: 4.1.0
tags: [chronik, blockchain, indexer, websocket, api]
---

# chronik-client

JavaScript/TypeScript client for Chronik Indexer API, used to access eCash blockchain indexed data.

## Overview

chronik-client provides methods to access the Chronik indexer:
- Transaction queries (confirmed and unconfirmed)
- Address/script history queries
- UTXO queries
- Token information queries (SLP/ALP)
- Blockchain block queries
- WebSocket real-time subscriptions
- Transaction broadcasting

**npm**: `chronik-client`
**Version**: v4.1.0
**Official Documentation**: https://chronik.e.cash/

---

## Claude Code Usage Guide

### Installation

```bash
npm install chronik-client
```

### Initialize Client

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';

// Method 1: Direct connection
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);

// Method 2: Auto-select node with lowest latency
const chronik = await ChronikClient.useStrategy(
  ConnectionStrategy.ClosestFirst,
  ['https://chronik1.example.com', 'https://chronik2.example.com']
);
```

### Common Queries

```typescript
// Query transaction
const tx = await chronik.tx('0f3c3908a2ddec8dea91d2fe1f77295bbbb158af869bff345d44ae800f0a5498');

// Query address UTXOs
const utxos = await chronik.address('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx').utxos();

// Query address history
const history = await chronik.address('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx').history(0, 50);

// Query Token information
const token = await chronik.token('token_id_here');

// Query block
const block = await chronik.block(800000);
```

### Transaction Broadcasting

```typescript
// Broadcast transaction
const result = await chronik.broadcastTx('raw_tx_hex_here');

// Broadcast and wait for confirmation
const result = await chronik.broadcastAndFinalizeTx('raw_tx_hex_here');

// Validate transaction
const validation = await chronik.validateRawTx('raw_tx_hex_here');
```

### WebSocket Real-time Subscriptions

```typescript
const ws = chronik.ws({
  onMessage: (msg) => {
    console.log('Update:', msg);
    // msg.type: 'BLK_CONNECTED', 'BLK_DISCONNECTED', 'TX_ADDED_TO_MEMPOOL', etc.
  },
  onConnect: () => console.log('Connected'),
  onReconnect: (e) => console.log('Reconnecting:', e),
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();

// Subscribe to block notifications
ws.subscribeToBlocks();

// Subscribe to specific address
ws.subscribeToAddress('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx');

// Subscribe to all transactions
ws.subscribeToTxs();

// Subscribe to Token
ws.subscribeToTokenId('token_id_here');
```

### Prompt Templates

```
I need to query all UTXOs for address [address]

I need to get detailed information for transaction [txid]

I need to subscribe to new transaction notifications for [address]

I need to broadcast a signed transaction
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# chronik-client Configuration
- name: "chronik-client"
  description: "eCash Chronik Indexer API client configuration"
  files:
    - "**/*chronik*"
    - "**/wallet/**/*.ts"
    - "**/blockchain/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { ChronikClient, ConnectionStrategy } from 'chronik-client';

    - type: "best-practice"
      statement: |
        // Recommended to use ConnectionStrategy.ClosestFirst for auto-selecting optimal node
        const chronik = await ChronikClient.useStrategy(
          ConnectionStrategy.ClosestFirst,
          ['https://chronik.be.cash/xec']
        );

    - type: "error-handling"
      statement: |
        // Handle chronik connection errors
        try {
          const tx = await chronik.tx(txid);
        } catch (error) {
          if (error.message.includes('Not Found')) {
            console.error('Transaction not found:', txid);
          } else if (error.message.includes('timeout')) {
            console.error('Chronik request timeout');
          }
        }

    - type: "websocket"
      statement: |
        // Remember to handle disconnection and reconnection after WebSocket subscription
        const ws = chronik.ws({
          onMessage: handleMessage,
          onReconnect: (e) => console.log('Reconnecting...'),
          autoReconnect: true,
          keepAlive: true,
        });
```

### AI Role Settings

```
When writing code involving chronik-client:

1. Use ConnectionStrategy.ClosestFirst as default connection strategy
2. WebSocket subscriptions always set autoReconnect: true and keepAlive: true
3. Query methods return Promise, remember to use async/await
4. After transaction broadcasting, recommend using broadcastAndFinalizeTx to wait for confirmation
5. Use convenience method chronik.address() for address queries instead of script()
```

---

## API Reference

### ChronikClient

| Method | Description |
|------|------|
| `tx(txid)` | Query transaction details |
| `rawTx(txid)` | Query raw transaction |
| `address(addr)` | Query address (returns ScriptEndpoint) |
| `script(type, payload)` | Query script |
| `block(hashOrHeight)` | Query block |
| `blocks(start, end)` | Query block range |
| `token(tokenId)` | Query Token |
| `broadcastTx(rawTx)` | Broadcast transaction |
| `broadcastAndFinalizeTx(rawTx)` | Broadcast and wait for confirmation |
| `validateRawTx(rawTx)` | Validate transaction |
| `chronikInfo()` | Get Chronik service information |
| `blockchainInfo()` | Get blockchain information |
| `ws(options)` | Create WebSocket connection |

### ScriptEndpoint

| Method | Description |
|------|------|
| `.utxos()` | Get UTXOs |
| `.history(page, pageSize)` | Get transaction history |
| `.confirmedTxs(page, pageSize)` | Get confirmed transactions |
| `.unconfirmedTxs()` | Get unconfirmed transactions |

### TokenIdEndpoint

| Method | Description |
|------|------|
| `.utxos()` | Get Token UTXOs |
| `.history(page, pageSize)` | Get Token history |
| `.confirmedTxs(page, pageSize)` | Get confirmed Token transactions |
| `.unconfirmedTxs()` | Get unconfirmed Token transactions |

### Supported Script Types

- `p2pk` - Pay to Public Key
- `p2pkh` - Pay to Public Key Hash
- `p2sh` - Pay to Script Hash
- `p2tr` - Pay to Taproot

### Supported Token Protocols

- **ALP** (Airdrop Lottery Protocol)
- **SLP** (Simple Ledger Protocol) - including NFT1

---

## Code Examples

### Complete Wallet Monitor Example

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';

class WalletMonitor {
  private chronik: ChronikClient;
  private ws: any;
  private addresses: Set<string>;

  constructor(endpoints: string[]) {
    this.addresses = new Set();
    this.chronik = new ChronikClient(endpoints);
  }

  async start() {
    this.ws = this.chronik.ws({
      onMessage: (msg) => this.handleMessage(msg),
      onReconnect: () => console.log('Chronik reconnecting...'),
      autoReconnect: true,
      keepAlive: true,
    });

    await this.ws.waitForOpen();
    this.ws.subscribeToBlocks();

    for (const addr of this.addresses) {
      this.ws.subscribeToAddress(addr);
    }
  }

  addAddress(address: string) {
    this.addresses.add(address);
    if (this.ws) {
      this.ws.subscribeToAddress(address);
    }
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'BLK_CONNECTED':
        console.log('New block:', msg.blockHash);
        break;
      case 'TX_ADDED_TO_MEMPOOL':
        this.checkAddressTx(msg.txData);
        break;
    }
  }

  private async checkAddressTx(txData: any) {
    for (const addr of this.addresses) {
      if (txData.outputs.some((o: any) => o.address === addr)) {
        console.log('Incoming payment to:', addr);
      }
    }
  }
}
```

### Error Handling

```typescript
// Handle common errors
async function safeQuery(chronik: ChronikClient, txid: string) {
  try {
    return await chronik.tx(txid);
  } catch (err: any) {
    if (err.message.includes('Not Found') || err.message.includes('404')) {
      return null; // Transaction does not exist
    }
    if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
      throw new Error('Chronik node unavailable, please retry later');
    }
    throw err; // Other errors continue to throw
  }
}
```

---

## Troubleshooting

### Common Issues

**Q: WebSocket frequently disconnects**
```typescript
// Ensure keepAlive and autoReconnect are set
const ws = chronik.ws({
  keepAlive: true,
  autoReconnect: true,
});
```

**Q: Transaction query returns 404**
- Check if txid is correct (64-character hex)
- Transaction may not yet be indexed (wait a few seconds and retry)

**Q: Address format issue**
- Ensure using full CashAddr format: `ecash:q...`
- Or use prefixes like `bitcoincash:q...`

**Q: Broadcast fails**
- Use `validateRawTx` to validate transaction first
- Check if transaction fee is sufficient

### Recommended Chronik Nodes

- `https://chronik.be.cash/xec`
- `https://chronik.e.cash` (official)

### Debugging Tips

```typescript
// Enable detailed logs
const chronik = new ChronikClient(['https://chronik.be.cash/xec'], {
  timeout: 30000,
  debug: true,
});
```
