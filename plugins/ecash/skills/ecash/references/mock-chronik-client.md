---
name: mock-chronik-client
description: Testing utility that mocks Chronik indexer client for unit tests
version: 3.1.1
tags: [testing, mock, chronik, unit-test, websocket]
---

# mock-chronik-client

Testing mock library for Chronik client, used to simulate blockchain state and API responses in unit tests.

## Overview

mock-chronik-client provides:
- Complete Chronik API mocking
- WebSocket subscription mocking
- Blockchain state mocking (blocks, transactions, UTXOs)
- Error mocking (for testing error handling)
- Agora market mocking

**npm**: `mock-chronik-client`
**Version**: 3.1.1
**Official Repository**: github.com/Bitcoin-ABC/bitcoin-abc (modules/mock-chronik-client)
**Dependencies**: chronik-client, ecashaddrjs, ws

---

## Claude Code Usage Guide

### Installation

```bash
npm install --save-dev mock-chronik-client
```

### Basic Usage

```typescript
import { MockChronikClient } from 'mock-chronik-client';

const mockChronik = new MockChronikClient();

// Set mock data
mockChronik.setChronikInfo({ version: '1.0.0' });
mockChronik.setBlockchainInfo({ tipHeight: 800000 });
```

### Mock Transactions and UTXOs

```typescript
const txid = '0f3c3908a2ddec8dea91d2fe1f77295bbbb158af869bff345d44ae800f0a5498';
const address = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

// Set transaction
mockChronik.setTx(txid, {
  version: 2,
  inputs: [...],
  outputs: [...],
  lockTime: 0,
});

// Set UTXO
mockChronik.setUtxosByAddress(address, [
  {
    outpoint: { txid, outIdx: 0 },
    sats: 100000n,
    script: '76a914...',
    blockHeight: 800000,
  },
]);

// Query mock data
const utxos = await mockChronik.address(address).utxos();
```

### Mock Broadcast Transaction

```typescript
mockChronik.setBroadcastTx(rawTx, expectedTxid);

const { txid } = await mockChronik.broadcastTx(rawTx);
console.log(txid === expectedTxid); // true
```

### Mock WebSocket

```typescript
const ws = mockChronik.ws({
  onMessage: (msg) => console.log('Message:', msg),
});

await ws.waitForOpen();

ws.subscribeToBlocks();
ws.subscribeToAddress('ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v');
ws.subscribeToTokenId('token_id_here');

// Unsubscribe
ws.unsubscribeFromBlocks();
```

### Mock Errors

```typescript
const error = new Error('Transaction not found');

mockChronik.setTx(txid, error);

// Test error handling
try {
  await mockChronik.tx(txid);
} catch (e) {
  console.log(e.message); // 'Transaction not found'
}
```

### Mock Agora

```typescript
import { MockAgora } from 'mock-chronik-client';

const mockAgora = new MockAgora();

// Set mock offers
mockAgora.setOfferedGroupTokenIds(['tokenId1', 'tokenId2']);
mockAgora.setActiveOffersByPubKey(pubkeyHex, offers);
mockAgora.setActiveOffersByTokenId(tokenId, offers);
```

### Prompt Templates

```
I need to write unit tests for chronik-client

I need to mock a transaction return result

I need to test WebSocket subscription functionality

I need to mock blockchain error scenarios

I need to test wallet balance queries
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# mock-chronik-client Configuration
- name: "mock-chronik-client"
  description: "Chronik test mocking library"
  files:
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/__tests__/**"
  rules:
    - type: "import"
      statement: |
        import { MockChronikClient } from 'mock-chronik-client';
        import { MockAgora } from 'mock-chronik-client';

    - type: "setup"
      statement: |
        // Setup mock before test
        beforeEach(() => {
          mockChronik = new MockChronikClient();
          mockChronik.setChronikInfo({ version: '1.0.0' });
          mockChronik.setBlockchainInfo({ tipHeight: 800000 });
        });

    - type: "mock-data"
      statement: |
        // Mock common data
        mockChronik.setTx(txid, mockTransaction);
        mockChronik.setUtxosByAddress(address, [mockUtxo]);
        mockChronik.setToken(tokenId, mockTokenInfo);

    - type: "error-mock"
      statement: |
        // Mock errors
        mockChronik.setTx(txid, new Error('Not found'));
        await expect(chronik.tx(txid)).rejects.toThrow('Not found');

    - type: "teardown"
      statement: |
        // Cleanup after test
        afterEach(() => {
          mockChronik = null;
        });
```

