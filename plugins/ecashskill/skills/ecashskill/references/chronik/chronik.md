---
name: chronik
description: High-performance blockchain indexer built into Bitcoin ABC node for eCash
version: 1.0.0
tags: [chronik, indexer, blockchain, protocol, websocket]
---

# Chronik

High-performance blockchain indexer built into Bitcoin ABC node.

**Repository**: github.com/Bitcoin-ABC/bitcoin-abc (`/chronik/`)
**Client**: chronik-client npm package
**Default Port**: 8331

## Quick Start

```typescript
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.e.cash/']);
```

## Key Endpoints

```typescript
// Blockchain
chronik.block(hashOrHeight)
chronik.blockTxs(hashOrHeight)

// Transactions
chronik.tx(txid)
chronik.broadcastTx(rawTx)

// Addresses
chronik.address(addr).utxos()
chronik.address(addr).history()

// Tokens
chronik.token(tokenId)
chronik.tokenId(tokenId).utxos()
```

## WebSocket

```typescript
const ws = chronik.ws({
  onMessage: handleMessage,
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();
ws.subscribeToBlocks();
ws.subscribeToAddress('ecash:q...');
```

## Data Conventions

- Transaction IDs: little-endian hex strings
- Block hashes: little-endian
- Satoshi amounts: int64
- Timestamps: Unix seconds
