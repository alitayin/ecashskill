---
name: chronik-client
description: JavaScript/TypeScript client for Chronik Indexer API
version: 4.1.0
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
