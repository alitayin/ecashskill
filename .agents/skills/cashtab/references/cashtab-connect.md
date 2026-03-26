---
name: cashtab-connect
description: DApp integration library for Cashtab browser extension wallet
version: 1.1.0
tags: [wallet, dapp, extension, browser, connection]
---

# cashtab-connect

Connect DApps to Cashtab browser extension wallet.

**npm**: `cashtab-connect`

## Usage

```typescript
import { CashtabConnect } from 'cashtab-connect';

const cashtab = new CashtabConnect();

await cashtab.waitForExtension();
const address = await cashtab.requestAddress();
```

## Send XEC/Token

```typescript
await cashtab.sendXec('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0', '1000');
await cashtab.sendToken('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0', 'token_id', '100');
```

## Error Handling

```typescript
import {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTransactionDeniedError,
  CashtabTimeoutError,
} from 'cashtab-connect';
```

## Cleanup

```typescript
cashtab.destroy(); // Call on component unmount
```
