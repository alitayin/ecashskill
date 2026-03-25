---
name: mock-chronik-client
description: Testing utility that mocks Chronik indexer client for unit tests
version: 3.1.1
tags: [testing, mock, chronik, unit-test, websocket]
---

# mock-chronik-client

Chronik 客户端的测试模拟库，用于在单元测试中模拟区块链状态和 API 响应。

## 概述

mock-chronik-client 提供：
- 完整的 Chronik API 模拟
- WebSocket 订阅模拟
- 区块链状态模拟（区块、交易、UTXO）
- 错误模拟（测试错误处理）
- Agora 市场模拟

**npm**: `mock-chronik-client`
**版本**: 3.1.1
**官方仓库**: github.com/Bitcoin-ABC/bitcoin-abc (modules/mock-chronik-client)
**依赖**: chronik-client, ecashaddrjs, ws

---

## Claude Code 使用指南

### 安装

```bash
npm install --save-dev mock-chronik-client
```

### 基础用法

```typescript
import { MockChronikClient } from 'mock-chronik-client';

const mockChronik = new MockChronikClient();

// 设置模拟数据
mockChronik.setChronikInfo({ version: '1.0.0' });
mockChronik.setBlockchainInfo({ tipHeight: 800000 });
```

### 模拟交易和 UTXO

```typescript
const txid = '0f3c3908a2ddec8dea91d2fe1f77295bbbb158af869bff345d44ae800f0a5498';
const address = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

// 设置交易
mockChronik.setTx(txid, {
  version: 2,
  inputs: [...],
  outputs: [...],
  lockTime: 0,
});

// 设置 UTXO
mockChronik.setUtxosByAddress(address, [
  {
    outpoint: { txid, outIdx: 0 },
    sats: 100000n,
    script: '76a914...',
    blockHeight: 800000,
  },
]);

// 查询模拟数据
const utxos = await mockChronik.address(address).utxos();
```

### 模拟广播交易

```typescript
mockChronik.setBroadcastTx(rawTx, expectedTxid);

const { txid } = await mockChronik.broadcastTx(rawTx);
console.log(txid === expectedTxid); // true
```

### 模拟 WebSocket

```typescript
const ws = mockChronik.ws({
  onMessage: (msg) => console.log('Message:', msg),
});

await ws.waitForOpen();

ws.subscribeToBlocks();
ws.subscribeToAddress('ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v');
ws.subscribeToTokenId('token_id_here');

// 取消订阅
ws.unsubscribeFromBlocks();
```

### 模拟错误

```typescript
const error = new Error('Transaction not found');

mockChronik.setTx(txid, error);

// 测试错误处理
try {
  await mockChronik.tx(txid);
} catch (e) {
  console.log(e.message); // 'Transaction not found'
}
```

### 模拟 Agora

```typescript
import { MockAgora } from 'mock-chronik-client';

const mockAgora = new MockAgora();

// 设置模拟报价
mockAgora.setOfferedGroupTokenIds(['tokenId1', 'tokenId2']);
mockAgora.setActiveOffersByPubKey(pubkeyHex, offers);
mockAgora.setActiveOffersByTokenId(tokenId, offers);
```

### 提示词模板

```
我需要为 chronik-client 编写单元测试

我需要模拟一个交易的返回结果

我需要测试 WebSocket 订阅功能

我需要模拟区块链错误场景

我需要测试钱包余额查询
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# mock-chronik-client 配置
- name: "mock-chronik-client"
  description: "Chronik 测试模拟库"
  files:
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/__tests__/**"
  rules:
    - type: "import"
      statement: |
        import { MockChronikClient } from 'mock-chronik-client';
        import { MockAgora } from 'mock-chronik-client';

    - type: "setup"
      statement: |
        // 测试前设置模拟
        beforeEach(() => {
          mockChronik = new MockChronikClient();
          mockChronik.setChronikInfo({ version: '1.0.0' });
          mockChronik.setBlockchainInfo({ tipHeight: 800000 });
        });

    - type: "mock-data"
      statement: |
        // 模拟常用数据
        mockChronik.setTx(txid, mockTransaction);
        mockChronik.setUtxosByAddress(address, [mockUtxo]);
        mockChronik.setToken(tokenId, mockTokenInfo);

    - type: "error-mock"
      statement: |
        // 模拟错误
        mockChronik.setTx(txid, new Error('Not found'));
        await expect(chronik.tx(txid)).rejects.toThrow('Not found');

    - type: "teardown"
      statement: |
        // 测试后清理
        afterEach(() => {
          mockChronik = null;
        });
```

### AI 角色设定

