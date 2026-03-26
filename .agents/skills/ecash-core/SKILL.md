---
name: ecash-core
description: eCash (XEC) blockchain fundamentals — address format, key facts, quick start, and code examples. Use when working with eCash basics, address encoding/decoding, or getting started with XEC development.
---

# eCash Core

Foundational knowledge for eCash blockchain development.

## Key Facts

- **Token**: XEC (1 XEC = 100 satoshis)
- **Address Format**: CashAddr with `ecash:` prefix
- **BIP44 Coin Type**: ecash-wallet uses 1899, Electrum ABC uses 899
- **Node**: Bitcoin ABC
- **Consensus**: Avalanche (fast finality)
- **Website**: https://e.cash

## References

- `ecashaddrjs.md` — Address encoding/decoding
- `examples.md` — Common code examples
- `ecash-quicksend.md` — Simple payment helper (prototypes only)
- `bitcoin-abc.md` — Node internals

## When to Use

- Address validation or format conversion
- Understanding XEC units and denominations
- Quick start for new eCash projects
- Simple payments and prototypes (use `ecash-quicksend`)
