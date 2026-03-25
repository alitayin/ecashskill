---
name: chronik
description: High-performance blockchain indexer built into Bitcoin ABC node
version: 1.0.0
tags: [chronik, indexer, blockchain, protocol, websocket]
---

# Chronik

Chronik 是 Bitcoin ABC 节点内置的高性能区块链索引器，为 eCash 区块链提供快速的区块、交易、脚本和 Token 索引服务。

## 概述

Chronik 提供：
- 完整的区块和交易索引
- 脚本（地址）历史查询
- SLP/ALP Token 追踪
- WebSocket 实时订阅
- HTTP API 和 WebSocket 双协议
- Protobuf 编码的高效传输

**源码**: github.com/Bitcoin-ABC/bitcoin-abc (目录 `/chronik/`)
**客户端**: chronik-client npm 包
**默认端口**: 8331

---

## Claude Code 使用指南

### 连接到 Chronik

```typescript
import { ChronikClient } from 'chronik-client';

// 连接本地节点
const chronik = new ChronikClient(['http://localhost:8331']);

// 连接远程节点
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
```

### HTTP API 端点

```
获取区块链信息
GET /blockchain-info

获取单个区块
GET /block/:hash_or_height

获取区块头
GET /block-header/:hash_or_height

获取区块内交易
GET /block-txs/:hash_or_height

获取区块范围
GET /blocks/:start/:end

获取未确认交易
GET /unconfirmed-txs

获取 Chronik 版本
GET /chronik-info

获取交易详情
GET /tx/:txid

获取原始交易
GET /raw-tx/:txid

获取 Token 信息
GET /token/:txid

广播交易
POST /broadcast-tx
POST /broadcast-txs

验证交易
POST /validate-tx
```

### 脚本查询端点

```
GET /script/:type/:payload/history          # 交易历史
GET /script/:type/:payload/utxos           # UTXO 列表
GET /script/:type/:payload/confirmed-txs   # 已确认交易
GET /script/:type/:payload/unconfirmed-txs # 未确认交易
```

### Token 查询端点

```
GET /token-id/:token_id/history
GET /token-id/:token_id/utxos
GET /token-id/:token_id/confirmed-txs
GET /token-id/:token_id/unconfirmed-txs
```

### 脚本类型

| Type | Payload | 描述 |
|------|---------|------|
| `p2pkh` | 20 字节 hash | 最常用的地址类型 |
| `p2sh` | 20 字节 hash | P2SH 地址 |
| `p2pk` | 33/65 字节 | Pay to Public Key |
| `other` | 任意字节 | 自定义脚本 |

### WebSocket 订阅

```typescript
const ws = chronik.ws({
  onMessage: handleMessage,
  autoReconnect: true,
  keepAlive: true,
});

await ws.waitForOpen();

// 订阅区块通知
ws.subscribeToBlocks();

// 订阅所有交易
ws.subscribeToTxs();

// 订阅特定地址
ws.subscribeToScript('p2pkh', 'b8ae1c47effb58f72f7bca819fe7fc252f9e852e');
ws.subscribeToAddress('ecash:qzahkehkauy0vy4jr4pmrhhttz5hqxxxxx');

// 订阅 Token
ws.subscribeToTokenId('token_id_hex');
```

### 提示词模板

```
我需要查询某个地址的所有 UTXO

我需要监听新区块通知

我需要查询某个 Token 的持有者

我需要查找特定交易的确认状态

我需要获取某个脚本的所有交易历史
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# Chronik 配置
- name: "chronik"
  description: "eCash Chronik 区块链索引器"
  files:
    - "**/*chronik*"
    - "**/*blockchain*"
    - "**/*indexer*"
  rules:
    - type: "endpoint"
      statement: |
        # Chronik API 端点
        - GET /block/:hash - 按哈希或高度获取区块
        - GET /tx/:txid - 获取交易详情
        - GET /script/:type/:payload/utxos - 获取脚本 UTXO
        - POST /broadcast-tx - 广播交易

    - type: "websocket"
      statement: |
        # WebSocket 消息类型
        BLK_CONNECTED = 0       # 区块已连接
        BLK_DISCONNECTED = 1   # 区块已断开
        BLK_FINALIZED = 2      # 区块已 Avalanche 最终确认
        TX_ADDED_TO_MEMPOOL = 0    # 交易进入内存池
        TX_REMOVED_FROM_MEMPOOL = 1 # 交易从内存池移除
        TX_CONFIRMED = 2           # 交易已确认
        TX_FINALIZED = 3           # 交易已 Avalanche 最终确认

    - type: "script-types"
      statement: |
        # 支持的脚本类型
        - p2pkh: 20 字节 hash (最常用)
        - p2sh: 20 字节 hash
        - p2pk: 33/65 字节公钥
        - other: 自定义脚本
```

