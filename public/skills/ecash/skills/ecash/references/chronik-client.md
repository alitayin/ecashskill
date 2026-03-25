---
name: chronik-client
description: JavaScript/TypeScript client for Chronik Indexer API
version: 4.1.0
tags: [chronik, blockchain, indexer, websocket, api]
---

# chronik-client

Chronik Indexer API 的 JavaScript/TypeScript 客户端，用于访问 eCash 区块链索引数据。

## 概述

chronik-client 提供了访问 Chronik 索引器的方法，支持：
- 交易查询（已确认和未确认）
- 地址/脚本历史查询
- UTXO 查询
- Token 信息查询（SLP/ALP）
- 区块链区块查询
- WebSocket 实时订阅
- 交易广播

**npm**: `chronik-client`
**版本**: v4.1.0
**官方文档**: https://chronik.e.cash/

---

## Claude Code 使用指南

### 安装

```bash
npm install chronik-client
```

### 初始化客户端

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';

// 方式1: 直接连接
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);

// 方式2: 自动选择延迟最低的节点
const chronik = await ChronikClient.useStrategy(
  ConnectionStrategy.ClosestFirst,
  ['https://chronik1.example.com', 'https://chronik2.example.com']
);
```

### 常用查询

```typescript
// 查询交易
const tx = await chronik.tx('0f3c3908a2ddec8dea91d2fe1f77295bbbb158af869bff345d44ae800f0a5498');

// 查询地址 UTXO
const utxos = await chronik.address('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx').utxos();

// 查询地址历史
const history = await chronik.address('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx').history(0, 50);

// 查询 Token 信息
const token = await chronik.token('token_id_here');

// 查询区块
const block = await chronik.block(800000);
```

### 交易广播

```typescript
// 广播交易
const result = await chronik.broadcastTx('raw_tx_hex_here');

// 广播并等待确认
const result = await chronik.broadcastAndFinalizeTx('raw_tx_hex_here');

