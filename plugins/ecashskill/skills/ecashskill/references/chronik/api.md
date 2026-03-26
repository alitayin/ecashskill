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
BLK_CONNECTED = 0       # Block connected
TX_ADDED_TO_MEMPOOL = 0 # Tx entered mempool
TX_CONFIRMED = 2        # Tx confirmed
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