### AI 角色设定

```
当你使用 Chronik API 时：

1. 交易 ID 使用小端序十六进制字符串
2. 区块哈希使用小端序
3. script payload 使用十六进制编码
4. satoshi 金额使用 int64
5. 时间戳使用 Unix 秒
6. 订阅 WebSocket 时设置 autoReconnect: true
7. 使用 chronik-client 而非直接调用 HTTP
```

---

## 数据结构

### Block 结构

```typescript
interface BlockInfo {
  hash: Uint8Array;           // 区块哈希 (小端序)
  prevHash: Uint8Array;       // 上一个区块哈希
  height: number;             // 区块高度
  nBits: number;              // 难度目标编码
  timestamp: number;          // Unix 时间戳
  isFinal: boolean;          // Avalanche 最终确认
  blockSize: number;         // 区块大小 (字节)
  numTxs: number;            // 交易数量
  sumInputSats: bigint;       // 总输入 satoshis
  sumCoinbaseOutputSats: bigint; // Coinbase 奖励
  sumNormalOutputSats: bigint;    // 普通输出总额
  sumBurnedSats: bigint;         // OP_RETURN 燃烧金额
}
```

### Transaction 结构

```typescript
interface Tx {
  txid: Uint8Array;          // 交易 ID (小端序)
  version: number;           // 交易版本
  inputs: TxInput[];         // 输入数组
  outputs: TxOutput[];        // 输出数组
  lockTime: number;          // 锁定时间
  block?: BlockMetadata;     // 所在区块信息
  timeFirstSeen: number;     // 首次进入 mempool 时间
  size: number;              // 序列化大小
  isCoinbase: boolean;       // 是否为 Coinbase 交易
  tokenEntries: TokenEntry[]; // Token 余额变化
  tokenStatus: TokenStatus;  // Token 状态
  isFinal: boolean;          // Avalanche 最终确认
}

interface TxInput {
  prevOut: OutPoint;         // 被消费的输出
  inputScript: Uint8Array;   // scriptSig
  outputScript: Uint8Array;  // 被消费输出的 scriptPubKey
  sats: bigint;              // 输入金额 (satoshis)
  sequenceNo: number;         // nSequence
}

interface TxOutput {
  sats: bigint;              // 输出金额
  outputScript: Uint8Array;  // scriptPubKey
  spentBy?: SpentBy;         // 消费此输出的输入 (如果已花费)
}
```

### Token 数据

```typescript
// SLP Token 类型
enum SlpTokenType {
  NONE = 0,
  FUNGIBLE = 1,         // SLP V1 同质化 Token
  MINT_VAULT = 2,       // SLP V2 Mint Vault
  NFT1_GROUP = 0x81,   // NFT1 Group
  NFT1_CHILD = 0x41,   // NFT1 Child
}

// ALP Token 类型
enum AlpTokenType {
  STANDARD = 0,          // 标准 ALP Token
}

// Token 交易类型
enum TokenTxType {
  NONE = 0,
  UNKNOWN = 1,
  GENESIS = 2,           // Token 创建
  SEND = 3,              // Token 转账
  MINT = 4,              // 铸造新 Token
  BURN = 5,              // 燃烧 Token
}
```

---

## Token 支持

### SLP (Simple Ledger Protocol)

```typescript
// SLP Token 查询
const token = await chronik.token('token_genesis_txid');
console.log(token.tokenType);    // SLP_TOKEN_TYPE_FUNGIBLE
console.log.token.genesisPoint); // 创世交易
console.log(token.tokenMeta);    // Token 元数据

// SLP Token 交易历史
const txs = await chronik.tokenId('token_id').history(0, 50);
```

