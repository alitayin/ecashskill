---
name: ecashaddrjs
description: JavaScript implementation of CashAddr address format for eCash
version: 2.0.0
tags: [address, cashaddr, encoding, decoding]
---

# ecashaddrjs

JavaScript implementation of eCash address format (CashAddr) for address encoding and decoding.

## Overview

ecashaddrjs provides encoding and decoding for eCash (formerly Bitcoin Cash) address format:
- CashAddr format and Legacy format conversion
- Support for P2PKH and P2SH address types
- Works in both Node.js and browser
- Only dependency is `big-integer`

**npm**: `ecashaddrjs`
**Version**: 2.0.0
**Repository**: github.com/bytesofman/ecashaddrjs

---

## Claude Code Usage Guide

### Installation

```bash
npm install ecashaddrjs
```

### Basic Usage

```typescript
import ecashaddr from 'ecashaddrjs';
// or const ecashaddr = require('ecashaddrjs');

// Decode address
const { prefix, type, hash } = ecashaddr.decode('bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6');
console.log(prefix); // 'bitcoincash'
console.log(type);   // 'P2PKH'
console.log(hash);   // Uint8Array [118, 160, ...]

// Encode to eCash address
const ecashAddress = ecashaddr.encode('ecash', type, hash);
console.log(ecashAddress); // 'ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d'
```

### Address Format Conversion

```typescript
// Bitcoin Cash -> eCash
function convertToEcash(bchAddress: string): string {
  const { prefix, type, hash } = ecashaddr.decode(bchAddress);
  return ecashaddr.encode('ecash', type, hash);
}

// eCash -> Bitcoin Cash
function convertToBch(ecashAddress: string): string {
  const { prefix, type, hash } = ecashaddr.decode(ecashAddress);
  return ecashaddr.encode('bitcoincash', type, hash);
}

// Get address without prefix
function stripPrefix(address: string): { type: string; hash: Uint8Array } {
  const { type, hash } = ecashaddr.decode(address);
  return { type, hash };
}
```

### Validate Address

```typescript
function isValidEcashAddress(address: string): boolean {
  try {
    const { prefix } = ecashaddr.decode(address);
    return prefix === 'ecash';
  } catch {
    return false;
  }
}

// Usage examples
isValidEcashAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d'); // true
isValidEcashAddress('bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6'); // false (it's BCH, not eCash)
```

### Prompt Templates

```
I need to validate if an eCash address format is correct

I need to convert a Bitcoin Cash address to eCash address

I need to extract hash and type from an address
```

---

## Cursor Rules Configuration

### .cursorrules Snippet

```yaml
# ecashaddrjs Configuration
- name: "ecashaddrjs"
  description: "eCash address format encoding/decoding"
  files:
    - "**/*address*"
    - "**/utils/**/*.ts"
    - "**/validation/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import ecashaddr from 'ecashaddrjs';

    - type: "best-practice"
      statement: |
        // Must validate type and hash after address decoding
        const { prefix, type, hash } = ecashaddr.decode(address);
        if (type !== 'P2PKH' && type !== 'P2SH') {
          throw new Error('Unsupported address type');
        }

    - type: "validation"
      statement: |
        // Validation function template
        function isValidEcashAddress(address: string): boolean {
          try {
            const { prefix } = ecashaddr.decode(address);
            return prefix === 'ecash';
          } catch {
            return false;
          }
        }

    - type: "conversion"
      statement: |
        // Address format conversion
        function convertAddressPrefix(address: string, newPrefix: string): string {
          const { type, hash } = ecashaddr.decode(address);
          return ecashaddr.encode(newPrefix, type, hash);
        }
```

### AI Role Settings

```
When writing code involving ecashaddrjs:

1. Always catch exceptions when using decode() to handle invalid addresses
2. decode() requires address with prefix (bitcoincash:, ecash:, etc.)
3. hash returned is Uint8Array, not Buffer
4. Supported type only has 'P2PKH' and 'P2SH'
5. Recommended prefix: 'ecash' (mainnet), 'ectest' (testnet)
```

---

## API Reference

### encode(prefix, type, hash)

Encode hash into CashAddr format address.

| Parameter | Type | Description |
|------|------|------|
| prefix | string | Network prefix |
| type | string | Address type ('P2PKH' or 'P2SH') |
| hash | Uint8Array | Address hash |

