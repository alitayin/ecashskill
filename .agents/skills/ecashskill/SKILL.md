---
name: ecashskill
description: Comprehensive eCash blockchain development skills. Use when building eCash applications, querying blockchain data, creating transactions, managing wallets, working with tokens, or integrating with eCash infrastructure.
---

# eCash Development Skills

Comprehensive development capabilities for eCash blockchain applications.

## What is eCash?

eCash (XEC) is a cryptocurrency forked from Bitcoin Cash in 2021, built on Bitcoin ABC. It uses Avalanche consensus for fast finality and supports SLP and ALP token standards.

**Key Facts:**
- **Token**: XEC (1 XEC = 100 satoshis)
- **Address Format**: CashAddr with `ecash:` prefix
- **BIP44 Coin Type**: ecash-wallet uses 1899, Electrum ABC uses 899
- **Node**: Bitcoin ABC
- **Consensus**: Avalanche (fast finality)
- **Website**: https://e.cash

## References Overview

| Reference | Purpose | When to Use |
|-----------|---------|-------------|
| `chronik/` | Blockchain indexer API | Querying blockchain data, WebSocket subscriptions |
| `chronik-client.md` | Client library for Chronik | Most blockchain queries |
| `ecash-lib.md` | Transaction building & signing | Raw transactions, custom signing |
| `ecash-wallet.md` | HD wallet implementation | Managing wallets, sending XEC/tokens |
| `ecashaddrjs.md` | Address encoding/decoding | Address validation, format conversion |
| `ecash-agora.md` | Decentralized exchange protocol | Marketplaces, token trading |
| `ecash-quicksend.md` | Quick transaction sending | Simple payments, prototypes |
| `cashtab.md` | Web wallet reference | Wallet UI patterns |
| `cashtab-connect.md` | Browser extension integration | DApp wallet connection |
| `bitcoin-abc.md` | Node implementation | Bitcoin ABC internals |
| `mock-chronik-client.md` | Testing utilities | Writing unit tests |
| `examples.md` | Code examples | Quick reference |

## When to Use

- Querying eCash blockchain data (transactions, UTXOs, blocks)
- Building or signing transactions
- Managing HD wallets
- Working with SLP/ALP tokens
- Integrating with Cashtab or browser extension
- Writing tests for eCash applications
- Building decentralized exchanges with Agora

## Quick Start

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';
const chronik = await ChronikClient.useStrategy(
  ConnectionStrategy.ClosestFirst,
  ['https://chronik.e.cash']
);
```

For available Chronik nodes, see https://chronik.cash