```
当你使用 mock-chronik-client 编写测试时：

1. 在 beforeEach 中创建新的 MockChronikClient 实例
2. 使用 setTx, setUtxosByAddress 等方法设置模拟数据
3. 可以模拟任何错误场景
4. WebSocket 方法与真实 chronik-client 相同
5. 包含 MockAgora 用于测试 Agora 报价
```

---

## API 参考

### MockChronikClient

#### 初始化

```typescript
const mockChronik = new MockChronikClient();
```

#### 区块链信息

| 方法 | 描述 |
|------|------|
| `setChronikInfo(info)` | 设置 Chronik 版本信息 |
| `setBlockchainInfo(info)` | 设置区块链状态 |

#### 交易

| 方法 | 描述 |
|------|------|
| `setTx(txid, tx)` | 设置交易数据或错误 |
| `setBroadcastTx(rawTx, txid)` | 设置广播结果 |
| `setRawTx(txid, rawHex)` | 设置原始交易 |
| `setToken(tokenId, token)` | 设置 Token 信息 |

#### 地址/脚本

| 方法 | 描述 |
|------|------|
| `setUtxosByAddress(addr, utxos)` | 设置地址 UTXO |
| `setTxHistoryByAddress(addr, txs)` | 设置地址交易历史 |
| `setUtxosByScript(type, hash, utxos)` | 设置脚本 UTXO |
| `setTxHistoryByScript(type, hash, txs)` | 设置脚本交易历史 |

#### Token

| 方法 | 描述 |
|------|------|
| `setUtxosByTokenId(tokenId, utxos)` | 设置 Token UTXO |
| `setTxHistoryByTokenId(tokenId, txs)` | 设置 Token 交易历史 |

#### LokadId

| 方法 | 描述 |
|------|------|
| `setTxHistoryByLokadId(lokadId, txs)` | 设置 LokadId 交易历史 |

#### 区块

| 方法 | 描述 |
|------|------|
| `setBlock(hashOrHeight, block)` | 设置区块数据 |

#### WebSocket

```typescript
const ws = mockChronik.ws({ onMessage: handler });

ws.subscribeToBlocks();
ws.unsubscribeFromBlocks();
ws.subscribeToTxs();
ws.subscribeToScript(type, payload);
ws.subscribeToAddress(address);
ws.subscribeToTokenId(tokenId);
ws.subscribeToLokadId(lokadId);
ws.subscribeToPlugin(pluginName, groupHex);
```

### MockAgora

```typescript
const mockAgora = new MockAgora();

mockAgora.setOfferedGroupTokenIds(ids);
mockAgora.setOfferedFungibleTokenIds(ids);
mockAgora.setActiveOffersByTokenId(tokenId, offers);
mockAgora.setActiveOffersByGroupTokenId(groupId, offers);
mockAgora.setActiveOffersByPubKey(pubkey, offers);
mockAgora.setHistoricOffers(params, result);
```

---

## 代码示例

### 完整测试示例

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockChronikClient } from 'mock-chronik-client';
import { Wallet } from 'ecash-wallet';

