---
name: chronik-api
description: HTTP and WebSocket endpoint reference for the Chronik eCash indexer API
version: 1.0.0
tags: [chronik, api, websocket, http, tokens]
---

# Chronik API Reference

## HTTP Endpoints

```
GET /block/:hash_or_height       # Get block
GET /tx/:txid                    # Get transaction
POST /broadcast-tx                # Broadcast transaction
GET /script/:type/:payload/utxos  # UTXOs
GET /script/:type/:payload/history # History
GET /token/:txid                 # Token info
```

## WebSocket Message Types

```
BLK_CONNECTED        # Block connected
BLK_DISCONNECTED     # Block disconnected
BLK_FINALIZED        # Block Avalanche finalized
TX_ADDED_TO_MEMPOOL  # Tx entered mempool
TX_REMOVED_FROM_MEMPOOL # Tx removed from mempool
TX_CONFIRMED         # Tx confirmed
TX_FINALIZED        # Tx Avalanche finalized
```

## Token Types

```typescript
// SLP
SLP_TOKEN_TYPE_FUNGIBLE = 1
SLP_TOKEN_TYPE_NFT1_GROUP = 0x81
SLP_TOKEN_TYPE_NFT1_CHILD = 0x41

// ALP
ALP_TOKEN_TYPE_STANDARD = 0
```

## Recommended Nodes

- `https://chronik.e.cash`
- `http://localhost:8331` (local Bitcoin ABC)

## Query Patterns

- Use `/script/:type/:payload/utxos` for spendable state.
- Use `/script/:type/:payload/history` for paginated address activity.
- Use `/token/:txid` before constructing SLP or ALP token operations.
- Use WebSocket subscriptions for UX freshness, but confirm final state with HTTP queries.

## Broadcast Safety

If a broadcast request times out, do not assume it failed. Reconstruct or derive the
transaction id, query `/tx/:txid`, and only rebroadcast after you know the network
did not accept it.
