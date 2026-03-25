---
name: cashtab-connect
description: DApp integration library for Cashtab browser extension wallet
version: 1.1.0
tags: [wallet, dapp, extension, browser, connection]
---

# cashtab-connect

DApp development library for connecting to Cashtab browser extension wallet.

## Overview

cashtab-connect provides:
- Wallet address requests
- XEC transfers
- Token transfers
- BIP21 URI support
- Complete error handling
- TypeScript type support

**npm**: `cashtab-connect`
**Version**: 1.1.0
**Official Repository**: github.com/Bitcoin-ABC/bitcoin-abc (modules/cashtab-connect)

---

## Claude Code Usage Guide

### Installation

```bash
npm install cashtab-connect
```

### Basic Usage

```typescript
import { CashtabConnect } from 'cashtab-connect';

const cashtab = new CashtabConnect();

// Wait for extension installation
await cashtab.waitForExtension();

// Request user address
const address = await cashtab.requestAddress();
console.log('User address:', address);
```

### Sending XEC

```typescript
// Send XEC
await cashtab.sendXec(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  '1000.12'  // Can be string or number
);
```

### Sending Token

```typescript
await cashtab.sendToken(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  'token_id_here',
  '100.5'  // Token quantity (supports decimals)
);
```

### BIP21 Payment

```typescript
// Use BIP21 URI to create transaction
await cashtab.sendBip21('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0?amount=100');

// Create transaction from BIP21
const tx = cashtab.createTransactionFromBip21('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0?amount=50&message=Payment');
```

### Check Extension Availability

```typescript
// Synchronous check
if (cashtab.isExtensionAvailable()) {
  console.log('Cashtab extension is installed');
}

// Asynchronous wait
try {
  await cashtab.waitForExtension();
  console.log('Extension is ready');
} catch (error) {
  console.log('Extension not available');
}
```

### Cleanup Resources

```typescript
// Remove event listeners
cashtab.destroy();
```

### Prompt Templates

```
I need to connect to user's Cashtab wallet

I need to request user's eCash address

I need to send XEC through Cashtab

I need to send Token through Cashtab

I need to handle the case where wallet is not installed
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# cashtab-connect Configuration
- name: "cashtab-connect"
  description: "Cashtab browser extension wallet connection"
  files:
    - "**/*cashtab*"
    - "**/*wallet*connect*"
    - "**/dapp/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { CashtabConnect } from 'cashtab-connect';
        import {
          CashtabExtensionUnavailableError,
          CashtabAddressDeniedError,
          CashtabTransactionDeniedError,
          CashtabTimeoutError,
        } from 'cashtab-connect';

    - type: "initialization"
      statement: |
        // Initialize CashtabConnect
        const cashtab = new CashtabConnect({
          timeout: 30000,
          extensionNotAvailableMessage: 'Please install Cashtab wallet',
          addressDeniedMessage: 'User denied address request',
        });

    - type: "error-handling"
      statement: |
        // Error handling pattern
        try {
          const address = await cashtab.requestAddress();
        } catch (error) {
          if (error instanceof CashtabExtensionUnavailableError) {
            // Guide user to install extension
          } else if (error instanceof CashtabAddressDeniedError) {
            // User denied
          } else if (error instanceof CashtabTimeoutError) {
            // Timeout
          }
        }

    - type: "cleanup"
      statement: |
        // Cleanup on component unmount
        useEffect(() => {
          return () => cashtab.destroy();
        }, []);
```

### AI Role Settings

```
When using cashtab-connect:

1. Call waitForExtension() first to ensure extension is available
2. Use isExtensionAvailable() for pre-check
3. Amount parameter can be string or number
4. Always handle four error types
5. Call destroy() on component unmount
6. Do not hardcode timeout in production environment
```

---

## API Reference

### CashtabConnect

```typescript
const cashtab = new CashtabConnect(options?: CashtabConnectOptions);
```

**Options:**

| Option | Type | Default | Description |
|------|------|--------|------|
| `timeout` | number | 30000 | Request timeout (milliseconds) |
| `extensionNotAvailableMessage` | string | - | Error message when extension is unavailable |
| `addressDeniedMessage` | string | - | Message when address request is denied |

