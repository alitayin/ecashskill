# Chronik API Reference

## HTTP API Endpoints

### Blockchain Info
```
GET /blockchain-info
```

### Block Endpoints
```
GET /block/:hash_or_height          # Get single block
GET /block-header/:hash_or_height   # Get block header
GET /block-txs/:hash_or_height      # Get block transactions
GET /blocks/:start/:end            # Get block range
```

### Transaction Endpoints
```
GET /tx/:txid                      # Get transaction details
GET /raw-tx/:txid                  # Get raw transaction
GET /unconfirmed-txs                # Get unconfirmed transactions
POST /broadcast-tx                 # Broadcast transaction
POST /broadcast-txs                # Broadcast multiple
POST /validate-tx                  # Validate transaction
```

### Script Endpoints
```
GET /script/:type/:payload/history           # Transaction history
GET /script/:type/:payload/utxos            # UTXO list
GET /script/:type/:payload/confirmed-txs     # Confirmed transactions
GET /script/:type/:payload/unconfirmed-txs # Unconfirmed transactions
```

### Token Endpoints
```
GET /token/:txid                    # Get token info
GET /token-id/:token_id/history     # Token transaction history
GET /token-id/:token_id/utxos       # Token UTXOs
GET /token-id/:token_id/confirmed-txs
GET /token-id/:token_id/unconfirmed-txs
```

## Script Types

| Type | Payload | Description |
|------|---------|-------------|
| `p2pkh` | 20 byte hash | Most common address type |
| `p2sh` | 20 byte hash | P2SH address |
| `p2pk` | 33/65 byte | Pay to Public Key |
| `other` | arbitrary bytes | Custom script |

## WebSocket Message Types

```
BLK_CONNECTED = 0       # Block connected
BLK_DISCONNECTED = 1   # Block disconnected
BLK_FINALIZED = 2      # Block Avalanche finalized
TX_ADDED_TO_MEMPOOL = 0    # Tx entered mempool
TX_REMOVED_FROM_MEMPOOL = 1 # Tx removed from mempool
TX_CONFIRMED = 2           # Tx confirmed
TX_FINALIZED = 3           # Tx Avalanche finalized
```

## Data Structures

### BlockInfo
```typescript
interface BlockInfo {
  hash: Uint8Array;           // Block hash (little-endian)
  prevHash: Uint8Array;       // Previous block hash
  height: number;             // Block height
  nBits: number;            // Difficulty target encoding
  timestamp: number;          // Unix timestamp
  isFinal: boolean;          // Avalanche finalization
  blockSize: number;         // Block size in bytes
  numTxs: number;           // Transaction count
  sumInputSats: bigint;      // Total input satoshis
  sumCoinbaseOutputSats: bigint; // Coinbase reward
  sumNormalOutputSats: bigint;   // Normal output total
  sumBurnedSats: bigint;         // OP_RETURN burn amount
}
```

### Transaction
```typescript
interface Tx {
  txid: Uint8Array;
  version: number;
  inputs: TxInput[];
  outputs: TxOutput[];
  lockTime: number;
  block?: BlockMetadata;
  timeFirstSeen: number;
  size: number;
  isCoinbase: boolean;
  tokenEntries: TokenEntry[];
  tokenStatus: TokenStatus;
  isFinal: boolean;
}
```

### Token Types

```typescript
// SLP Token Types
enum SlpTokenType {
  NONE = 0,
  FUNGIBLE = 1,         // SLP V1 Fungible Token
  MINT_VAULT = 2,      // SLP V2 Mint Vault
  NFT1_GROUP = 0x81,   // NFT1 Group
  NFT1_CHILD = 0x41,  // NFT1 Child
}

// ALP Token Types
enum AlpTokenType {
  STANDARD = 0,          // Standard ALP Token
}

// Token Transaction Types
enum TokenTxType {
  NONE = 0,
  UNKNOWN = 1,
  GENESIS = 2,           // Token creation
  SEND = 3,             // Token transfer
  MINT = 4,             // Mint new tokens
  BURN = 5,             // Burn tokens
}
```

## Recommended Nodes

- `https://chronik.e.cash/xec` - Bitcoin.com maintained
- `http://localhost:8331` - Local Bitcoin ABC node

## Performance Tips

```typescript
// Batch fetch to reduce requests
const blockTxs = await chronik.blockTxs(height, 0, 1000);

// Use WebSocket instead of polling
ws.subscribeToAddress(address); // Real-time notifications

// Limit pagination size to avoid timeout
const history = await chronik.address(addr).history(0, 100); // Not 1000
```