**Returns**: string - Encoded address

### decode(address)

Decode CashAddr format address.

| Parameter | Type | Description |
|------|------|------|
| address | string | Address with prefix |

**Returns**: `{ prefix: string, type: string, hash: Uint8Array }`

### ValidationError

Exception class thrown for invalid input.

### Supported Address Types

| Type | Description |
|------|------|
| P2PKH | Pay to Public Key Hash (most common) |
| P2SH | Pay to Script Hash |

### Supported Network Prefixes

| Prefix | Network |
|--------|------|
| ecash | eCash mainnet |
| bitcoincash | Bitcoin Cash mainnet |
| simpleledger | Simpleledger protocol |
| etoken | eToken |
| ectest | eCash testnet |
| bchtest | Bitcoin Cash testnet |
| bchreg | Bitcoin Cash regtest |

### Supported Hash Sizes

- 160, 192, 224, 256, 320, 384, 448, 512 bits

---

## Code Examples

### Address Conversion Component in React

```tsx
import ecashaddr from 'ecashaddrjs';

function EcashConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = (address: string) => {
    try {
      const { type, hash } = ecashaddr.decode(address);
      const ecashAddr = ecashaddr.encode('ecash', type, hash);
      setOutput(ecashAddr);
      setError('');
    } catch (e) {
      setError('Invalid address format');
      setOutput('');
    }
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => convert(e.target.value)}
        placeholder="Enter Bitcoin Cash address"
      />
      {output && <div>eCash address: {output}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
```

### Batch Conversion in Node.js

```typescript
import ecashaddr from 'ecashaddrjs';

function batchConvertToEcash(addresses: string[]): string[] {
  return addresses.map(addr => {
    try {
      const { type, hash } = ecashaddr.decode(addr);
      return ecashaddr.encode('ecash', type, hash);
    } catch {
      return null; // Skip invalid addresses
    }
  }).filter(Boolean) as string[];
}

// Usage
const bchAddresses = [
  'bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6',
  'bitcoincash:qpjdz6r9h5s4fnvtrp7vfadxmwsfqe5x9cjyqu50xd',
];
const ecashAddresses = batchConvertToEcash(bchAddresses);
```

### Derive Address from Private Key (with ecash-lib)

```typescript
import ecashaddr from 'ecashaddrjs';
import { Ecc, shaRmd160 } from 'ecash-lib';
import { fromHex } from 'ecash-lib/dist/util';

function privateKeyToEcashAddress(seckeyHex: string): string {
  const ecc = new Ecc();
  const seckey = fromHex(seckeyHex);
  const pubkey = ecc.derivePubkey(seckey);
  const pkh = shaRmd160(pubkey);

  return ecashaddr.encode('ecash', 'P2PKH', pkh);
}
```

---

## Troubleshooting

### Common Issues

**Q: decode() throws "Invalid prefix"**
- Ensure address includes prefix, such as `ecash:` or `bitcoincash:`
- Legacy addresses without prefix are not supported

**Q: Address changes after conversion**
- This is normal! eCash and Bitcoin Cash use different prefixes
- hash and type are the same, only prefix differs

**Q: Hash length incorrect**
- P2PKH hash should be 20 bytes (160 bits)
- P2SH hash should be 20 bytes (160 bits)

**Q: Uint8Array and Buffer confusion**
- ecashaddrjs returns Uint8Array, not Node Buffer
- Conversion: `Buffer.from(uint8array)` or `new Uint8Array(buffer)`

### Validation Regex

```typescript
// Complete eCash address format validation
const ECASH_REGEX = /^ecash:(?:qp|qq)[a-z0-9]{41}$/i;
const LEGACY_REGEX = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;

function isValidFullEcash(address: string): boolean {
  return ECASH_REGEX.test(address);
}
```

### Browser Usage

```html
<!-- Method 1: CDN -->
<script src="https://unpkg.com/ecashaddrjs@2.0.0/dist/cashaddrjs-2.0.0.min.js"></script>
<script>
  const { prefix, type, hash } = cashaddr.decode('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');
</script>

<!-- Method 2: ES Module -->
<script type="module">
  import ecashaddr from 'https://esm.sh/ecashaddrjs@2.0.0';
</script>
```