### Methods

| Method | Return Value | Description |
|------|--------|------|
| `waitForExtension(timeout?)` | Promise<void> | Wait for extension to be available |
| `isExtensionAvailable()` | boolean | Check if extension is available |
| `requestAddress()` | Promise<string> | Request user address |
| `sendXec(address, amount)` | Promise<void> | Send XEC |
| `sendToken(address, tokenId, quantity)` | Promise<void> | Send Token |
| `sendBip21(bip21)` | Promise<void> | Send using BIP21 URI |
| `createTransactionFromBip21(bip21)` | object | Create transaction from BIP21 |
| `destroy()` | void | Cleanup event listeners |

### Error Types

| Error Class | Description |
|--------|------|
| `CashtabExtensionUnavailableError` | Extension not installed |
| `CashtabAddressDeniedError` | User denied providing address |
| `CashtabTransactionDeniedError` | User denied transaction |
| `CashtabTimeoutError` | Request timeout |

---

## Code Examples

### React Component Integration

```tsx
import React, { useEffect, useState } from 'react';
import { CashtabConnect } from 'cashtab-connect';
import {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
} from 'cashtab-connect';

function WalletConnect() {
  const [cashtab] = useState(() => new CashtabConnect());
  const [isAvailable, setIsAvailable] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cashtab.waitForExtension()
      .then(() => setIsAvailable(true))
      .catch(() => setIsAvailable(false));

    return () => cashtab.destroy();
  }, [cashtab]);

  const handleConnect = async () => {
    try {
      setError(null);
      const addr = await cashtab.requestAddress();
      setAddress(addr);
    } catch (err) {
      if (err instanceof CashtabExtensionUnavailableError) {
        setError('Please install Cashtab wallet extension first');
      } else if (err instanceof CashtabAddressDeniedError) {
        setError('You denied the address request');
      } else {
        setError('Connection failed, please retry');
      }
    }
  };

  return (
    <div>
      {!isAvailable && (
        <button onClick={() => window.open('https://cashtab.com')}>
          Install Cashtab Wallet
        </button>
      )}

      {isAvailable && !address && (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}

      {address && <p>Connected: {address}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

### Payment Component

```tsx
function PaymentButton({ toAddress, amount }: { toAddress: string; amount: string }) {
  const [cashtab] = useState(() => new CashtabConnect());
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handlePay = async () => {
    try {
      setStatus('pending');
      await cashtab.sendXec(toAddress, amount);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button onClick={handlePay} disabled={status === 'pending'}>
      {status === 'idle' && `Pay ${amount} XEC`}
      {status === 'pending' && 'Waiting for confirmation...'}
      {status === 'success' && 'Payment successful'}
      {status === 'error' && 'Payment failed'}
    </button>
  );
}
```

---

## How It Works

### Extension Detection

```typescript
// Cashtab extension injects identifier on window object
window.bitcoinAbc === 'cashtab'
```

### Message Protocol

```typescript
// Message format sent to extension
{
  text: "Cashtab",
  type: "FROM_PAGE",
  addressRequest: true,  // or
  txInfo: { bip21: "ecash:...?amount=..." }
}

// Message format returned from extension
{
  type: "FROM_CASHTAB",
  success: boolean,
  address?: string,
  txResponse?: {
    approved: boolean,
    txid?: string,
    reason?: string
  }
}
```

---

## Troubleshooting

### Common Issues

**Q: waitForExtension always fails**
- Check if Cashtab extension is installed
- Check browser compatibility
- Try increasing timeout

**Q: requestAddress no response**
- User may have cancelled the popup
- Extension may need page refresh
- Check console for errors

**Q: sendXec fails**
- Ensure user has sufficient balance
- Check if address format is correct
- User may have denied the transaction

**Q: Memory leak**
- Ensure destroy() is called on component unmount
- Don't create multiple CashtabConnect instances

### Detection Scripts

```typescript
// Check if extension is installed
function isCashtabInstalled(): boolean {
  return typeof window !== 'undefined' &&
    (window as any).bitcoinAbc === 'cashtab';
}

// Check extension version
function getCashtabVersion(): string | null {
  return (window as any).cashtabVersion || null;
}
```
