---
name: cashtab
description: Full-featured eCash web wallet application and reference implementation
version: 1.0.0
tags: [wallet, web, reference, implementation, badger]
---

# Cashtab

全功能的 eCash 网页钱包应用，作为 eCash 生态系统的参考实现。

## 概述

Cashtab 是 eCash 官方网页钱包：
- XEC 和 eToken 收发
- BIP39 助记词导入
- 消息签名
- SLP/ALP Token 支持
- 浏览器扩展（Chrome/Brave）
- Docker 部署

**官网**: https://wallet.badger.cash/
**仓库**: github.com/badger-cash/cashtab
**前端框架**: React 17 + Ant Design

---

## Claude Code 使用指南

### 技术栈

```
前端: React 17 + React Router
UI: Ant Design
钱包库: bcash (forked)
地址处理: ecashaddrjs
存储: localforage (IndexedDB)
大数运算: bignumber.js
二维码: zxing/library
```

### 核心架构

#### 目录结构

```
src/
├── components/
│   ├── Authentication/   # 钱包解锁/认证
│   ├── Common/          # 共享组件 (QRCode, BalanceHeader, Ticker)
│   ├── Configure/      # 设置
│   ├── OnBoarding/     # 新钱包创建
│   ├── Send/           # 发送 XEC/eTokens
│   ├── Tokens/         # Token 管理
│   └── Wallet/         # 主钱包视图
├── hooks/
│   ├── useWallet.js    # 核心钱包状态
│   └── useBCH.js       # 区块链交互
├── utils/
│   ├── cashMethods.js  # 余额格式化、地址转换
│   ├── tokenMethods.js # Token 工具
│   ├── context.js      # React Context
│   └── validation.js   # 输入验证
```

#### 状态管理

```typescript
// WalletContext 提供全局钱包状态
const { wallet, balance, tokens, sendTx } = useWallet();

// 钱包对象结构
{
  mnemonic: string,
  Path245: { cashAddress, slpAddress, legacyAddress, publicKey },
  Path145: { ... },
  Path1899: { ... },
  state: {
    balances: { totalBalance, totalBalanceInSatoshis },
    tokens: [{ tokenId, balance, hasBaton, info }],
    utxos: [...],
    parsedTxHistory: [...]
  }
}
```

### BIP44 派生路径

Cashtab 支持三种派生路径：

| 路径 | 用途 | Coin Type |
|------|------|-----------|
| `m/44'/245'/0'/0/0` | Path245 (主路径) | 245 |
| `m/44'/145'/0'/0/0` | Path145 | 145 |
| `m/44'/1899'/0'/0/0` | Path1899 (eCash) | 1899 |

### API 调用

Cashtab 使用 bcash 后端 REST API：

```javascript
// 环境变量
REACT_APP_BCASH_API=https://ecash.badger.cash:8332

// 获取地址 UTXO
GET /coin/address/{address}?slp=true

// 获取交易历史
GET /tx/address/{address}?slp=true&limit=30&reverse=true

// 获取 Token 信息
GET /token/{tokenId}

// 获取特定 UTXO
GET /coin/{hash}/{index}?slp=true
```

### 关键模式

#### 地址转换

```typescript
import ecashaddr from 'ecashaddrjs';

// eCash 地址转换
function convertAddress(address, fromPrefix, toPrefix) {
  const { type, hash } = ecashaddr.decode(address);
  return ecashaddr.encode(toPrefix, type, hash);
}

// 示例
convertAddress('ecash:q...', 'ecash', 'simpleledger');
```

#### 余额格式化

```typescript
import { fromSmallestDenomination } from './cashMethods';

// XEC 格式化 (1 XEC = 100 satoshis)
const xecBalance = fromSmallestDenomination(balanceSats, 2); // 2 decimals
// 1000000 sats = 10000.00 XEC

// Token 格式化
const tokenBalance = fromSmallestDenomination(tokenSats, tokenDecimals);
```

#### Token 操作

