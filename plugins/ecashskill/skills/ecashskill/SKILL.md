---
name: ecash
description: Comprehensive eCash blockchain development skills for Claude Code
version: 0.3.0
tags: [ecash, blockchain, bitcoin-abc, chronik, wallet, tokens, xec]
---

## Preamble

Run this at the start of every session to check for updates:

```bash
_SKILL_DIR=$(find ~/.claude/plugins ~/.claude/skills ~/.agents/skills -name 'ecashskill' -maxdepth 3 -type d 2>/dev/null | head -1)
_LOCAL_VER=$(cat "$_SKILL_DIR/VERSION" 2>/dev/null || echo "unknown")
_REMOTE_VER=$(curl -sf --max-time 3 https://raw.githubusercontent.com/alitayin/ecashskill/main/VERSION 2>/dev/null | tr -d '[:space:]' || echo "")
[ -n "$_REMOTE_VER" ] && [ "$_REMOTE_VER" != "$_LOCAL_VER" ] && echo "UPGRADE_AVAILABLE $_LOCAL_VER $_REMOTE_VER" || true
```

If output shows `UPGRADE_AVAILABLE <old> <new>`:
Tell the user: "ecashskill **v{new}** is available (you're on v{old}). Update with:
```
claude plugin install alitayin/ecashskill
```"

# eCash Development Skills

This skill provides comprehensive development capabilities for eCash blockchain applications using Claude Code.

## What is eCash?

eCash (XEC) is a cryptocurrency that forked from Bitcoin Cash in 2021, built on Bitcoin ABC node technology. It uses the Avalanche consensus mechanism for fast transaction finality and supports both SLP and ALP token standards.

**Key Facts:**
- **Token**: XEC (1 XEC = 100 satoshis)
- **Address Format**: CashAddr with `ecash:` prefix
- **BIP44 Coin Type**: Varies by wallet - ecash-wallet uses 1899, Electrum ABC uses 899
- **Node Implementation**: Bitcoin ABC
- **Consensus**: Avalanche (fast finality)
- **Website**: https://e.cash

## References Overview

The `references/` folder contains documentation for different tools and libraries:

| Reference | Purpose | When to Use |
|-----------|---------|-------------|
| `chronik/` | Blockchain indexer API | Querying blockchain data, WebSocket subscriptions |
| `chronik-client.md` | Client library for Chronik | Most development work involving blockchain queries |
| `ecash-lib.md` | Transaction building & signing | Creating raw transactions, custom signing logic |
| `ecash-wallet.md` | HD wallet implementation | Managing wallets, sending XEC/tokens |
| `ecashaddrjs.md` | Address encoding/decoding | Address validation, format conversion |
| `ecash-agora.md` | Decentralized exchange protocol | Building marketplaces, token trading |
| `ecash-quicksend.md` | Quick transaction sending | Simple payments, prototypes, small projects |
| `cashtab.md` | Web wallet reference | Reference implementation, wallet UI patterns |
| `cashtab-connect.md` | Browser extension integration | DApp wallet connection |
| `paybutton.md` | Embeddable payment button | Accepting eCash on websites, donations, e-commerce |
| `bitcoin-abc.md` | Node implementation | Contributing to Bitcoin ABC, understanding internals |
| `mock-chronik-client.md` | Testing utilities | Writing unit tests |
| `examples.md` | Code examples | Quick reference for common patterns |

## When to Use

Use this skill when:
- Building applications on eCash blockchain
- Integrating with Chronik indexer
- Creating or managing eCash wallets
- Working with SLP/ALP Tokens
- Developing payment solutions
- Adding a PayButton payment widget to a website
- Analyzing blockchain data

## Tools & Libraries

### Infrastructure
- **chronik** - High-performance blockchain indexer (see `references/chronik.md`)
- **chronik-client** - Client library for Chronik (see `references/chronik-client.md`)
- **bitcoin-abc** - Node implementation (see `references/bitcoin-abc.md`)

### Transaction & Signing
- **ecash-lib** - Transaction building and signing (see `references/ecash-lib.md`)
- **ecash-quicksend** - Simple transaction sender for quick payments (see `references/ecash-quicksend.md`)

### Wallet
- **ecash-wallet** - HD wallet with XEC and token support (see `references/ecash-wallet.md`)

### Utilities
- **ecashaddrjs** - Address encoding/decoding (see `references/ecashaddrjs.md`)

### Applications
- **cashtab** - Web wallet reference (see `references/cashtab.md`)
- **cashtab-connect** - Browser extension integration (see `references/cashtab-connect.md`)
- **ecash-agora** - Marketplace application (see `references/ecash-agora.md`)
- **paybutton** - Embeddable payment button for websites (see `references/paybutton.md`)

### Testing
- **mock-chronik-client** - Mock for testing (see `references/mock-chronik-client.md`)

## Quick Start

```typescript
import { ChronikClient } from 'chronik-client';
const chronik = new ChronikClient(['https://chronik.e.cash/']);
```

For more available Chronik nodes, see [https://chronik.cash](https://chronik.cash).

## Prompt Templates

- "Query all UTXOs for an eCash address"
- "Create a transaction to send XEC"
- "Listen for blockchain events using WebSocket"
- "Parse an eCash address"
- "Build a wallet from mnemonic"
- "Work with SLP/ALP tokens"

## References

All tool documentation is available in the `references/` folder.