// 验证交易
const validation = await chronik.validateRawTx('raw_tx_hex_here');
```

### WebSocket 实时订阅

```typescript
const ws = chronik.ws({
  onMessage: (msg) => {
    console.log('Update:', msg);
    // msg.type: 'BLK_CONNECTED', 'BLK_DISCONNECTED', 'TX_ADDED_TO_MEMPOOL', etc.
  },
  onConnect: () => console.log('Connected'),
  onReconnect: (e) => console.log('Reconnecting:', e),
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();

// 订阅区块通知
ws.subscribeToBlocks();

// 订阅特定地址
ws.subscribeToAddress('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx');

// 订阅所有交易
ws.subscribeToTxs();

// 订阅 Token
ws.subscribeToTokenId('token_id_here');
```

### 提示词模板

```
我需要查询地址 [address] 的所有 UTXO

我需要获取交易 [txid] 的详细信息

我需要监听 [address] 的新交易通知

我需要广播一个已签名的交易
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# chronik-client 配置
- name: "chronik-client"
  description: "eCash Chronik Indexer API 客户端配置"
  files:
    - "**/*chronik*"
    - "**/wallet/**/*.ts"
    - "**/blockchain/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { ChronikClient, ConnectionStrategy } from 'chronik-client';

    - type: "best-practice"
      statement: |
        // 推荐使用 ConnectionStrategy.ClosestFirst 自动选择最优节点
        const chronik = await ChronikClient.useStrategy(
          ConnectionStrategy.ClosestFirst,
          ['https://chronik.be.cash/xec']
        );

    - type: "error-handling"
      statement: |
        // 处理 chronik 连接错误
        try {
          const tx = await chronik.tx(txid);
        } catch (error) {
          if (error.message.includes('Not Found')) {
            console.error('Transaction not found:', txid);
          } else if (error.message.includes('timeout')) {
            console.error('Chronik request timeout');
          }
        }

    - type: "websocket"
      statement: |
        // WebSocket 订阅后记得处理断开重连
        const ws = chronik.ws({
          onMessage: handleMessage,
          onReconnect: (e) => console.log('Reconnecting...'),
          autoReconnect: true,
          keepAlive: true,
        });
```

### AI 角色设定

```
当你编写涉及 chronik-client 的代码时：

1. 使用 ConnectionStrategy.ClosestFirst 作为默认连接策略
2. WebSocket 订阅总是设置 autoReconnect: true 和 keepAlive: true
3. 查询方法返回 Promise，注意使用 async/await
4. 交易广播后建议使用 broadcastAndFinalizeTx 等待确认
5. 地址查询使用便捷方法 chronik.address() 而不是 script()
```

---

## API 参考

### ChronikClient

| 方法 | 描述 |
|------|------|
| `tx(txid)` | 查询交易详情 |
| `rawTx(txid)` | 查询原始交易 |
| `address(addr)` | 查询地址（返回 ScriptEndpoint） |
| `script(type, payload)` | 查询脚本 |
| `block(hashOrHeight)` | 查询区块 |
| `blocks(start, end)` | 查询区块范围 |
| `token(tokenId)` | 查询 Token |
| `broadcastTx(rawTx)` | 广播交易 |
| `broadcastAndFinalizeTx(rawTx)` | 广播并等待确认 |
| `validateRawTx(rawTx)` | 验证交易 |
| `chronikInfo()` | 获取 Chronik 服务信息 |
| `blockchainInfo()` | 获取区块链信息 |
| `ws(options)` | 创建 WebSocket 连接 |

### ScriptEndpoint

| 方法 | 描述 |
|------|------|
| `.utxos()` | 获取 UTXO |
| `.history(page, pageSize)` | 获取历史交易 |
| `.confirmedTxs(page, pageSize)` | 获取已确认交易 |
| `.unconfirmedTxs()` | 获取未确认交易 |

### TokenIdEndpoint

| 方法 | 描述 |
|------|------|
| `.utxos()` | 获取 Token UTXO |
| `.history(page, pageSize)` | 获取 Token 历史 |
| `.confirmedTxs(page, pageSize)` | 获取已确认 Token 交易 |
| `.unconfirmedTxs()` | 获取未确认 Token 交易 |

### 支持的 Script 类型

- `p2pk` - Pay to Public Key
- `p2pkh` - Pay to Public Key Hash
- `p2sh` - Pay to Script Hash
- `p2tr` - Pay to Taproot

### 支持的 Token 协议

- **ALP** (Airdrop Lottery Protocol)
- **SLP** (Simple Ledger Protocol) - 包括 NFT1

---

## 代码示例

### 完整的钱包监听示例

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';

class WalletMonitor {
  private chronik: ChronikClient;
  private ws: any;
  private addresses: Set<string>;

  constructor(endpoints: string[]) {
    this.addresses = new Set();
    this.chronik = new ChronikClient(endpoints);
  }

  async start() {
    this.ws = this.chronik.ws({
      onMessage: (msg) => this.handleMessage(msg),
      onReconnect: () => console.log('Chronik reconnecting...'),
      autoReconnect: true,
      keepAlive: true,
    });

    await this.ws.waitForOpen();
    this.ws.subscribeToBlocks();

    for (const addr of this.addresses) {
      this.ws.subscribeToAddress(addr);
    }
  }

  addAddress(address: string) {
    this.addresses.add(address);
    if (this.ws) {
      this.ws.subscribeToAddress(address);
    }
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'BLK_CONNECTED':
        console.log('New block:', msg.blockHash);
        break;
      case 'TX_ADDED_TO_MEMPOOL':
        this.checkAddressTx(msg.txData);
        break;
    }
  }

  private async checkAddressTx(txData: any) {
    for (const addr of this.addresses) {
      if (txData.outputs.some((o: any) => o.address === addr)) {
        console.log('Incoming payment to:', addr);
      }
    }
  }
}
```

### 错误处理

```typescript
// 处理常见错误
async function safeQuery(chronik: ChronikClient, txid: string) {
  try {
    return await chronik.tx(txid);
  } catch (err: any) {
    if (err.message.includes('Not Found') || err.message.includes('404')) {
      return null; // 交易不存在
    }
    if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
      throw new Error('Chronik 节点不可用，请稍后重试');
    }
    throw err; // 其他错误继续抛出
  }
}
```

---

## 故障排除

### 常见问题

**Q: WebSocket 频繁断开**
```typescript
// 确保设置 keepAlive 和 autoReconnect
const ws = chronik.ws({
  keepAlive: true,
  autoReconnect: true,
});
```

**Q: 交易查询返回 404**
- 检查 txid 是否正确（64字符十六进制）
- 交易可能还未被索引（等待几秒后重试）

**Q: 地址格式问题**
- 确保使用完整的 CashAddr 格式：`ecash:q...`
- 或使用 `bitcoincash:q...` 等前缀

**Q: 广播失败**
- 使用 `validateRawTx` 先验证交易
- 检查交易费用是否足够

### 推荐的 Chronik 节点

- `https://chronik.be.cash/xec`
- `https://chronik索引.e.cash` (官方)

### 调试技巧

```typescript
// 开启详细日志
const chronik = new ChronikClient(['https://chronik.be.cash/xec'], {
  timeout: 30000,
  debug: true,
});
```