```typescript
// SLP Token 转账
async function sendToken(toAddress, tokenId, quantity, decimals) {
  // 构建 OP_RETURN 输出
  const opReturn = buildSlpOpReturn(tokenId, 'SEND', quantity, decimals);

  // 构建交易
  const tx = await buildTransaction({
    inputs: selectedUtxos,
    outputs: [
      { script: opReturn, sats: 0 },
      { address: toAddress, sats: 546 },
    ],
  });

  return tx.serialize().toString('hex');
}
```

### 提示词模板

```
我需要了解 Cashtab 的钱包架构

我需要实现类似 Cashtab 的余额显示

我需要实现 SLP Token 转账

我需要实现地址格式转换

我需要了解 Cashtab 的状态管理模式
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# Cashtab 参考配置
- name: "cashtab"
  description: "Cashtab eCash 钱包参考实现"
  files:
    - "**/*wallet*"
    - "**/*cashtab*"
    - "**/useWallet*"
    - "**/cashMethods*"
  rules:
    - type: "dependencies"
      statement: |
        # Cashtab 使用的核心库
        - bcash (forked): 交易构建和签名
        - ecashaddrjs: 地址编解码
        - localforage: IndexedDB 存储
        - bignumber.js: 精度计算

    - type: "derivation-paths"
      statement: |
        # BIP44 派生路径
        - Path245: m/44'/245'/0'/0/0 (主)
        - Path145: m/44'/145'/0'/0/0
        - Path1899: m/44'/1899'/0'/0/0 (eCash)

    - type: "address-types"
      statement: |
        # 支持的地址格式
        - cashAddress: ecash:q...
        - slpAddress: simpleledger:q...
        - legacyAddress: 1... 或 3...
        - etokenAddress: etoken:q...

    - type: "bip70"
      statement: |
        # BIP70 支付协议支持
        - 使用 b70 库处理 PaymentDetails
        - 支持 Simple Ledger Payment Protocol

    - type: "storage"
      statement: |
        # 存储策略
        - localforage (IndexedDB) 优先
        - fallback 到 localStorage
        - 钱包加密存储

    - type: "state-management"
      statement: |
        # React Context 模式
        - WalletContext: 钱包状态
        - AuthenticationContext: 认证状态
        - useWallet hook 访问状态
```

### AI 角色设定

```
当参考 Cashtab 实现 eCash 功能时：

1. 使用 React Context 管理全局状态
2. BIP44 派生路径使用 Path1899 (coin type 1899)
3. 地址转换使用 ecashaddrjs
4. 金额计算使用 bignumber.js 避免精度问题
5. SLP Token 使用 OP_RETURN 编码
6. 优先使用 IndexedDB (localforage) 存储
7. 浏览器扩展使用 chrome.storage
```

---

## API 参考

### cashMethods.js

```typescript
// 格式化余额
fromSmallestDenomination(sats: number, decimals: number): string
toSmallestDenomination(amount: string, decimals: number): bigint

// 地址验证
isValidAddress(address: string): boolean
isValidEcashAddress(address: string): boolean

// 地址转换
convertPrefix(address: string, newPrefix: string): string
```

### tokenMethods.js

```typescript
// SLP OP_RETURN 构建
buildSlpOpReturn(tokenId: string, type: string, quantity: bigint, decimals: number): Uint8Array

// Token ID 验证
isValidTokenId(tokenId: string): boolean

// Token 数量格式化
formatTokenQuantity(quantity: bigint, decimals: number): string
parseTokenQuantity(amount: string, decimals: number): bigint
```

### OP_RETURN 编码

```typescript
// eToken prefix
const ETOKEN_PREFIX = '6a04534c5000'; // OP_RETURN + SLP0

// Cashtab prefix
const CASHTAB_PREFIX = '6a0400746162'; // OP_RETURN + tab
```

---

## 代码示例

### 钱包状态 Hook

```typescript
// useWallet.js 参考实现
import { createContext, useContext } from 'react';
import { WalletContext } from './context';

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

// 使用
function BalanceDisplay() {
  const { wallet, loading } = useWallet();

  if (loading) return <Spinner />;

  return (
    <div>
      <span>XEC: {wallet.state.balances.totalBalance}</span>
      <span>Tokens: {wallet.state.tokens.length}</span>
    </div>
  );
}
```