describe('Wallet Balance Tests', () => {
  let mockChronik;
  let wallet;
  const testMnemonic = 'morning average minor stable parrot refuse credit exercise february mirror just begin';
  const testAddress = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

  beforeEach(() => {
    mockChronik = new MockChronikClient();

    // 设置区块链状态
    mockChronik.setChronikInfo({ version: '1.0.0' });
    mockChronik.setBlockchainInfo({ tipHeight: 800000 });

    // 设置 UTXO
    mockChronik.setUtxosByAddress(testAddress, [
      {
        outpoint: {
          txid: '0'.repeat(64),
          outIdx: 0,
        },
        sats: 1000000n,
        script: new Uint8Array([118, 169, 20, ...]), // P2PKH script
        blockHeight: 799000,
      },
    ]);
  });

  afterEach(() => {
    mockChronik = null;
  });

  it('should sync wallet balance', async () => {
    const wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();

    expect(wallet.balanceSats).toBe(1000000n);
  });

  it('should return empty balance for new address', async () => {
    mockChronik.setUtxosByAddress(newAddress, []);
    const wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();

    expect(wallet.balanceSats).toBe(0n);
  });
});
```

### WebSocket 测试

```typescript
describe('WebSocket Subscriptions', () => {
  let mockChronik;
  let messages: any[];

  beforeEach(() => {
    mockChronik = new MockChronikClient();
    messages = [];
  });

  it('should receive block notifications', async () => {
    const ws = mockChronik.ws({
      onMessage: (msg) => messages.push(msg),
    });

    await ws.waitForOpen();
    ws.subscribeToBlocks();

    // 模拟新区块
    ws.simulateBlockConnected({
      hash: '00'.repeat(32),
      height: 800001,
    });

    expect(messages).toContainEqual(
      expect.objectContaining({
        type: 'BLK_CONNECTED',
      })
    );
  });

  it('should receive address notifications', async () => {
    const testAddress = 'ecash:qp2yfmz9zg0vy9hdn0uerxm6t9wfxty8jv4fyqmg8v';

    const ws = mockChronik.ws({
      onMessage: (msg) => messages.push(msg),
    });

    await ws.waitForOpen();
    ws.subscribeToAddress(testAddress);

    // 模拟交易
    ws.simulateTxAddedToMempool({
      txid: '11'.repeat(32),
      outputs: [{ address: testAddress, sats: 50000 }],
    });

    expect(messages).toContainEqual(
      expect.objectContaining({
        type: 'TX_ADDED_TO_MEMPOOL',
      })
    );
  });
});
```

### 错误处理测试

```typescript
describe('Error Handling', () => {
  let mockChronik;

  beforeEach(() => {
    mockChronik = new MockChronikClient();
  });

  it('should simulate not found error', async () => {
    mockChronik.setTx('nonexistent_txid', new Error('Transaction not found'));

    await expect(mockChronik.tx('nonexistent_txid')).rejects.toThrow(
      'Transaction not found'
    );
  });

  it('should simulate network error', async () => {
    mockChronik.setBroadcastTx(rawTx, new Error('Network timeout'));

    await expect(mockChronik.broadcastTx(rawTx)).rejects.toThrow(
      'Network timeout'
    );
  });

  it('should simulate insufficient funds', async () => {
    // 在实际测试中验证钱包逻辑
    const wallet = Wallet.fromMnemonic(mnemonic, mockChronik);
    await wallet.sync();

    // 模拟余额为 0
    mockChronik.setUtxosByAddress(wallet.address, []);

    await expect(wallet.send(recipient, 1000n)).rejects.toThrow(
      'Insufficient funds'
    );
  });
});
```

### 集成测试示例

```typescript
describe('Send Transaction Integration', () => {
  let mockChronik;
  let wallet;
  const recipient = 'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0';

  beforeEach(async () => {
    mockChronik = new MockChronikClient();
    mockChronik.setChronikInfo({ version: '1.0.0' });
    mockChronik.setBlockchainInfo({ tipHeight: 800000 });

    // 设置有余额的 UTXO
    const { utxo, txid } = await createMockUtxo(mockChronik, {
      sats: 1000000n,
    });

    wallet = Wallet.fromMnemonic(testMnemonic, mockChronik);
    await wallet.sync();
  });

  it('should send XEC successfully', async () => {
    const sendAmount = 500000n;
    const originalBalance = wallet.balanceSats;

    const { hex } = await wallet.send(recipient, sendAmount);

    // 验证广播被调用
    mockChronik.setBroadcastTx(hex, 'mock_txid');
    const result = await wallet.broadcast(hex);

    // 重新同步后余额应该减少
    await wallet.sync();
    expect(wallet.balanceSats).toBeLessThan(originalBalance);
  });
});
```

---

## 故障排除

### 常见问题

**Q: 模拟数据不生效**
- 确认在查询前调用了 set* 方法
- 检查地址格式是否正确
- 确认使用了正确的 set 方法（byAddress vs byScript）

**Q: WebSocket 消息不触发**
- 确保调用了 waitForOpen()
- 检查是否正确订阅（subscribeTo*）
- 确认 onMessage 回调正确设置

**Q: 错误模拟不工作**
- 确保错误是 Error 实例
- 检查错误设置在正确的 txid 上

**Q: 多个测试间数据污染**
- 在 beforeEach 中创建新实例
- 在 afterEach 中清理

### 最佳实践

```typescript
// 1. 每个测试创建新实例
beforeEach(() => {
  mockChronik = new MockChronikClient();
});

// 2. 设置基础状态
mockChronik.setChronikInfo({ version: '1.0.0' });
mockChronik.setBlockchainInfo({ tipHeight: 800000 });

// 3. 使用工厂函数创建复杂模拟数据
function createMockTx(overrides = {}) {
  return {
    version: 2,
    inputs: [],
    outputs: [],
    lockTime: 0,
    ...overrides,
  };
}

// 4. 清理
afterEach(() => {
  mockChronik = null;
});
```

### 调试技巧

```typescript
// 开启调试日志
const mockChronik = new MockChronikClient({
  debug: true,
});

// 查看所有调用的方法
mockChronik.onCall((method, args) => {
  console.log(method, args);
});

// 验证方法调用
expect(mockChronik.tx).toHaveBeenCalledWith(txid);
```
