---
name: cashtab-connect
description: DApp integration library for Cashtab browser extension and pay.e.cash mobile wallet connections
version: 1.2.0
tags: [wallet, dapp, extension, browser, android, connection]
---

# cashtab-connect

Connect DApps to Cashtab browser extension wallet and Android pay.e.cash mobile
wallet flows.

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
const xecResult = await cashtab.sendXec(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  '1000',
);

const tokenResult = await cashtab.sendToken(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  'token_id',
  '100',
);
```

`sendXec`, `sendToken`, `sendBip21`, and `createTransactionFromBip21` return a
`Promise<TransactionResponse>`. Check `success`, `txid`, and `reason` before
updating UI state.

## Android / pay.e.cash Connect

```typescript
import {
  buildPayEcashConnectUrl,
  clearPayEcashConnectCallback,
  isAndroidUserAgent,
  openAndroidCashtabConnect,
  parsePayEcashConnectCallback,
} from 'cashtab-connect';

if (isAndroidUserAgent()) {
  openAndroidCashtabConnect();
}

const address = parsePayEcashConnectCallback();
if (address) {
  clearPayEcashConnectCallback();
}

const connectUrl = buildPayEcashConnectUrl();
```

Use the mobile helpers when a DApp wants to request a pay.e.cash wallet
connection on Android. The callback is returned through the page hash, so parse
and clear it before normal route handling if the app uses hash routing.

## Error Handling

```typescript
import {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTransactionDeniedError,
  CashtabTimeoutError,
} from 'cashtab-connect';
```

Handle each error as a user-facing state. Extension unavailable means installation
or browser support is missing; denied errors mean the user intentionally rejected
the request and should not be retried automatically.

## Cleanup

```typescript
cashtab.destroy(); // Call on component unmount
```

## Integration Checklist

- Wait for extension availability before showing send actions as enabled.
- For Android, parse and clear the `cashtab_connect` hash callback after a mobile connect flow.
- Validate destination addresses before calling `sendXec` or `sendToken`.
- Treat returned transaction ids as pending until Chronik confirms or finalizes them.
- Destroy listeners when the page, modal, or component unmounts.
