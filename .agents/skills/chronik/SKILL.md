---
name: chronik
description: Chronik blockchain indexer and chronik-client library. Use when querying blockchain data, subscribing to WebSocket events, fetching transactions, UTXOs, or token history on eCash.
---

# Chronik

Chronik is the high-performance eCash blockchain indexer. Use `chronik-client` for all blockchain queries.

## Quick Start

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';
const chronik = await ChronikClient.useStrategy(
  ConnectionStrategy.ClosestFirst,
  ['https://chronik.e.cash']
);
```

For available nodes see https://chronik.cash

## References

- `references/chronik-client.md` — Client library API
- `references/chronik/api.md` — REST API reference
- `references/chronik/chronik.md` — Indexer internals

## When to Use

- Querying transactions, UTXOs, or blocks
- WebSocket subscriptions for real-time events
- Token history and metadata
- Any blockchain data access
