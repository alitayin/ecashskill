---
name: chronik
description: High-performance blockchain indexer built into Bitcoin ABC node for eCash
version: 1.0.0
tags: [chronik, indexer, blockchain, protocol, websocket]
---

# Chronik Skill

Use this skill when working with eCash blockchain indexing and Chronik API integration.

## Overview

Chronik is a high-performance blockchain indexer built into Bitcoin ABC node that provides fast indexing of blocks, transactions, scripts, and Tokens for the eCash blockchain.

**Repository**: github.com/Bitcoin-ABC/bitcoin-abc (directory `/chronik/`)
**Client**: chronik-client npm package
**Default Port**: 8331

## Quick Start

```typescript
import { ChronikClient } from 'chronik-client';

// Connect to remote node
const chronik = new ChronikClient(['https://chronik.e.cash/xec']);

// Or local node
const chronik = new ChronikClient(['http://localhost:8331']);
```

## When to Use

Use this skill when:
- Querying blockchain data (blocks, transactions, addresses)
- Subscribing to real-time blockchain events via WebSocket
- Working with SLP/ALP Tokens
- Building blockchain explorers or wallets
- Monitoring address activity

## Core Capabilities

### Blockchain Queries
- Query blocks by hash or height
- Get transaction details by txid
- Fetch address transaction history
- Get UTXOs for addresses

### Real-time Subscriptions
- WebSocket subscriptions for new blocks
- Address transaction notifications
- Token transfer alerts

### Token Support
- SLP Token queries
- ALP (eCash native) Token support

## Key Endpoints

```typescript
// Block queries
chronik.block(hashOrHeight)
chronik.blockTxs(hashOrHeight)

// Transaction queries
chronik.tx(txid)
chronik.broadcastTx(rawTx)

// Address queries
chronik.address(addr).utxos()
chronik.address(addr).history()

// Token queries
chronik.token(tokenId)
chronik.tokenId(tokenId).utxos()
chronik.tokenId(tokenId).history()
```

## Prompt Templates

When the user says things like:
- "Query all UTXOs for an address"
- "Listen for new block notifications"
- "Find token holders for a specific Token"
- "Check transaction confirmation status"
- "Get all transaction history for a script"

## WebSocket Usage

```typescript
const ws = chronik.ws({
  onMessage: handleMessage,
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();
ws.subscribeToBlocks();
ws.subscribeToAddress('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx');
```

## Data Conventions

- Transaction IDs use little-endian hex strings
- Block hashes use little-endian
- Script payloads use hex encoding
- Satoshi amounts use int64
- Timestamps use Unix seconds
- Set `autoReconnect: true` for WebSocket

## Related Skills

- chronik-client: Client library for Chronik
- ecash-wallet: HD wallet using Chronik
- ecash-lib: Transaction building and signing

## References

See `references/api.md` for complete API reference.
See `references/examples.md` for code examples.
