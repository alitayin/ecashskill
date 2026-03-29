---
name: paybutton
description: Embeddable payment button for accepting eCash on websites
version: 1.0.0
tags: [ecash, payment, button, widget, web, react, ecommerce]
---

# PayButton

The easiest way to accept eCash online — add a donation or buy button to any website.

**npm**: `@paybutton/paybutton` (vanilla JS) / `@paybutton/react` (React)
**Official Documentation**: https://paybutton.org
**Repository**: https://github.com/PayButton/paybutton

## Quick Start

### HTML (CDN)

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>
```

### JavaScript

```typescript
// Include CDN script first, then:
PayButton.render(document.getElementById('my_button'), {
  to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp',
  amount: 4.5,
  currency: 'USD',
  text: 'Tip Us a Coffee!',
  onSuccess: (transaction) => console.log(transaction),
});
```

### React

```bash
npm i --save @paybutton/react
```

```typescript
import { PayButton } from '@paybutton/react';

function App() {
  return (
    <PayButton
      to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"
      amount={12}
      currency="USD"
      text="Join the Cause"
      onSuccess={(tx) => console.log('Paid!', tx)}
    />
  );
}
```

## Widget (Always Visible)

Renders an inline payment form without requiring a button click.

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>
```

## Callbacks

```typescript
PayButton.render(el, {
  to: 'ecash:q...',

  // Fires when the correct amount is received
  onSuccess: (transaction) => {
    const { hash, amount, paymentId, confirmed, message, timestamp,
            address, rawMessage, inputAddresses } = transaction;
    console.log('Payment confirmed:', hash);
  },

  // Fires on any incoming transaction (may be wrong amount/OP_RETURN)
  onTransaction: (transaction) => {
    console.log('Received:', transaction.amount);
  },

  // Fires when dialog opens
  onOpen: (amount, to, paymentId) => {
    console.log('Dialog opened for', amount, 'XEC to', to);
  },

  // Fires when dialog closes
  onClose: (success, paymentId) => {
    console.log('Closed. Success:', success, 'ID:', paymentId);
  },
});
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `to` | `string` | **required** | eCash recipient address |
| `amount` | `number` | `0` | Payment amount (0 = any) |
| `currency` | `string` | `'XEC'` | Currency for amount: `'XEC'`, `'BCH'`, `'USD'`, `'CAD'` |
| `text` | `string` | `'Donate'` | Button label text |
| `hover-text` | `string` | `'Click to send XEC'` | Button label on hover |
| `goal-amount` | `number` | `0` | Funding goal; shows progress bar |
| `editable` | `boolean` | `false` | Allow user to edit the payment amount |
| `theme` | `object` | see below | Color palette object |
| `animation` | `string` | `'slide'` | Hover animation: `'slide'`, `'invert'`, `'none'` |
| `success-text` | `string` | `'Thanks for your support!'` | Text shown on successful payment |
| `transaction-text` | `string` | `''` | Text shown on non-matching transaction |
| `on-success` | `function` | — | Callback on successful payment |
| `on-transaction` | `function` | — | Callback on any transaction |
| `on-open` | `function` | — | Callback when dialog opens |
| `on-close` | `function` | — | Callback when dialog closes |
| `op-return` | `string` | `''` | Custom OP_RETURN message (max 68 bytes) |
| `disable-payment-id` | `boolean` | `false` | Disable unique payment ID generation |
| `random-satoshis` | `boolean\|number` | `false` | Randomize last N satoshi digits (0–4; `true` = 3) |
| `hide-toasts` | `boolean` | `false` | Suppress built-in toast notifications |
| `disable-enforce-focus` | `boolean` | `true` | MUI Dialog `enforceVocus` prop |
| `disabled` | `boolean` | `false` | Lock button/widget to prevent interaction |
| `ws-base-url` | `string` | `'https://socket.paybutton.org'` | WebSocket server URL |
| `api-base-url` | `string` | `'https://paybutton.org'` | API server URL |
| `disable-altpayment` | `boolean` | `false` | Disable alternate payment logic |
| `contribution-offset` | `number` | `0` | Offset added to displayed contribution total |
| `auto-close` | `boolean\|number` | `true` (2s) | Auto-close dialog after payment; number = custom delay in seconds |
| `disable-sound` | `boolean` | `false` | Mute success sound |
| `size` | `string` | `'md'` | Button size: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` |
| `donation-rate` | `number` | `2` | Percentage (0–100) donated to PayButton development |

### Default Theme

```json
{
  "palette": {
    "primary": "#4bc846",
    "secondary": "#f8fdf8",
    "tertiary": "#374936"
  }
}
```

## OP_RETURN Formats

The `op-return` field supports four input formats, auto-parsed in callbacks:

```typescript
// Plain string
op-return="hello world"
// → "hello world"

// Key-value pairs (= separator, | for multiple values)
op-return="classOf=2013 bullYears=2013|2017|2021"
// → { classOf: 2013, bullYears: [2013, 2017, 2021] }

// JSON string
op-return="{'foo': 'bar'}"
// → { foo: 'bar' }

// Pipe-separated array
op-return="item1|item2|item3"
// → ["item1", "item2", "item3"]
```

## Important Notes

- Requires React v16.3+ for `@paybutton/react`
- `random-satoshis` and `disable-payment-id` serve the same anti-collision purpose — use one or the other
- `contribution-offset` is capped at `goal-amount`; negative values subtract from the displayed total
- `ws-base-url` and `api-base-url` are only needed when self-hosting the PayButton backend
- The Widget (`paybutton-widget`) renders inline; the `text` parameter has no effect on it
