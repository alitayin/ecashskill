---
name: chronik-client
description: JavaScript/TypeScript client for Chronik Indexer API
version: 4.3.0
tags: [chronik, blockchain, indexer, websocket, api]
---

# chronik-client

JavaScript/TypeScript client for Chronik Indexer API.

**npm**: `chronik-client`
**Official Documentation**: https://chronik.e.cash/

## Quick Start

```typescript
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.e.cash/']);
```

## Common Queries

```typescript
// Transaction
const tx = await chronik.tx('txid');

// Address UTXOs
const utxos = await chronik.address('ecash:q...').utxos();

// Address history
const history = await chronik.address('ecash:q...').history(0, 50);

// Token info
const token = await chronik.token('token_id');

// Block
const block = await chronik.block(800000);
```

## Recommended Client Setup

```typescript
const chronik = new ChronikClient([
  'https://chronik.e.cash/',
  'https://chronik.be.cash/',
]);
```

Use more than one endpoint for user-facing apps. Keep endpoint configuration outside
business logic so tests can pass a `MockChronikClient` or a local Chronik instance.

## Broadcasting

```typescript
await chronik.broadcastTx('raw_tx_hex');
await chronik.broadcastAndFinalizeTx('raw_tx_hex'); // Wait for confirmation
```

## WebSocket

```typescript
const ws = chronik.ws({
  onMessage: (msg) => console.log(msg),
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();
ws.subscribeToBlocks();
ws.subscribeToAddress('ecash:q...');
ws.subscribeToTokenId('token_id');
```

Always close WebSockets when a component, worker, or script shuts down:

```typescript
ws.unsubscribeFromAddress('ecash:q...');
ws.close();
```

## API Reference

| ChronikClient Method | Description |
|------|------|
| `tx(txid)` | Query transaction |
| `address(addr)` | Query address (returns ScriptEndpoint) |
| `block(hashOrHeight)` | Query block |
| `token(tokenId)` | Query Token |
| `broadcastTx(rawTx)` | Broadcast transaction |
| `ws(options)` | Create WebSocket |

| ScriptEndpoint | Description |
|------|------|
| `.utxos()` | Get UTXOs |
| `.history(page, pageSize)` | Get transaction history |

| TokenIdEndpoint | Description |
|------|------|
| `.utxos()` | Get Token UTXOs |
| `.history(page, pageSize)` | Get Token history |

## Token Protocols

- **ALP** (Airdrop Lottery Protocol)
- **SLP** (Simple Ledger Protocol) - including NFT1

## Error Handling

- Treat `Not Found` responses as expected for unknown txids, token ids, or blocks.
- Retry transient network failures outside the Chronik client boundary.
- Do not retry `broadcastTx` blindly after an ambiguous network failure; first query by txid if you can derive it from the raw transaction.
- Keep pagination explicit. Use bounded page sizes for address or token history scans.
