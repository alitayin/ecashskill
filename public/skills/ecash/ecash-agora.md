---
name: ecash-agora
description: Non-custodial exchange (NEX) protocol for eCash tokens
version: 4.0.0
tags: [agora, dex, exchange, token, marketplace, covenant]
---

# ecash-agora

eCash Agora 协议库，实现非托管交易所（Non-Custodial Exchange, NEX）功能。

## 概述

Agora 是 eCash 上的去中心化交易协议：
- 使用 Bitcoin Script covenant 实现原子交易
- 支持 SLP/ALP Token 交易
- 无需智能合约或资金池
- P2P 直接交易
- 支持 NFT (Oneshot) 和同质化 Token (Partial)

**npm**: `ecash-agora`
**版本**: 4.0.0
**官方仓库**: github.com/Bitcoin-ABC/bitcoin-abc (modules/ecash-agora)
**依赖**: chronik-client, ecash-lib, ecash-wallet

---

## Claude Code 使用指南

### 安装

```bash
npm install ecash-agora
```

### 核心概念

**Oneshot** - 一次性报价（用于 NFT）
- 卖方设置固定价格
- 买家要么接受全部，要么不接受

**Partial** - 部分报价（用于同质化 Token）
- 卖方设置价格和最小/最大数量
- 买家可以购买部分数量
- 剩余数量自动重新锁定

### 查询市场

```typescript
import { Agora } from 'ecash-agora';
import { ChronikClient } from 'chronik-client';

const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
const agora = new Agora(chronik);

// 获取所有可交易的 Token ID
const tokenIds = await agora.allOfferedTokenIds();

// 获取某 Token 的活跃报价
const offers = await agora.activeOffersByTokenId('token_id_here');

// 获取某 Token 组的报价 (SLP NFT)
const groupOffers = await agora.activeOffersByGroupTokenId('group_token_id');
```

### 接受报价

```typescript
// 从报价获取详细信息
const offer = offers[0];
const { AgoraOffer } = offer;

// 计算购买指定数量需要支付的 XEC
const satsCost = offer.askedSats(50000n); // 购买 50000 atoms 的价格

// 创建接受交易
const acceptTx = offer.acceptTx({
  covenantSk: buyerPrivateKey,
  covenantPk: buyerPublicKey,
  fuelInputs: [...],  // 用于支付手续费的 UTXO
  recipientScript: buyerP2pkhScript,
  acceptedAtoms: 50000n,
});

// 广播
await chronik.broadcastTx(acceptTx.ser());
```

### 创建报价 (卖方)

```typescript
import { AgoraPartial, AgoraOneshot } from 'ecash-agora';
import { Wallet } from 'ecash-wallet';

// 创建 Partial 报价 (同质化 Token)
const partial = AgoraPartial.approximateParams({
  offeredAtoms: 1000000n,      // 提供数量
  priceNanoSatsPerAtom: 2000n, // 每 atom 价格 (nano sats)
  minAcceptedAtoms: 1000n,     // 最小接受数量
  tokenId: 'token_id',
  tokenType: 'SLP_TOKEN_TYPE_FUNGIBLE',
  tokenProtocol: 'SLP',
});

// 通过钱包上架
await partial.list({ wallet: sellerWallet });

// 创建 Oneshot 报价 (NFT)
const oneshot = new AgoraOneshot({
  enforcedOutputs: [
    { sats: 0n, script: slpSend(tokenId, SLP_NFT1_CHILD, [0n, 1n]) },
    { sats: 80000n, script: sellerP2pkhScript },
  ],
  cancelPk: sellerCancelPublicKey,
});

await oneshot.list({ wallet: sellerWallet });
```

### 取消报价

```typescript
// 取消单个报价
const cancelTx = offer.cancelTx({
  cancelSk: sellerCancelPrivateKey,
  fuelInputs: [...],
  recipientScript: sellerP2pkhScript,
});

await chronik.broadcastTx(cancelTx.ser());

// 或通过钱包
await offer.cancel({ wallet: sellerWallet });
```

