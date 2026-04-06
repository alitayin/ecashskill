---
name: ecash-quicksend
description: Unified transaction manager for eCash XEC, SLP, and ALP tokens with Agora DEX support
version: 2.0.2
tags: [ecash, transaction, quicksend, xec, tokens, payment, agora, dex]
---

# ecash-quicksend

A unified transaction manager for eCash (XEC), SLP, and ALP token transactions with built-in Agora DEX support.

**npm**: `ecash-quicksend`
**Repository**: https://github.com/alitayin/quicksend

## When to Use

- Quick prototyping and small projects
- Simple payment flows
- Agora DEX integration (listing, buying, managing token offers)
- When you need a lightweight alternative to full wallet libraries

## When NOT to Use

- Large production applications (limited maintenance)
- Complex wallet scenarios requiring advanced HD derivation
- Projects needing long-term dependency support

## Quick Start

```typescript
import { sendXec } from 'ecash-quicksend';
import 'dotenv/config'; // Manage .env yourself

// Send XEC (amounts in atoms/satoshis as BigInt)
const result = await sendXec(
  [{ address: 'ecash:qp...', amount: 1000n }],
  { mnemonic: process.env.MNEMONIC } // Optional if MNEMONIC env var is set
);

console.log(result.txid);
```

## Send Tokens

Protocol (SLP/ALP) is automatically detected from UTXO data.

```typescript
import { sendToken } from 'ecash-quicksend';

await sendToken(
  [{ address: 'ecash:qp...', amount: 500n }], // BigInt atoms
  { 
    tokenId: 'token_id_here',
    mnemonic: process.env.MNEMONIC // Optional
  }
);
```

## Agora DEX Integration

### List Tokens for Sale

```typescript
import { createAgoraOffer } from 'ecash-quicksend';

const result = await createAgoraOffer({
  tokenId: '...',
  tokenAmount: 1000n,
  pricePerToken: 5.5,
  mnemonic: '...' // Optional
});
```

### Buy Tokens (Market Buy)

```typescript
import { buyAgoraTokens } from 'ecash-quicksend';

const result = await buyAgoraTokens({
  tokenId: '...',
  amount: 5000n,
  maxPrice: 2.8,
  mnemonic: '...' // Optional
});
```

### Query & Accept Specific Offers

```typescript
import { fetchAgoraOffers, acceptAgoraOffer } from 'ecash-quicksend';

// Query offers
const offers = await fetchAgoraOffers({
  tokenId: 'your-token-id',
  maxPrice: 2.5
});

// Accept best offer
const result = await acceptAgoraOffer(offers[0], {
  amount: 1000n,
  mnemonic: '...'
});
```

### Manage Your Listings

```typescript
import { fetchMyAgoraOffers, cancelAgoraOffer } from 'ecash-quicksend';

// Fetch your active listings
const myOffers = await fetchMyAgoraOffers({
  mnemonic: '...'
});

// Cancel a listing
await cancelAgoraOffer(myOffers[0], {
  mnemonic: '...'
});
```

## API Reference

| Method | Description |
|------|------|
| `sendXec(recipients, options)` | Send XEC to one or more addresses |
| `sendToken(recipients, options)` | Send SLP/ALP tokens (auto-detected) |
| `createAgoraOffer(options)` | List tokens for sale on Agora DEX |
| `buyAgoraTokens(options)` | Market buy tokens up to max price |
| `acceptAgoraOffer(offer, options)` | Buy from specific Agora offer |
| `fetchAgoraOffers(options)` | Query available offers for a token |
| `fetchMyAgoraOffers(options)` | List your active offers |
| `cancelAgoraOffer(offer, options)` | Cancel an active offer |

## Common Options

| Parameter | Type | Description | Default |
|------|------|------|------|
| `mnemonic` | `string` | Wallet mnemonic | `process.env.MNEMONIC` |
| `chronik` | `ChronikClient` | Custom Chronik instance | Default instance |
| `addressIndex` | `number` | HD wallet address index | `0` |
| `utxoStrategy` | `UtxoStrategy` | XEC selection strategy | `all` |
| `feeStrategy` | `FeeStrategy` | Fee selection strategy | `all` |
| `tokenStrategy` | `TokenStrategy` | Token selection strategy | `all` |

## Key Changes in v2.0

- **Unified SLP/ALP handling**: Protocol auto-detection from UTXO data
- **SLP support on Agora**: Can now list and trade SLP tokens on Agora DEX
- **Mnemonic-based**: Uses HD wallet with mnemonic instead of private key
- **Function-based API**: Replaced class-based API with standalone functions
- **All amounts in BigInt atoms**: Consistent unit handling across all methods

## Limitations

- Uses mnemonic-based HD wallet (not raw private keys)
- Limited maintenance - not suitable for production-critical applications
- For larger projects, consider `ecash-wallet` with `ecash-lib`
