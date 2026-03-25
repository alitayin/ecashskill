---
name: ecash-agora
description: Non-custodial exchange (NEX) protocol for eCash tokens
version: 4.0.0
tags: [agora, dex, exchange, token, marketplace, covenant]
---

# ecash-agora

eCash Agora protocol library, implementing Non-Custodial Exchange (NEX) functionality.

## Overview

Agora is a decentralized trading protocol on eCash:
- Uses Bitcoin Script covenant for atomic transactions
- Supports SLP/ALP Token trading
- No smart contracts or liquidity pools required
- P2P direct trading
- Supports NFT (Oneshot) and fungible Tokens (Partial)

**npm**: `ecash-agora`
**Version**: 4.0.0
**Official Repository**: github.com/Bitcoin-ABC/bitcoin-abc (modules/ecash-agora)
**Dependencies**: chronik-client, ecash-lib, ecash-wallet

---

## Claude Code Usage Guide

### Installation

```bash
npm install ecash-agora
```

### Core Concepts

**Oneshot** - One-time offer (for NFT)
- Seller sets fixed price
- Buyer either accepts all or nothing

**Partial** - Partial offer (for fungible Tokens)
- Seller sets price and min/max quantity
- Buyer can purchase partial quantity
- Remaining quantity is automatically re-locked

### Query Market

```typescript
import { Agora } from 'ecash-agora';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
const agora = new Agora(chronik);

// Get all tradable Token IDs
const tokenIds = await agora.allOfferedTokenIds();

// Get active offers for a Token
const offers = await agora.activeOffersByTokenId('token_id_here');

// Get offers for a Token group (SLP NFT)
const groupOffers = await agora.activeOffersByGroupTokenId('group_token_id');
```

### Accept Offer

```typescript
// Get detailed offer information
const offer = offers[0];
const { AgoraOffer } = offer;

// Calculate XEC cost for specified quantity
const satsCost = offer.askedSats(50000n); // Price for 50000 atoms

// Create accept transaction
const acceptTx = offer.acceptTx({
  covenantSk: buyerPrivateKey,
  covenantPk: buyerPublicKey,
  fuelInputs: [...],  // UTXOs for paying fees
  recipientScript: buyerP2pkhScript,
  acceptedAtoms: 50000n,
});

// Broadcast
await chronik.broadcastTx(acceptTx.ser());
```

### Create Offer (Seller)

```typescript
import { AgoraPartial, AgoraOneshot } from 'ecash-agora';
import { Wallet } from 'ecash-wallet';

// Create Partial offer (fungible Token)
const partial = AgoraPartial.approximateParams({
  offeredAtoms: 1000000n,      // Offered quantity
  priceNanoSatsPerAtom: 2000n, // Price per atom (nano sats)
  minAcceptedAtoms: 1000n,     // Minimum accepted quantity
  tokenId: 'token_id',
  tokenType: 'SLP_TOKEN_TYPE_FUNGIBLE',
  tokenProtocol: 'SLP',
});

// List via wallet
await partial.list({ wallet: sellerWallet });

// Create Oneshot offer (NFT)
const oneshot = new AgoraOneshot({
  enforcedOutputs: [
    { sats: 0n, script: slpSend(tokenId, SLP_NFT1_CHILD, [0n, 1n]) },
    { sats: 80000n, script: sellerP2pkhScript },
  ],
  cancelPk: sellerCancelPublicKey,
});

await oneshot.list({ wallet: sellerWallet });
```

### Cancel Offer

```typescript
// Cancel single offer
const cancelTx = offer.cancelTx({
  cancelSk: sellerCancelPrivateKey,
  fuelInputs: [...],
  recipientScript: sellerP2pkhScript,
});

await chronik.broadcastTx(cancelTx.ser());

// Or via wallet
await offer.cancel({ wallet: sellerWallet });
```

### WebSocket Subscription

```typescript
const ws = chronik.ws({
  onMessage: (msg) => console.log(msg),
  autoReconnect: true,
});

await ws.waitForOpen();

// Subscribe to specific Token offers
agora.subscribeWs(ws, { tokenId: 'token_id' });

// Subscribe to specific address offers
agora.subscribeWs(ws, { pubKey: 'maker_public_key_hex' });
```

### Prompt Templates

```
I need to query all active offers for a Token

I need to create an NFT sale offer

I need to create a fungible Token sale offer

I need to accept an Agora offer

I need to cancel an offer I created

I need to subscribe to new offer notifications
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# ecash-agora Configuration
- name: "ecash-agora"
  description: "eCash Agora decentralized trading protocol"
  files:
    - "**/*agora*"
    - "**/*exchange*"
    - "**/*marketplace*"
  rules:
    - type: "import"
      statement: |
        import { Agora, AgoraPartial, AgoraOneshot } from 'ecash-agora';
        import { Wallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "oneshot"
      statement: |
        // Oneshot for NFT - all or nothing
        const oneshot = new AgoraOneshot({
          enforcedOutputs: [...],
          cancelPk: makerCancelPk,
        });

    - type: "partial"
      statement: |
        // Partial for fungible Tokens - can purchase partially
        const partial = AgoraPartial.approximateParams({
          offeredAtoms: amount,
          priceNanoSatsPerAtom: price,
          minAcceptedAtoms: minAmount,
          tokenId,
          tokenType,
          tokenProtocol: 'SLP' | 'ALP',
        });

    - type: "accept"
      statement: |
        // Calculate fees when accepting offer
        const satsCost = offer.askedSats(acceptedAtoms);
        const fee = offer.acceptFeeSats({ ... });

    - type: "error-handling"
      statement: |
        // Agora error handling
        // - Invalid covenant: Offer has been modified
        // - Offer expired: Offer has expired or been cancelled
        // - Insufficient funds: Insufficient XEC for payment
```