### WebSocket 订阅

```typescript
const ws = chronik.ws({
  onMessage: (msg) => console.log(msg),
  autoReconnect: true,
});

await ws.waitForOpen();

// 订阅特定 Token 的报价
agora.subscribeWs(ws, { tokenId: 'token_id' });

// 订阅特定地址的报价
agora.subscribeWs(ws, { pubKey: 'maker_public_key_hex' });
```

### 提示词模板

```
我需要查询某 Token 的所有活跃报价

我需要创建一个 NFT 出售报价

我需要创建一个同质化 Token 出售报价

我需要接受一个 Agora 报价

我需要取消我创建的报价

我需要监听新报价通知
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# ecash-agora 配置
- name: "ecash-agora"
  description: "eCash Agora 去中心化交易协议"
  files:
    - "**/*agora*"
    - "**/*exchange*"
    - "**/*marketplace*"
  rules:
    - type: "import"
      statement: |
        import { Agora, AgoraPartial, AgoraOneshot } from 'ecash-agora';
        import { Wallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "oneshot"
      statement: |
        // Oneshot 用于 NFT - 全部或全不
        const oneshot = new AgoraOneshot({
          enforcedOutputs: [...],
          cancelPk: makerCancelPk,
        });

    - type: "partial"
      statement: |
        // Partial 用于同质化 Token - 可部分购买
        const partial = AgoraPartial.approximateParams({
          offeredAtoms: amount,
          priceNanoSatsPerAtom: price,
          minAcceptedAtoms: minAmount,
          tokenId,
          tokenType,
          tokenProtocol: 'SLP' | 'ALP',
        });

    - type: "accept"
      statement: |
        // 接受报价时计算费用
        const satsCost = offer.askedSats(acceptedAtoms);
        const fee = offer.acceptFeeSats({ ... });

    - type: "error-handling"
      statement: |
        // Agora 错误处理
        // - Invalid covenant: 报价已被修改
        // - Offer expired: 报价已过期或被取消
        // - Insufficient funds: 支付 XEC 不足
```

### AI 角色设定

```
当你使用 ecash-agora 时：

1. Oneshot 用于 NFT (全部或全不)
2. Partial 用于同质化 Token (可部分购买)
3. acceptTx 需要提供 fuelInputs 支付手续费
4. 价格单位是 nano sats per atom
5. 取消报价使用 cancelSk，不是 covenantSk
6. 广播前验证交易
```

---

## API 参考

### Agora

主查询类。

```typescript
const agora = new Agora(chronik, dustSats?: bigint);
```

**方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `allOfferedTokenIds()` | Promise<string[]> | 所有有报价的 Token ID |
| `offeredFungibleTokenIds()` | Promise<string[]> | 同质化 Token ID |
| `offeredGroupTokenIds()` | Promise<string[]> | NFT Group Token ID |
| `activeOffersByTokenId(tokenId)` | Promise<AgoraOffer[]> | Token 的活跃报价 |
| `activeOffersByGroupTokenId(groupId)` | Promise<AgoraOffer[]> | Group 的活跃报价 |
| `activeOffersByPubKey(pubkey)` | Promise<AgoraOffer[]> | 特定公钥的报价 |
| `historicOffers(params)` | Promise<AgoraHistoryResult> | 历史报价 |
| `subscribeWs(ws, params)` | void | WebSocket 订阅 |
| `unsubscribeWs(ws, params)` | void | 取消订阅 |

### AgoraOffer

单个报价（由 `activeOffersByTokenId` 返回）。

**方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `acceptTx(params)` | Tx | 创建接受交易 |
| `accept(params)` | Promise<BroadcastResult> | 接受并广播 |
| `acceptFeeSats(params)` | bigint | 接受交易费用 |
| `cancelTx(params)` | Tx | 创建取消交易 |
| `cancel(params)` | Promise<BroadcastResult> | 取消并广播 |
| `cancelFeeSats(params)` | bigint | 取消交易费用 |
| `askedSats(acceptedAtoms?)` | bigint | 指定数量对应的 XEC 价格 |