### AI Role Settings

```
When using mock-chronik-client to write tests:

1. Create new MockChronikClient instance in beforeEach
2. Use setTx, setUtxosByAddress etc. to set mock data
3. Can mock any error scenario
4. WebSocket methods are the same as real chronik-client
5. Includes MockAgora for testing Agora offers
```

---

## API Reference

### MockChronikClient

#### Initialization

```typescript
const mockChronik = new MockChronikClient();
```

#### Blockchain Info

| Method | Description |
|------|------|
| `setChronikInfo(info)` | Set Chronik version info |
| `setBlockchainInfo(info)` | Set blockchain state |

#### Transactions

| Method | Description |
|------|------|
| `setTx(txid, tx)` | Set transaction data or error |
| `setBroadcastTx(rawTx, txid)` | Set broadcast result |
| `setRawTx(txid, rawHex)` | Set raw transaction |
| `setToken(tokenId, token)` | Set Token info |

#### Address/Script

| Method | Description |
|------|------|
| `setUtxosByAddress(addr, utxos)` | Set address UTXOs |
| `setTxHistoryByAddress(addr, txs)` | Set address transaction history |
| `setUtxosByScript(type, hash, utxos)` | Set script UTXOs |
| `setTxHistoryByScript(type, hash, txs)` | Set script transaction history |

#### Token

| Method | Description |
|------|------|
| `setUtxosByTokenId(tokenId, utxos)` | Set Token UTXOs |
| `setTxHistoryByTokenId(tokenId, txs)` | Set Token transaction history |

#### LokadId

| Method | Description |
|------|------|
| `setTxHistoryByLokadId(lokadId, txs)` | Set LokadId transaction history |

#### Blocks

| Method | Description |
|------|------|
| `setBlock(hashOrHeight, block)` | Set block data |

#### WebSocket

```typescript
const ws = mockChronik.ws({ onMessage: handler });

ws.subscribeToBlocks();
ws.unsubscribeFromBlocks();
ws.subscribeToTxs();
ws.subscribeToScript(type, payload);
ws.subscribeToAddress(address);
ws.subscribeToTokenId(tokenId);
ws.subscribeToLokadId(lokadId);
ws.subscribeToPlugin(pluginName, groupHex);
```

### MockAgora

```typescript
const mockAgora = new MockAgora();

mockAgora.setOfferedGroupTokenIds(ids);
mockAgora.setOfferedFungibleTokenIds(ids);
mockAgora.setActiveOffersByTokenId(tokenId, offers);
mockAgora.setActiveOffersByGroupTokenId(groupId, offers);
mockAgora.setActiveOffersByPubKey(pubkey, offers);
mockAgora.setHistoricOffers(params, result);
```

---

## Code Examples

### Complete Test Example

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockChronikClient } from 'mock-chronik-client';
import { Wallet } from 'ecash-wallet';