### AI Role Settings

```
When using ecash-agora:

1. Oneshot for NFT (all or nothing)
2. Partial for fungible Tokens (can purchase partially)
3. acceptTx requires fuelInputs to pay fees
4. Price unit is nano sats per atom
5. Cancel offer uses cancelSk, not covenantSk
6. Validate transaction before broadcasting
```

---

## API Reference

### Agora

Main query class.

```typescript
const agora = new Agora(chronik, dustSats?: bigint);
```

**Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `allOfferedTokenIds()` | Promise<string[]> | All Token IDs with offers |
| `offeredFungibleTokenIds()` | Promise<string[]> | Fungible Token IDs |
| `offeredGroupTokenIds()` | Promise<string[]> | NFT Group Token IDs |
| `activeOffersByTokenId(tokenId)` | Promise<AgoraOffer[]> | Active offers for Token |
| `activeOffersByGroupTokenId(groupId)` | Promise<AgoraOffer[]> | Active offers for Group |
| `activeOffersByPubKey(pubkey)` | Promise<AgoraOffer[]> | Offers for specific public key |
| `historicOffers(params)` | Promise<AgoraHistoryResult> | Historical offers |
| `subscribeWs(ws, params)` | void | WebSocket subscription |
| `unsubscribeWs(ws, params)` | void | Unsubscribe |

### AgoraOffer

Single offer (returned by `activeOffersByTokenId`).

**Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `acceptTx(params)` | Tx | Create accept transaction |
| `accept(params)` | Promise<BroadcastResult> | Accept and broadcast |
| `acceptFeeSats(params)` | bigint | Accept transaction fee |
| `cancelTx(params)` | Tx | Create cancel transaction |
| `cancel(params)` | Promise<BroadcastResult> | Cancel and broadcast |
| `cancelFeeSats(params)` | bigint | Cancel transaction fee |
| `askedSats(acceptedAtoms?)` | bigint | XEC price for specified quantity |

### AgoraOneshot

One-time offer for NFT.

```typescript
const oneshot = new AgoraOneshot({
  enforcedOutputs: TxOutput[],
  cancelPk: PublicKey,
});
```

**Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `script()` | Script | Contract script |
| `adScript()` | Script | Advertisement script |
| `askedSats()` | bigint | Offered XEC quantity |
| `list(params)` | Promise<BroadcastResult> | List Token |

### AgoraPartial

Partial offer for fungible Tokens.

```typescript
const partial = AgoraPartial.approximateParams(params);
```

**Methods:**

| Method | Return Value | Description |
|------|--------|------|
| `offeredAtoms()` | bigint | Offered quantity |
| `minAcceptedAtoms()` | bigint | Minimum accepted quantity |
| `askedSats(acceptedAtoms)` | bigint | Price for specified quantity |
| `priceNanoSatsPerAtom()` | bigint | Unit price (nano sats) |
| `list(params)` | Promise<BroadcastResult> | List Token |
| `prepareAcceptedAtoms(acceptedAtoms)` | bigint | Adjust quantity |
| `preventUnacceptableRemainder(acceptedAtoms)` | void | Verify remainder |

### Parameter Types

```typescript
interface AgoraPartialParams {
  offeredAtoms: bigint;
  priceNanoSatsPerAtom: bigint;
  minAcceptedAtoms: bigint;
  tokenId: string;
  tokenType: number;
  tokenProtocol: 'SLP' | 'ALP';
  makerPk: Uint8Array;
  enforcedLockTime: bigint;
}
```

### Token Type Constants

```typescript
// SLP
SLP_TOKEN_TYPE_NONE = 0
SLP_TOKEN_TYPE_FUNGIBLE = 1
SLP_TOKEN_TYPE_MINT_VAULT = 2
SLP_TOKEN_TYPE_NFT1_GROUP = 0x81
SLP_TOKEN_TYPE_NFT1_CHILD = 0x41

// ALP
ALP_TOKEN_TYPE_STANDARD = 0
```

---

## How It Works

### Covenant Mechanism

Agora uses Bitcoin Script covenant to enforce transaction rules:

```
OP_HASH160 <makerHash> OP_EQUAL
OP_IF
  // Buyer sends XEC to seller
  <buyerPayout>
OP_ELSE
  // Seller can cancel or update
  <cancelKey> OP_CHECKSIG
OP_ENDIF
```

### Oneshot Flow