### 地址派生

```typescript
// 参考 bcash 的 BIP44 派生
import { HD } from 'bcash';

function deriveAddress(mnemonic, path) {
  const seed = HD.fromMnemonic(mnemonic).toSeed();
  const hd = HD.fromSeed(seed);

  // m/44'/1899'/0'/0/0
  const child = hd.derive(44 + 0x80000000)  // purpose
               .derive(1899 + 0x80000000)    // coin type
               .derive(0 + 0x80000000)      // account
               .derive(0)                    // change
               .derive(0);                   // index

  const keyring = KeyRing.fromHD(child);
  return keyring.getAddress('ecash');
}
```

### 发送交易

```typescript
// 参考 Send 组件的发送逻辑
async function sendXec(toAddress, amountSats) {
  // 1. 获取可用 UTXO
  const utxos = await fetchUtxos(wallet.address);

  // 2. 选择 UTXO (贪心算法)
  const selectedUtxos = selectUtxos(utxos, amountSats);

  // 3. 构建交易
  const mtX = new MTX();
  mtX.addOutput(toAddress, amountSats);

  // 添加找零
  const change = totalInput - amountSats - fee;
  if (change > 0) {
    mtX.addOutput(wallet.address, change);
  }

  // 4. 签名
  for (const utxo of selectedUtxos) {
    mtX.sign(utxo.keyring);
  }

  // 5. 广播
  const rawTx = mtX.toString();
  return await broadcastTx(rawTx);
}
```

### Token 转账

```typescript
// SLP Token 转账参考
function buildSlpSend(tokenId, toAddress, quantity, decimals) {
  // 1. 构建 OP_RETURN
  const opReturn = new Script([
    Opcode.OP_RETURN,
    Buffer.from('SLP', 'ascii'),
    Buffer.from([0]), // SLP version
    Buffer.from('SEND', 'ascii'),
    encodeQuantity(quantity, decimals),
  ]);

  // 2. 构建 Token 输出 (Qty=0 表示只发送 token，不发送 XEC)
  const tokenOutput = new Script([
    Opcode.OP_RETURN,
    tokenId,
    Buffer.from([0x02]), // SEND type
    encodeQuantity(quantity, decimals),
  ]);

  // 3. 构建交易
  // ...
}
```

---

## 故障排除

### 常见问题

**Q: 钱包导入失败**
- 检查 BIP39 助记词有效性
- 确认 12/24 词格式正确
- 验证派生路径

**Q: 余额显示不正确**
- 检查 API 端点是否可访问
- 确认地址格式正确
- 验证解析精度

**Q: 交易广播失败**
- 检查网络连接
- 验证交易费用足够
- 确认 UTXO 可花费

**Q: Token 不显示**
- 检查 Token ID 是否正确
- 确认 Token 类型 (SLP/ALP)
- 验证 OP_RETURN 编码

### 调试技巧

```typescript
// 启用调试日志
localStorage.setItem('debug', 'true');

// 查看钱包状态
console.log('Wallet:', wallet);

// 查看 API 响应
console.log('UTXOs:', utxos);

// 检查派生
console.log('Derived address:', derivedAddress);
```

### 浏览器扩展集成

```typescript
// 检测 Cashtab 扩展
if (window.bitcoinAbc === 'cashtab') {
  // 使用扩展连接
  const address = await window.bitcoinAbc.requestAddress();
}

// 扩展消息协议
window.postMessage({
  type: 'FROM_PAGE',
  addressRequest: true,
}, '*');
```

---

## 相关链接

- **Cashtab 官网**: https://wallet.badger.cash/
- **GitHub**: https://github.com/badger-cash/cashtab
- **bcash fork**: https://github.com/badger-cash/bcash
- **bcash 文档**: https://github.com/badger-cash/bcash/blob/webpack-ecash/docs/