### AgoraOneshot

用于 NFT 的一次性报价。

```typescript
const oneshot = new AgoraOneshot({
  enforcedOutputs: TxOutput[],
  cancelPk: PublicKey,
});
```

**方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `script()` | Script | 合约脚本 |
| `adScript()` | Script | 广告脚本 |
| `askedSats()` | bigint | 报价 XEC 数量 |
| `list(params)` | Promise<BroadcastResult> | 上架 Token |

### AgoraPartial

用于同质化 Token 的部分报价。

```typescript
const partial = AgoraPartial.approximateParams(params);
```

**方法:**

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `offeredAtoms()` | bigint | 提供数量 |
| `minAcceptedAtoms()` | bigint | 最小接受数量 |
| `askedSats(acceptedAtoms)` | bigint | 指定数量价格 |
| `priceNanoSatsPerAtom()` | bigint | 单价 (nano sats) |
| `list(params)` | Promise<BroadcastResult> | 上架 Token |
| `prepareAcceptedAtoms(acceptedAtoms)` | bigint | 调整数量 |
| `preventUnacceptableRemainder(acceptedAtoms)` | void | 验证余量 |

### 参数类型

```typescript
interface AgoraPartialParams {
  offeredAtoms: bigint;
  priceNanoSatsPerAtom: bigint;
  minAcceptedAtoms: bigint;
  tokenId: string;
  tokenType: number;
  tokenProtocol: 'SLP' | 'ALP';
  makerPk: Uint8Array;
  enforcedLockTime: bigint;
}
```

### Token 类型常量

```typescript
// SLP
SLP_TOKEN_TYPE_NONE = 0
SLP_TOKEN_TYPE_FUNGIBLE = 1
SLP_TOKEN_TYPE_MINT_VAULT = 2
SLP_TOKEN_TYPE_NFT1_GROUP = 0x81
SLP_TOKEN_TYPE_NFT1_CHILD = 0x41

// ALP
ALP_TOKEN_TYPE_STANDARD = 0
```

---

## 工作原理

### Covenant 机制

Agora 使用 Bitcoin Script covenant 强制执行交易规则：

```
OP_HASH160 <makerHash> OP_EQUAL
OP_IF
  // 买家发送 XEC 给卖家
  <buyerPayout>
OP_ELSE
  // 卖家可取消或更新
  <cancelKey> OP_CHECKSIG
OP_ENDIF
```

### Oneshot 流程

```
1. 卖家创建包含 NFT 的 P2SH UTXO
2. 脚本锁定：买家支付 XEC 后获得 NFT
3. 买家创建交易：
   - 输入：锁定 UTXO
   - 输出：XEC 给卖家，NFT 给买家
4. 卖家签名解锁，脚本验证买家输出正确
```

### Partial 流程

```
1. 卖家锁定 1000 atoms，价格 2000 nano sats/atom
2. 买家想购买 500 atoms，支付 1000000 nano sats
3. 交易后：
   - 买家获得 500 atoms
   - 卖家获得 XEC
   - 剩余 500 atoms 重新锁定到新 UTXO
4. 可多次部分成交直到全部卖出
```

---

## 代码示例

### 完整的交易流程

```typescript
import { Agora } from 'ecash-agora';
import { Wallet } from 'ecash-wallet';
import { ChronikClient } from 'chronik-client';
import { toHex } from 'ecash-lib';

async function purchaseToken(
  buyerWallet: Wallet,
  chronik: ChronikClient,
  tokenId: string,
  tokenAmount: bigint
) {
  const agora = new Agora(chronik);

  // 1. 查找合适报价
  const offers = await agora.activeOffersByTokenId(tokenId);
  const suitableOffer = offers.find(o =>
    BigInt(o.minAcceptedAtoms) <= tokenAmount
  );

  if (!suitableOffer) {
    throw new Error('没有合适的报价');
  }

  // 2. 计算价格
  const priceSats = suitableOffer.askedSats(tokenAmount);

  // 3. 确认余额足够
  if (buyerWallet.balanceSats < priceSats) {
    throw new Error('XEC 余额不足');
  }

  // 4. 接受报价
  const result = await suitableOffer.accept({
    wallet: buyerWallet,
    covenantSk: buyerWallet.sk,
    covenantPk: buyerWallet.pk,
    acceptedAtoms: tokenAmount,
  });

  console.log('购买成功:', result.txid);
  return result;
}
```

