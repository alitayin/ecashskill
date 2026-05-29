---
name: mock-chronik-client
description: Testing utility that mocks Chronik indexer client for unit tests
version: 3.4.0
tags: [testing, mock, chronik, unit-test, websocket]
---

# mock-chronik-client

Mock Chronik client for unit testing.

**npm**: `mock-chronik-client`

## Usage

```typescript
import { MockChronikClient } from 'mock-chronik-client';

const mockChronik = new MockChronikClient();

mockChronik.setChronikInfo({ version: '1.0.0' });
mockChronik.setBlockchainInfo({ tipHeight: 800000 });

// Set UTXO
mockChronik.setUtxosByAddress(address, [{
  outpoint: { txid: '0'.repeat(64), outIdx: 0 },
  sats: 1000000n,
  script: new Uint8Array([118, 169, 20, ...]),
  blockHeight: 799000,
}]);

// Query
const utxos = await mockChronik.address(address).utxos();
```

## Mock Errors

```typescript
mockChronik.setTx(txid, new Error('Not found'));

try {
  await mockChronik.tx(txid);
} catch (e) {
  console.log(e.message); // 'Not found'
}
```

## API Reference

| Method | Description |
|------|------|
| `setChronikInfo(info)` | Set Chronik version |
| `setBlockchainInfo(info)` | Set blockchain state |
| `setTx(txid, tx)` | Set transaction or error |
| `setUtxosByAddress(addr, utxos)` | Set address UTXOs |
| `setToken(tokenId, token)` | Set Token info |

## What to Mock

| Scenario | Fixture |
|----------|---------|
| Spend XEC | Address UTXOs with enough sats and matching output scripts |
| Insufficient funds | Empty UTXO set or UTXOs below send amount plus fee |
| Token send | Token UTXOs plus token metadata |
| Broadcast error | `broadcastTx` rejection or duplicate transaction response |
| Missing transaction | `setTx(txid, new Error('Not found'))` |

## Best Practices

```typescript
beforeEach(() => {
  mockChronik = new MockChronikClient();
  mockChronik.setChronikInfo({ version: '1.0.0' });
  mockChronik.setBlockchainInfo({ tipHeight: 800000 });
});

afterEach(() => {
  mockChronik = null;
});
```

Keep mock state local to each test. Shared mock clients make transaction-order bugs
hard to diagnose and can hide missing sync calls.