```
1. Seller creates P2SH UTXO containing NFT
2. Script locks: Buyer gets NFT after paying XEC
3. Buyer creates transaction:
   - Input: locked UTXO
   - Output: XEC to seller, NFT to buyer
4. Seller signs to unlock, script verifies buyer output is correct
```

### Partial Flow

```
1. Seller locks 1000 atoms, price 2000 nano sats/atom
2. Buyer wants to purchase 500 atoms, pays 1000000 nano sats
3. After transaction:
   - Buyer gets 500 atoms
   - Seller gets XEC
   - Remaining 500 atoms re-locked to new UTXO
4. Multiple partial transactions until all sold
```

---

## Code Examples

### Complete Trading Flow

```typescript
import { Agora } from 'ecash-agora';
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';
import { toHex } from 'ecash-lib';

async function purchaseToken(
  buyerWallet: Wallet,
  chronik: ChronikClient,
  tokenId: string,
  tokenAmount: bigint
) {
  const agora = new Agora(chronik);

  // 1. Find suitable offer
  const offers = await agora.activeOffersByTokenId(tokenId);
  const suitableOffer = offers.find(o =>
    BigInt(o.minAcceptedAtoms) <= tokenAmount
  );

  if (!suitableOffer) {
    throw new Error('No suitable offer');
  }

  // 2. Calculate price
  const priceSats = suitableOffer.askedSats(tokenAmount);

  // 3. Confirm balance is sufficient
  if (buyerWallet.balanceSats < priceSats) {
    throw new Error('Insufficient XEC balance');
  }

  // 4. Accept offer
  const result = await suitableOffer.accept({
    wallet: buyerWallet,
    covenantSk: buyerWallet.sk,
    covenantPk: buyerWallet.pk,
    acceptedAtoms: tokenAmount,
  });

  console.log('Purchase successful:', result.txid);
  return result;
}
```

### Create NFT Sale

```typescript
import { AgoraOneshot } from 'ecash-agora';
import { Script } from 'ecash-lib';

async function listNft(
  sellerWallet: Wallet,
  tokenId: string,
  priceSats: bigint
) {
  // Create P2PKH output for seller
  const sellerP2pkh = sellerWallet.script;

  // Create NFT send output
  const nftSendOutput = {
    sats: 0n,
    script: createSlpSendScript(tokenId, 'SLP_NFT1_CHILD', [0n, 1n]),
  };

  // Create Oneshot offer
  const oneshot = new AgoraOneshot({
    enforcedOutputs: [
      nftSendOutput,
      { sats: priceSats, script: sellerP2pkh },
    ],
    cancelPk: sellerWallet.pk,
  });

  // List
  const result = await oneshot.list({
    wallet: sellerWallet,
    tokenId,
    tokenType: 0x41, // SLP_NFT1_CHILD
    dustSats: 546n,
    feePerKb: 1000n,
  });

  console.log('NFT listed:', result.txid);
}
```

### Monitor New Offers

```typescript
import { Agora } from 'ecash-agora';

function watchNewOffers(chronik: ChronikClient, tokenId: string) {
  const agora = new Agora(chronik);

  const ws = chronik.ws({
    onMessage: async (msg) => {
      if (msg.type === 'TX_ADDED_TO_MEMPOOL') {
        // Check for new Agora offers
        const offers = await agora.activeOffersByTokenId(tokenId);
        if (offers.length > 0) {
          console.log(`New offers available! Total: ${offers.length}`);
          // Can notify frontend
        }
      }
    },
    autoReconnect: true,
  });

  return ws;
}
```

---

## Troubleshooting

### Common Issues

**Q: acceptTx fails "Invalid covenant"**
- Offer has been modified or cancelled
- Re-query latest offer

**Q: Balance sufficient but transaction fails**
- Check if fuelInputs are sufficient to pay fees
- Confirm sats amount is above dustSats

**Q: Partial offer partial transaction fails**
- Check minAcceptedAtoms limit
- Confirm remainder is acceptable

**Q: NFT listing fails**
- Confirm NFT UTXO is spendable
- Check if tokenId and tokenType match

**Q: Cancel offer fails**
- Confirm using cancelSk, not covenantSk
- Check if fuel inputs are sufficient

### Price Calculation

```typescript
// Understanding price units
// nano sats = 0.000000001 sats
// 1 sats = 1000000000 nano sats

// Example: 2000 nano sats/atom
// Purchase 1000000 atoms = 2000000000000 nano sats = 2000 sats

const price = 2000n; // nano sats per atom
const amount = 1000000n; // atoms
const totalSats = (price * amount) / 1000000000n;
```

### Debug Checklist

```typescript
// Checks before accepting offer
const offer = await agora.activeOffersByTokenId(tokenId);

// 1. Verify offer is still valid
console.log('Offer still active:', offer.status === 'active');

// 2. Calculate accurate price
const price = offer.askedSats(desiredAmount);
console.log('Total price:', price, 'sats');

// 3. Check fuel fee
const acceptFee = offer.acceptFeeSats(params);
console.log('Accept fee:', acceptFee, 'sats');

// 4. Verify wallet balance
console.log('Wallet balance:', wallet.balanceSats);
console.log('Required:', price + acceptFee);
```
