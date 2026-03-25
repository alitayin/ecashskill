# eCash Developer Skills

AI-powered development resources for eCash blockchain developers. These skill files provide comprehensive guidance for building eCash applications using Claude Code or Cursor.

## Available Skills

| Skill | Description |
|-------|-------------|
| [bitcoin-abc](src/skills/ecash/bitcoin-abc.md) | Bitcoin ABC node implementation, contribution guidelines |
| [cashtab](src/skills/ecash/cashtab.md) | Full-featured eCash web wallet reference |
| [cashtab-connect](src/skills/ecash/cashtab-connect.md) | DApp integration with Cashtab browser extension |
| [chronik](src/skills/ecash/chronik.md) | High-performance blockchain indexer protocol |
| [chronik-client](src/skills/ecash/chronik-client.md) | JavaScript/TypeScript client for Chronik API |
| [ecash-agora](src/skills/ecash/ecash-agora.md) | Non-custodial exchange (NEX) protocol |
| [ecash-lib](src/skills/ecash/ecash-lib.md) | Transaction building and signing library |
| [ecash-wallet](src/skills/ecash/ecash-wallet.md) | HD wallet with XEC and token support |
| [ecashaddrjs](src/skills/ecash/ecashaddrjs.md) | CashAddr address format encoding/decoding |
| [mock-chronik-client](src/skills/ecash/mock-chronik-client.md) | Testing utility for Chronik client |

## Quick Start

### Claude Code Users

Reference skill files directly in your prompts:

```
/skill ecash-lib

I need to build a transaction that sends XEC to an address.
```

### Cursor Users

Add skill content to your `.cursorrules` file:

```yaml
# Import eCash skills
- include: src/skills/ecash/ecash-lib.md
- include: src/skills/ecash/chronik-client.md
```

## Skill Format

Each skill file includes:

- **YAML Frontmatter** - Metadata (name, version, tags)
- **Claude Code Guide** - Installation, API, usage examples, prompt templates
- **Cursor Rules** - `.cursorrules` snippets and AI role settings
- **API Reference** - Complete method documentation
- **Code Examples** - Common use cases
- **Troubleshooting** - FAQ and debugging tips

## Project Structure

```
src/
├── skills/
│   └── ecash/           # eCash skill files
│       ├── bitcoin-abc.md
│       ├── cashtab.md
│       ├── chronik.md
│       └── ...
└── app/
    ├── page.tsx         # Landing page
    ├── skills/          # Skills listing page
    ├── guides/          # Guides page
    └── reference/       # Reference page
```

## Resources

- [eCash Documentation](https://www.e.cash/)
- [Bitcoin ABC GitHub](https://github.com/Bitcoin-ABC/bitcoin-abc)
- [Chronik API](https://chronik.e.cash/)
- [eCash Developer Telegram](https://t.me/eCashDevelopment)
