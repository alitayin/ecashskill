---
name: ecash-wallet
description: HD wallet library for eCash with XEC and token support
version: 5.1.0
tags: [wallet, hd, bip44, tokens, utxo]
---

# ecash-wallet

eCash HD 钱包库，支持 XEC 转账、Token 操作、UTXO 管理和钱包同步。

## 概述

ecash-wallet 提供：
- HD 钱包支持（BIP44）
- XEC 和 Token 转账
- 钱包同步（Chronik）
- 链上交易构建
- Watch-Only 钱包
- SLP/ALP Token 操作

**npm**: `ecash-wallet`
**版本**: 5.1.0
**官方仓库**: github.com/Bitcoin-ABC/bitcoin-abc (modules/ecash-wallet)
**依赖**: chronik-client, ecash-lib

---

## Claude Code 使用指南

### 安装

```bash
npm install ecash-wallet
```

### 基础用法

```typescript
import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.be.cash/xec']);

// 从助记词创建钱包
const mnemonic = 'morning average minor stable parrot refuse credit exercise february mirror just begin';
const wallet = Wallet.fromMnemonic(mnemonic, chronik);
await wallet.sync();

console.log('Address:', wallet.address);
console.log('Balance:', wallet.balanceSats, 'sats');
```

### 发送 XEC

```typescript
// 发送 XEC
const { hex } = await wallet.send(toAddress, sendSats);
await wallet.broadcast(hex);

// 或一步完成
await wallet.send(toAddress, sendSats);
```

### HD 钱包

```typescript
// 创建 HD 钱包
const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  accountNumber: 0,
  receiveIndex: 0,
  changeIndex: 0,
});
await hdWallet.sync();

// 获取下一个接收地址
const receiveAddr = hdWallet.getNextReceiveAddress();

// 获取下一个找零地址
const changeAddr = hdWallet.getNextChangeAddress();

// 同步后重新获取
hdWallet.incrementReceiveIndex();
```

### Watch-Only 钱包

```typescript
import { WatchOnlyWallet } from 'ecash-wallet';

// 单地址 watch-only
const wow = WatchOnlyWallet.fromAddress(address, chronik);
await wow.sync();
console.log(wow.balanceSats);

// HD watch-only (通过 xpub)
const hdWow = WatchOnlyWallet.fromXpub(xpub, chronik, {
  hd: true,
  accountNumber: 0,
});
await hdWow.sync();
```

### Token 操作

```typescript
// SLP/ALP Token 操作
const action = wallet.action(
  tokenType,    // 'SLP' 或 'ALP'
  tokenId,
  quantity,
  outputs
);

await action.build();
await action.sign();
await action.broadcast();
```

### 提示词模板

```
我需要创建一个 eCash 钱包

我需要发送 XEC 到指定地址

我需要创建 HD 钱包并派生地址

我需要创建 watch-only 钱包

我需要查询钱包余额和 UTXO

我需要发送 SLP Token
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# ecash-wallet 配置
- name: "ecash-wallet"
  description: "eCash HD 钱包库"
  files:
    - "**/*wallet*"
    - "**/*ecash*wallet*"
  rules:
    - type: "import"
      statement: |
        import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "initialization"
      statement: |
        // 初始化钱包流程
        const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
        const wallet = Wallet.fromMnemonic(mnemonic, chronik);
        await wallet.sync(); // 同步 UTXO 和余额

    - type: "hd-wallet"
      statement: |
        // HD 钱包配置
        const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
          hd: true,
          accountNumber: 0,
          receiveIndex: 0,
          changeIndex: 0,
        });

    - type: "best-practice"
      statement: |
        // 私钥永远不存储在前端
        // 使用钱包签名而非直接操作私钥
        // 每次发送后调用 wallet.sync() 更新 UTXO

    - type: "balance"
      statement: |
        // 余额是 BigInt
        console.log(wallet.balanceSats); // 1000000n
```

### AI 角色设定

```
当你使用 ecash-wallet 时：

1. 总是先 sync() 钱包再获取余额
2. 金额使用 BigInt (n 后缀)
3. 发送后需要重新 sync() 更新 UTXO
4. WatchOnlyWallet 不能签名，只能查询
5. HD 钱包使用 BIP44 派生路径
6. 配合 chronik-client 使用
```

---

## API 参考

### Wallet

**属性:**

| 属性 | 类型 | 描述 |
|------|------|------|
| `address` | string | 当前地址 |
| `balanceSats` | bigint | XEC 余额 (satoshis) |
| `utxos` | WalletUtxo[] | UTXO 列表 |
| `sk` | Uint8Array | 私钥 (如非 watch-only) |
| `pk` | Uint8Array | 公钥 |
| `pkh` | Uint8Array | 公钥哈希 |
| `script` | Script | P2PKH 脚本 |
| `isHD` | boolean | 是否为 HD 钱包 |

**方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `sync()` | Promise<void> | 同步 UTXO 和余额 |
| `send(address, sats)` | Promise<{ hex: string }> | 发送 XEC |
| `broadcast(hex)` | Promise<string> | 广播交易 |
| `getNextReceiveAddress()` | string | 获取下一个接收地址 |
| `getNextChangeAddress()` | string | 获取下一个找零地址 |
| `incrementReceiveIndex()` | void | 增加接收地址索引 |
| `action(tokenType, tokenId, quantity, outputs)` | Action | 创建 Token 操作 |

### WatchOnlyWallet

**静态方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `fromAddress(address, chronik)` | WatchOnlyWallet | 从地址创建 |
| `fromXpub(xpub, chronik, options?)` | WatchOnlyWallet | 从 xpub 创建 |

**属性:**