### ALP (Augmented Ledger Protocol)

```typescript
// ALP Token 是 eCash 原生 Token 协议
// 使用 chronik-client 的 tokenId() 端点

// 获取 ALP Token UTXO
const utxos = await chronik.tokenId('token_id').utxos();

// 获取 ALP 交易历史
const txs = await chronik.tokenId('token_id').history(0, 50);
```

---

## 代码示例

### 实时交易监听器

```typescript
import { ChronikClient } from 'chronik-client';

class TransactionMonitor {
  private chronik: ChronikClient;
  private ws: any;
  private handlers: Map<string, (tx: any) => void>;

  constructor(endpoints: string[]) {
    this.chronik = new ChronikClient(endpoints);
    this.handlers = new Map();
  }

  async start() {
    this.ws = this.chronik.ws({
      onMessage: (msg) => this.handleMessage(msg),
      onReconnect: () => console.log('Chronik reconnecting...'),
      autoReconnect: true,
      keepAlive: true,
    });

    await this.ws.waitForOpen();
    console.log('Connected to Chronik');
  }

  subscribeToAddress(address: string, handler: (tx: any) => void) {
    this.handlers.set(address, handler);
    this.ws.subscribeToAddress(address);
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'TX_ADDED_TO_MEMPOOL':
        this.notifyHandlers(msg.txData, 'mempool');
        break;
      case 'TX_CONFIRMED':
        this.notifyHandlers(msg.txData, 'confirmed');
        break;
      case 'BLK_CONNECTED':
        console.log(`Block ${msg.blockHash} connected`);
        break;
    }
  }

  private notifyHandlers(txData: any, source: string) {
    for (const output of txData.outputs) {
      const handler = this.handlers.get(output.address);
      if (handler) {
        handler({ ...txData, source });
      }
    }
  }
}
```

### 区块扫描器

```typescript
async function scanBlocks(
  chronik: ChronikClient,
  startHeight: number,
  endHeight: number,
  callback: (block: any, txs: any[]) => void
) {
  for (let height = startHeight; height <= endHeight; height++) {
    const blockTxs = await chronik.blockTxs(height, 0, 100);

    for (const txid of blockTxs.txHistory) {
      const tx = await chronik.tx(txid);
      callback({ height }, [tx]);
    }

    console.log(`Scanned block ${height}`);
  }
}

// 使用
await scanBlocks(chronik, 800000, 800100, (block, txs) => {
  console.log(`Block ${block.height}: ${txs.length} transactions`);
});
```

---

## 故障排除

### 常见问题

**Q: WebSocket 断开频繁**
- 确保设置 `keepAlive: true`
- 检查网络连接稳定性
- 考虑使用多个 Chronik 节点

**Q: 交易查询返回 404**
- 交易可能还未被索引
- 交易可能在 invalid 分支上
- 检查 txid 是否正确

**Q: Token 状态异常**
- 检查 Token 是否遵循正确的协议 (SLP/ALP)
- Token 可能已被燃烧或销毁

**Q: 区块数据不完整**
- 节点可能还在同步中
- 使用 `/blockchain-info` 检查同步状态

### 调试检查清单

```typescript
// 1. 检查 Chronik 连接
const info = await chronik.chronikInfo();
console.log('Chronik version:', info.version);

// 2. 检查区块链同步状态
const chainInfo = await chronik.blockchainInfo();
console.log('Tip height:', chainInfo.tipHeight);
console.log('Synced:', chainInfo.synced);

// 3. 检查交易是否存在
try {
  const tx = await chronik.tx(txid);
} catch (e) {
  if (e.message.includes('Not Found')) {
    console.log('Tx not found or not indexed');
  }
}
```

### 推荐的 Chronik 节点

- `https://chronik.be.cash/xec` - Bitcoin.com 维护
- `http://localhost:8331` - 本地 Bitcoin ABC 节点

### 性能优化

```typescript
// 批量获取减少请求
const blockTxs = await chronik.blockTxs(height, 0, 1000);

// 使用 WebSocket 而非轮询
ws.subscribeToAddress(address); // 实时通知

// 限制分页大小避免超时
const history = await chronik.address(addr).history(0, 100); // 而非 1000
```
