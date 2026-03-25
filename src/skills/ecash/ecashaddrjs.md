---
name: ecashaddrjs
description: JavaScript implementation of CashAddr address format for eCash
version: 2.0.0
tags: [address, cashaddr, encoding, decoding]
---

# ecashaddrjs

eCash 地址格式（CashAddr）的 JavaScript 实现，用于地址的编码和解码。

## 概述

ecashaddrjs 提供了 eCash（，前身 Bitcoin Cash）地址格式的编码和解码功能：
- CashAddr 格式与 Legacy 格式转换
- 支持 P2PKH 和 P2SH 地址类型
- Node.js 和浏览器均可使用
- 依赖仅 `big-integer`

**npm**: `ecashaddrjs`
**版本**: 2.0.0
**仓库**: github.com/bytesofman/ecashaddrjs

---

## Claude Code 使用指南

### 安装

```bash
npm install ecashaddrjs
```

### 基础用法

```typescript
import ecashaddr from 'ecashaddrjs';
// 或者 const ecashaddr = require('ecashaddrjs');

// 解码地址
const { prefix, type, hash } = ecashaddr.decode('bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6');
console.log(prefix); // 'bitcoincash'
console.log(type);   // 'P2PKH'
console.log(hash);   // Uint8Array [118, 160, ...]

// 编码为 eCash 地址
const ecashAddress = ecashaddr.encode('ecash', type, hash);
console.log(ecashAddress); // 'ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d'
```

### 地址格式转换

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

// 获取不带前缀的地址
function stripPrefix(address: string): { type: string; hash: Uint8Array } {
  const { type, hash } = ecashaddr.decode(address);
  return { type, hash };
}
```

### 验证地址

```typescript
function isValidEcashAddress(address: string): boolean {
  try {
    const { prefix } = ecashaddr.decode(address);
    return prefix === 'ecash';
  } catch {
    return false;
  }
}

// 使用示例
isValidEcashAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d'); // true
isValidEcashAddress('bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6'); // false (是 BCH 不是 eCash)
```

### 提示词模板

```
我需要验证 eCash 地址格式是否正确

我需要将 Bitcoin Cash 地址转换为 eCash 地址

我需要从地址中提取 hash 和类型
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# ecashaddrjs 配置
- name: "ecashaddrjs"
  description: "eCash 地址格式编码/解码"
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
        // 地址解码后必须验证 type 和 hash
        const { prefix, type, hash } = ecashaddr.decode(address);
        if (type !== 'P2PKH' && type !== 'P2SH') {
          throw new Error('Unsupported address type');
        }

    - type: "validation"
      statement: |
        // 验证函数模板
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
        // 地址格式转换
        function convertAddressPrefix(address: string, newPrefix: string): string {
          const { type, hash } = ecashaddr.decode(address);
          return ecashaddr.encode(newPrefix, type, hash);
        }
```

### AI 角色设定

```
当你编写涉及 ecashaddrjs 的代码时：

1. 总是使用 decode() 时捕获异常处理无效地址
2. decode() 需要带前缀的地址（bitcoincash:, ecash: 等）
3. hash 返回是 Uint8Array，不是 Buffer
4. 支持的 type 只有 'P2PKH' 和 'P2SH'
5. 推荐的 prefix: 'ecash' (主网), 'ectest' (测试网)
```

---

## API 参考

### encode(prefix, type, hash)

将 hash 编码为 CashAddr 格式地址。

| 参数 | 类型 | 描述 |
|------|------|------|
| prefix | string | 网络前缀 |
| type | string | 地址类型 ('P2PKH' 或 'P2SH') |
| hash | Uint8Array | 地址 hash |

**返回**: string - 编码后的地址

### decode(address)

解码 CashAddr 格式地址。

| 参数 | 类型 | 描述 |
|------|------|------|
| address | string | 带前缀的地址 |

**返回**: `{ prefix: string, type: string, hash: Uint8Array }`

### ValidationError

无效输入时抛出的异常类。

### 支持的 Address Types

| 类型 | 描述 |
|------|------|
| P2PKH | Pay to Public Key Hash（最常用） |
| P2SH | Pay to Script Hash |

### 支持的 Network Prefixes

| Prefix | 网络 |
|--------|------|
| ecash | eCash 主网 |
| bitcoincash | Bitcoin Cash 主网 |
| simpleledger | Simpleledger 协议 |
| etoken | eToken |
| ectest | eCash 测试网 |
| bchtest | Bitcoin Cash 测试网 |
| bchreg | Bitcoin Cash regtest |

### 支持的 Hash Sizes

- 160, 192, 224, 256, 320, 384, 448, 512 bits

---

## 代码示例

### React 中的地址转换组件

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
      setError('无效的地址格式');
      setOutput('');
    }
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => convert(e.target.value)}
        placeholder="输入 Bitcoin Cash 地址"
      />
      {output && <div>eCash 地址: {output}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
```

### Node.js 批量转换

```typescript
import ecashaddr from 'ecashaddrjs';

function batchConvertToEcash(addresses: string[]): string[] {
  return addresses.map(addr => {
    try {
      const { type, hash } = ecashaddr.decode(addr);
      return ecashaddr.encode('ecash', type, hash);
    } catch {
      return null; // 跳过无效地址
    }
  }).filter(Boolean) as string[];
}

// 使用
const bchAddresses = [
  'bitcoincash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuj6vnmhp6',
  'bitcoincash:qpjdz6r9h5s4fnvtrp7vfadxmwsfqe5x9cjyqu50xd',
];
const ecashAddresses = batchConvertToEcash(bchAddresses);
```

### 从私钥派生地址（与 ecash-lib 配合）

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

## 故障排除

### 常见问题

**Q: decode() 抛出 "Invalid prefix"**
- 确保地址包含前缀，如 `ecash:` 或 `bitcoincash:`
- 不支持不带前缀的 legacy 地址

**Q: 转换后地址不同**
- 这是正常的！eCash 和 Bitcoin Cash 使用不同的 prefix
- hash 和 type 是相同的，只是 prefix 不同

**Q: hash 长度不对**
- P2PKH hash 应该是 20 字节 (160 bits)
- P2SH hash 应该是 20 字节 (160 bits)

**Q: Uint8Array 和 Buffer 混淆**
- ecashaddrjs 返回 Uint8Array，不是 Node Buffer
- 转换: `Buffer.from(uint8array)` 或 `new Uint8Array(buffer)`

### 验证正则表达式

```typescript
// 完整的 eCash 地址格式验证
const ECASH_REGEX = /^ecash:(?:qp|qq)[a-z0-9]{41}$/i;
const LEGACY_REGEX = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;

function isValidFullEcash(address: string): boolean {
  return ECASH_REGEX.test(address);
}
```

### 浏览器中使用

```html
<!-- 方式1: CDN -->
<script src="https://unpkg.com/ecashaddrjs@2.0.0/dist/cashaddrjs-2.0.0.min.js"></script>
<script>
  const { prefix, type, hash } = cashaddr.decode('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');
</script>

<!-- 方式2: ES Module -->
<script type="module">
  import ecashaddr from 'https://esm.sh/ecashaddrjs@2.0.0';
</script>
```