| 属性 | 类型 | 描述 |
|------|------|------|
| `address` | string | 监视的地址 |
| `balanceSats` | bigint | 余额 |
| `utxos` | ScriptUtxo[] | UTXO 列表 |

### BIP44 派生路径

```
基础路径: m/44'/1899'/<accountNumber>'

接收地址: m/44'/1899'/<accountNumber>'/0/<index>
找零地址: m/44'/1899'/<accountNumber>'/1/<index>
```

**1899** 是 eCash 专用的 BIP44 coin type。

---

## 代码示例

### 完整的钱包应用

```typescript
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

class EcashWalletApp {
  private wallet: Wallet;
  private chronik: ChronikClient;

  constructor(mnemonic: string) {
    this.chronik = new ChronikClient(['https://chronik.be.cash/xec']);
    this.wallet = Wallet.fromMnemonic(mnemonic, this.chronik, { hd: true });
  }

  async start() {
    await this.wallet.sync();
    console.log(`钱包已就绪`);
    console.log(`地址: ${this.wallet.address}`);
    console.log(`余额: ${this.wallet.balanceSats} sats`);
  }

  async getNewAddress(): Promise<string> {
    const addr = this.wallet.getNextReceiveAddress();
    this.wallet.incrementReceiveIndex();
    return addr;
  }

  async send(to: string, amount: bigint) {
    if (amount > this.wallet.balanceSats) {
      throw new Error('余额不足');
    }

    const { hex } = await this.wallet.send(to, amount);
    const txid = await this.wallet.broadcast(hex);

    // 重新同步更新 UTXO
    await this.wallet.sync();

    return txid;
  }
}
```

### 处理多个 UTXO

```typescript
// 获取所有 UTXO
for (const utxo of wallet.utxos) {
  console.log(`TXID: ${utxo.txid}:${utxo.outIdx}`);
  console.log(`金额: ${utxo.sats} sats`);
  console.log(`脚本: ${utxo.script}`);
}

// 获取特定金额的 UTXO 组合
function selectUtxos(utxos: WalletUtxo[], target: bigint): WalletUtxo[] {
  let total = 0n;
  const selected: WalletUtxo[] = [];

  for (const utxo of utxos) {
    selected.push(utxo);
    total += utxo.sats;
    if (total >= target) break;
  }

  if (total < target) {
    throw new Error('UTXO 不足');
  }

  return selected;
}
```

### HD 钱包地址派生

```typescript
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.be.cash/xec']);

// 创建 HD 钱包
const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  accountNumber: 0,
  receiveIndex: 0,
  changeIndex: 0,
});

await hdWallet.sync();

// 生成一批接收地址
const receiveAddresses: string[] = [];
for (let i = 0; i < 5; i++) {
  receiveAddresses.push(hdWallet.address);
  hdWallet.incrementReceiveIndex();
}

console.log('接收地址:', receiveAddresses);
```

### Watch-Only 监控

```typescript
import { WatchOnlyWallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';

async function monitorAddress(address: string) {
  const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
  const wow = WatchOnlyWallet.fromAddress(address, chronik);

  // WebSocket 监听
  const ws = chronik.ws({
    onMessage: async (msg) => {
      if (msg.type === 'TX_ADDED_TO_MEMPOOL' || msg.type === 'TX_CONFIRMED') {
        await wow.sync(); // 更新余额
        console.log(`新交易! 当前余额: ${wow.balanceSats} sats`);
      }
    },
    autoReconnect: true,
  });

  await ws.waitForOpen();
  ws.subscribeToAddress(address);

  return wow;
}
```

---

## Token 操作

### SLP Token 转账

```typescript
// 发送 SLP Token
const action = wallet.action(
  'SLP',
  tokenId,
  1000n,  // token 数量
  [
    { address: recipientAddress, amount: 1000n }
  ]
);

await action.build();
await action.sign();
await action.broadcast();
```

### ALP Token 操作

```typescript
// ALP Genesis (创建 Token)
const action = wallet.action(
  'ALP',
  'GENESIS',  // 新建 token 用 'GENESIS'
  initialSupply,
  [{ address: wallet.address, amount: initialSupply }]
);

// ALP Send
const action = wallet.action(
  'ALP',
  tokenId,
  sendAmount,
  [{ address: recipientAddress, amount: sendAmount }]
);
```

---

## 故障排除

### 常见问题

**Q: sync() 后余额为 0**
- 确认 Chronik 节点可连接
- 检查地址是否正确
- 确认链上已有转账

**Q: send() 失败 "Insufficient funds"**
- 余额不足（需要包含手续费）
- UTXO 被占用
- 需要先 sync() 更新 UTXO

**Q: HD 钱包地址不匹配**
- 检查派生路径是否正确
- 确认 mnemonic 词序正确
- 验证 accountNumber

**Q: WatchOnlyWallet 不能签名**
- 这是设计如此，WatchOnly 只读
- 如需签名，使用 Wallet 类

**Q: Token 操作失败**
- 检查 tokenId 是否正确
- 确认 Token 余额足够
- 检查 tokenType ('SLP' 或 'ALP')

### 调试技巧

```typescript
// 启用详细日志
const wallet = Wallet.fromMnemonic(mnemonic, chronik, {
  hd: true,
  verbose: true, // 如支持
});

// 查看所有 UTXO
console.log(JSON.stringify(wallet.utxos, null, 2));

// 计算可用余额 (减去手续费)
const feeEstimate = 1000n; // 约 1k sats
const availableBalance = wallet.balanceSats - feeEstimate;
```

### 依赖版本

```json
{
  "dependencies": {
    "chronik-client": "^4.1.0",
    "ecash-lib": "^4.8.0"
  }
}
```