### 创建 NFT 销售

```typescript
import { AgoraOneshot } from 'ecash-agora';
import { Script } from 'ecash-lib';

async function listNft(
  sellerWallet: Wallet,
  tokenId: string,
  priceSats: bigint
) {
  // 创建 P2PKH 输出给卖家
  const sellerP2pkh = sellerWallet.script;

  // 创建 NFT send 输出
  const nftSendOutput = {
    sats: 0n,
    script: createSlpSendScript(tokenId, 'SLP_NFT1_CHILD', [0n, 1n]),
  };

  // 创建 Oneshot 报价
  const oneshot = new AgoraOneshot({
    enforcedOutputs: [
      nftSendOutput,
      { sats: priceSats, script: sellerP2pkh },
    ],
    cancelPk: sellerWallet.pk,
  });

  // 上架
  const result = await oneshot.list({
    wallet: sellerWallet,
    tokenId,
    tokenType: 0x41, // SLP_NFT1_CHILD
    dustSats: 546n,
    feePerKb: 1000n,
  });

  console.log('NFT 已上架:', result.txid);
}
```

### 监听新报价

```typescript
import { Agora } from 'ecash-agora';

function watchNewOffers(chronik: ChronikClient, tokenId: string) {
  const agora = new Agora(chronik);

  const ws = chronik.ws({
    onMessage: async (msg) => {
      if (msg.type === 'TX_ADDED_TO_MEMPOOL') {
        // 检查是否有新的 Agora 报价
        const offers = await agora.activeOffersByTokenId(tokenId);
        if (offers.length > 0) {
          console.log(`新报价可用! 共 ${offers.length} 个`);
          // 可以通知前端
        }
      }
    },
    autoReconnect: true,
  });

  return ws;
}
```

---

## 故障排除

### 常见问题

**Q: acceptTx 失败 "Invalid covenant"**
- 报价已被修改或取消
- 重新查询最新报价

**Q: 余额足够但交易失败**
- 检查 fuelInputs 是否足够支付手续费
- 确认 sats 金额足够 dustSats

**Q: Partial 报价部分成交失败**
- 检查 minAcceptedAtoms 限制
- 确认余量可接受

**Q: NFT 上架失败**
- 确认 NFT UTXO 可花费
- 检查 tokenId 和 tokenType 是否匹配

**Q: 取消报价失败**
- 确认使用的是 cancelSk，不是 covenantSk
- 检查燃料输入是否足够

### 价格计算

```typescript
// 理解价格单位
// nano sats = 0.000000001 sats
// 1 sats = 1000000000 nano sats

// 示例：2000 nano sats/atom
// 购买 1000000 atoms = 2000000000000 nano sats = 2000 sats

const price = 2000n; // nano sats per atom
const amount = 1000000n; // atoms
const totalSats = (price * amount) / 1000000000n;
```

### 调试清单

```typescript
// 接受报价前的检查
const offer = await agora.activeOffersByTokenId(tokenId);

// 1. 验证报价仍然有效
console.log('Offer still active:', offer.status === 'active');

// 2. 计算准确价格
const price = offer.askedSats(desiredAmount);
console.log('Total price:', price, 'sats');

// 3. 检查燃料费
const acceptFee = offer.acceptFeeSats(params);
console.log('Accept fee:', acceptFee, 'sats');

// 4. 验证钱包余额
console.log('Wallet balance:', wallet.balanceSats);
console.log('Required:', price + acceptFee);
```
