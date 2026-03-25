---
name: ecash
description: Comprehensive eCash blockchain development skills for Claude Code
version: 1.0.0
tags: [ecash, blockchain, bitcoin-abc, chronik, wallet, tokens, xec]
---

# eCash Development Skills

This skill provides comprehensive development capabilities for eCash blockchain applications using Claude Code.

## Overview

eCash is a cryptocurrency that builds on Bitcoin ABC node technology. This skill covers the entire eCash development ecosystem.

## When to Use

Use this skill when:
- Building applications on eCash blockchain
- Integrating with Chronik indexer
- Creating or managing eCash wallets
- Working with SLP/ALP Tokens
- Developing payment solutions
- Analyzing blockchain data

## Tools & Libraries

### Infrastructure
- **chronik** - High-performance blockchain indexer (see `references/chronik.md`)
- **chronik-client** - Client library for Chronik (see `references/chronik-client.md`)
- **bitcoin-abc** - Node implementation (see `references/bitcoin-abc.md`)

### Transaction & Signing
- **ecash-lib** - Transaction building and signing (see `references/ecash-lib.md`)

### Wallet
- **ecash-wallet** - HD wallet with XEC and token support (see `references/ecash-wallet.md`)

### Utilities
- **ecashaddrjs** - Address encoding/decoding (see `references/ecashaddrjs.md`)

### Applications
- **cashtab** - Web wallet reference (see `references/cashtab.md`)
- **cashtab-connect** - Browser extension integration (see `references/cashtab-connect.md`)
- **ecash-agora** - Marketplace application (see `references/ecash-agora.md`)

### Testing
- **mock-chronik-client** - Mock for testing (see `references/mock-chronik-client.md`)

## Quick Start

```typescript
import { ChronikClient } from 'chronik-client';
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
```

## Prompt Templates

- "Query all UTXOs for an eCash address"
- "Create a transaction to send XEC"
- "Listen for blockchain events using WebSocket"
- "Parse an eCash address"
- "Build a wallet from mnemonic"
- "Work with SLP/ALP tokens"

## References

All tool documentation is available in the `references/` folder.