describe('Wallet Balance Tests', () => {
  let mockChronik;
  let wallet;
  const testMnemonic = 'morning average minor stable parrot refuse credit exercise february mirror just begin';
  const testAddress = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

  beforeEach(() => {
    mockChronik = new MockChronikClient();

    // Set blockchain state
    mockChronik.setChronikInfo({ version: '1.0.0' });
    mockChronik.setBlockchainInfo({ tipHeight: 800000 });

    // Set UTXO
    mockChronik.setUtxosByAddress(testAddress, [
      {
        outpoint: {
          txid: '0'.repeat(64),
          outIdx: 0,
        },
        sats: 1000000n,
        script: new Uint8Array([118, 169, 20, ...]), // P2PKH script
        blockHeight: 799000,
      },
    ]);
  });

  afterEach(() => {
    mockChronik = null;
  });

  it('should sync wallet balance', async () => {
    const wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();

    expect(wallet.balanceSats).toBe(1000000n);
  });

  it('should return empty balance for new address', async () => {
    mockChronik.setUtxosByAddress(newAddress, []);
    const wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();

    expect(wallet.balanceSats).toBe(0n);
  });
});
```

### WebSocket Test

```typescript
describe('WebSocket Subscriptions', () => {
  let mockChronik;
  let messages: any[];

  beforeEach(() => {
    mockChronik = new MockChronikClient();
    messages = [];
  });

  it('should receive block notifications', async () => {
    const ws = mockChronik.ws({
      onMessage: (msg) => messages.push(msg),
    });

    await ws.waitForOpen();
    ws.subscribeToBlocks();

    // Simulate new block
    ws.simulateBlockConnected({
      hash: '00'.repeat(32),
      height: 800001,
    });

    expect(messages).toContainEqual(
      expect.objectContaining({
        type: 'BLK_CONNECTED',
      })
    );
  });

  it('should receive address notifications', async () => {
    const testAddress = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

    const ws = mockChronik.ws({
      onMessage: (msg) => messages.push(msg),
    });

    await ws.waitForOpen();
    ws.subscribeToAddress(testAddress);

    // Simulate transaction
    ws.simulateTxAddedToMempool({
      txid: '11'.repeat(32),
      outputs: [{ address: testAddress, sats: 50000 }],
    });

    expect(messages).toContainEqual(
      expect.objectContaining({
        type: 'TX_ADDED_TO_MEMPOOL',
      })
    );
  });
});
```

### Error Handling Test

```typescript
describe('Error Handling', () => {
  let mockChronik;

  beforeEach(() => {
    mockChronik = new MockChronikClient();
  });

  it('should simulate not found error', async () => {
    mockChronik.setTx('nonexistent_txid', new Error('Transaction not found'));

    await expect(mockChronik.tx('nonexistent_txid')).rejects.toThrow(
      'Transaction not found'
    );
  });

  it('should simulate network error', async () => {
    mockChronik.setBroadcastTx(rawTx, new Error('Network timeout'));

    await expect(mockChronik.broadcastTx(rawTx)).rejects.toThrow(
      'Network timeout'
    );
  });

  it('should simulate insufficient funds', async () => {
    // Verify wallet logic in actual test
    const wallet = Wallet.fromMnemonic(mnemonic, mockChronik);
    await wallet.sync();

    // Simulate balance as 0
    mockChronik.setUtxosByAddress(wallet.address, []);

    await expect(wallet.send(recipient, 1000n)).rejects.toThrow(
      'Insufficient funds'
    );
  });
});
```

### Integration Test Example

```typescript
describe('Send Transaction Integration', () => {
  let mockChronik;
  let wallet;
  const recipient = 'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0';

  beforeEach(async () => {
    mockChronik = new MockChronikClient();
    mockChronik.setChronikInfo({ version: '1.0.0' });
    mockChronik.setBlockchainInfo({ tipHeight: 800000 });

    // Set UTXO with balance
    const { utxo, txid } = await createMockUtxo(mockChronik, {
      sats: 1000000n,
    });

    wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();
  });

  it('should send XEC successfully', async () => {
    const sendAmount = 500000n;
    const originalBalance = wallet.balanceSats;

    const { hex } = await wallet.send(recipient, sendAmount);

    // Verify broadcast was called
    mockChronik.setBroadcastTx(hex, 'mock_txid');
    const result = await wallet.broadcast(hex);

    // Balance should decrease after re-sync
    await wallet.sync();
    expect(wallet.balanceSats).toBeLessThan(originalBalance);
  });
});
```

---

## Troubleshooting

### Common Issues

**Q: Mock data not taking effect**
- Confirm set* method was called before query
- Check if address format is correct
- Confirm correct set method was used (byAddress vs byScript)

**Q: WebSocket message not triggering**
- Ensure waitForOpen() was called
- Check if subscription was correct (subscribeTo*)
- Confirm onMessage callback is correctly set

**Q: Error mock not working**
- Ensure error is an Error instance
- Check error is set on correct txid

**Q: Data pollution between tests**
- Create new instance in beforeEach
- Cleanup in afterEach

### Best Practices

```typescript
// 1. Create new instance for each test
beforeEach(() => {
  mockChronik = new MockChronikClient();
});

// 2. Set base state
mockChronik.setChronikInfo({ version: '1.0.0' });
mockChronik.setBlockchainInfo({ tipHeight: 800000 });

// 3. Use factory functions for complex mock data
function createMockTx(overrides = {}) {
  return {
    version: 2,
    inputs: [],
    outputs: [],
    lockTime: 0,
    ...overrides,
  };
}

// 4. Cleanup
afterEach(() => {
  mockChronik = null;
});
```

### Debugging Tips

```typescript
// Enable debug logs
const mockChronik = new MockChronikClient({
  debug: true,
});

// View all called methods
mockChronik.onCall((method, args) => {
  console.log(method, args);
});

// Verify method calls
expect(mockChronik.tx).toHaveBeenCalledWith(txid);
```
