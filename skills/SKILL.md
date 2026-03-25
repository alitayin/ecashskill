---
name: ecash-skills
description: Comprehensive eCash blockchain development skills for Claude Code
version: 1.0.0
tags: [ecash, blockchain, bitcoin-abc, chronik, wallet, tokens]
---

# eCash Development Skills

This marketplace contains skills for eCash blockchain development with Claude Code.

## Available Skills

### Infrastructure
- **chronik** - High-performance blockchain indexer
- **chronik-client** - Client library for Chronik
- **bitcoin-abc** - Node implementation and contribution guidelines

### Transaction & Signing
- **ecash-lib** - Transaction building and signing

### Wallet
- **ecash-wallet** - HD wallet with XEC and token support

### Utilities
- **ecashaddrjs** - Address encoding/decoding

### Applications
- **cashtab** - Web wallet reference implementation
- **cashtab-connect** - Browser extension integration
- **ecash-agora** - Marketplace application

### Testing
- **mock-chronik-client** - Mock for testing Chronik interactions

## When to Use

Use these skills when:
- Building applications on eCash blockchain
- Integrating with Chronik indexer
- Creating or managing eCash wallets
- Working with SLP/ALP Tokens
- Developing payment solutions

## Quick Install

```bash
# Add this marketplace
claude plugin marketplace add https://github.com/alitayin/ecashskill

# Install a skill
claude plugin install chronik@ecash-skills
```

## Skill Structure

Each skill contains:
- **SKILL.md** - Main instructions for Claude Code
- **references/** - Additional documentation and examples
