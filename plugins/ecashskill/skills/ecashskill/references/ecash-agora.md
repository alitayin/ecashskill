---
name: ecash-agora
description: Non-custodial exchange (NEX) protocol for eCash tokens
version: 4.0.0
tags: [agora, dex, exchange, token, marketplace, covenant]
---

# ecash-agora

Non-custodial exchange (NEX) protocol for eCash tokens using Bitcoin Script covenants.

**npm**: `ecash-agora`
**Dependencies**: chronik-client, ecash-lib, ecash-wallet

## Offer Types

- **Oneshot**: For NFT - all or nothing
- **Partial**: For fungible tokens - can purchase partially

## Query Market

```typescript
import { Agora } from 'ecash-agora';

const agora = new Agora(chronik);
const offers = await agora.activeOffersByTokenId('token_id');
```

## Accept Offer

```typescript
const offer = offers[0];
const price = offer.askedSats(50000n);

const result = await offer.accept({
  wallet: buyerWallet,
  covenantSk: buyerPrivateKey,
  acceptedAtoms: 50000n,
});
```

## Create Offer (Seller)

```typescript
// Partial offer (fungible token)
import { AgoraPartial } from 'ecash-agora';

const partial = AgoraPartial.approximateParams({
  offeredAtoms: 1000000n,
  priceNanoSatsPerAtom: 2000n,
  minAcceptedAtoms: 1000n,
  tokenId: 'token_id',
  tokenType: 'SLP_TOKEN_TYPE_FUNGIBLE',
  tokenProtocol: 'SLP',
});

await partial.list({ wallet: sellerWallet });
```

## API Reference

| Agora | Description |
|------|------|
| `activeOffersByTokenId(tokenId)` | Active offers for Token |
| `activeOffersByGroupTokenId(groupId)` | Active offers for NFT Group |
| `activeOffersByPubKey(pubkey)` | Offers by public key |

| AgoraOffer | Description |
|------|------|
| `acceptTx(params)` | Create accept transaction |
| `cancelTx(params)` | Create cancel transaction |
| `askedSats(acceptedAtoms)` | XEC price for quantity |

## Price Unit

Price is in **nano sats per atom**: `1 sats = 1,000,000,000 nano sats`
