---
name: ecash-lib
description: Bitcoin ABC official library for building and signing eCash transactions
version: 4.11.0
tags: [ecash-lib, transaction, signing, script, crypto]
---

# ecash-lib

Bitcoin ABC 官方 JavaScript/TypeScript 库，用于构建和签名 eCash 交易。

## 概述

ecash-lib 是 eCash 开发的核心库，提供：
- 交易构建（TxBuilder）和签名
- 脚本创建（P2PKH、P2SH、多签等）
- 椭圆曲线密码学（ECDSA、Schnorr）
- SLP/ALP Token 支持
- HD 钱包和助记词
- PSBT 部分签名交易
- WASM 加速性能

**npm**: `ecash-lib`
**版本**: 4.11.0
**仓库**: github.com/Bitcoin-ABC/bitcoin-abc

---

## Claude Code 使用指南

### 安装

```bash
npm install ecash-lib
```

### 核心概念

```typescript
import {
  Ecc,              // 椭圆曲线密码学
  Script,           // 脚本创建
  TxBuilder,        // 交易构建
  Tx,               // 已签名交易
  P2PKHSignatory,   // P2PKH 签名者
  Address,          // 地址处理
  fromHex,          // 十六进制转 Uint8Array
  toHex,            // Uint8Array 转十六进制
  shaRmd160,        // Hash160
  sha256,           // SHA256
  hash256,          // SHA256d (double)
  ALL_BIP143,       // BIP143 签名哈希模式
} from 'ecash-lib';
```

### 构建基本交易

```typescript
import {
  Ecc,
  P2PKHSignatory,
  Script,
  TxBuilder,
  fromHex,
  shaRmd160,
  toHex,
  ALL_BIP143,
} from 'ecash-lib';

const ecc = new Ecc();

// 1. 准备密钥
const walletSk = fromHex('e6ae1669c47d092eff3eb652bea535331c338e29f34be709bc4055655cd0e950');
const walletPk = ecc.derivePubkey(walletSk);
const walletPkh = shaRmd160(walletPk);

// 2. 创建 P2PKH 脚本
const walletP2pkh = Script.p2pkh(walletPkh);

// 3. 准备 UTXO
const walletUtxo = {
  txid: '0000000000000000000000000000000000000000000000000000000000000000',
  outIdx: 0,
};

// 4. 构建交易
const txBuild = new TxBuilder({
  inputs: [
    {
      input: {
        prevOut: walletUtxo,
        signData: {
          sats: 1000n,           // UTXO 金额（satoshi）
          outputScript: walletP2pkh,
        },
      },
      signatory: P2PKHSignatory(walletSk, walletPk, ALL_BIP143),
    },
  ],
  outputs: [
    { sats: 500n, script: walletP2pkh },  // 转账
    { sats: 0n, script: walletP2pkh },   // 找零（sats=0 由库自动计算）
  ],
});

// 5. 签名
const tx = txBuild.sign({ feePerKb: 1000n, dustSats: 546n });
const rawTx = tx.ser();
console.log('Raw TX:', toHex(rawTx));
console.log('TXID:', tx.txid());
```

### 脚本创建

```typescript
import { Script } from 'ecash-lib';

// P2PKH 脚本
const pkh = fromHex('1181600f8a4f3f3f4f5f6f7f8f9fafbfcfdfeff');
const p2pkhScript = Script.p2pkh(pkh);

// P2SH 脚本
const scriptHash = fromHex('1181600f8a4f3f3f4f5f6f7f8f9fafbfcfdfeff');
const p2shScript = Script.p2sh(scriptHash);

// 从地址创建脚本
const scriptFromAddr = Script.fromAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');

// 多签脚本
const pubkeys = [pubkey1, pubkey2, pubkey3];
const multisigScript = Script.multisig(pubkeys, 2, false); // 2-of-3

// OP_RETURN 输出
const opReturnScript = new Script(fromHex('6a68656c6c6f')); // "hello" as OP_RETURN
```

### 使用 WebSocket + Chronik 监听并花费 UTXO

```typescript
import { ChronikClient, ConnectionStrategy } from 'chronik-client';
import { Ecc, P2PKHSignatory, Script, TxBuilder, shaRmd160, ALL_BIP143, fromHex } from 'ecash-lib';

const ecc = new Ecc();
const seckey = fromHex('your_private_key_hex');
const pubkey = ecc.derivePubkey(seckey);
const pkh = shaRmd160(pubkey);
const p2pkhScript = Script.p2pkh(pkh);

// 连接 Chronik
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);

// 监听地址
const ws = chronik.ws({
  onMessage: async (msg) => {
    if (msg.type === 'TX_ADDED_TO_MEMPOOL') {
      const { txid } = msg.txData;
      const tx = await chronik.tx(txid);

      // 查找支付给我们的输出
      for (const output of tx.outputs) {
        if (output.script === toHex(p2pkhScript.bytecode)) {
          console.log('收到付款!', output.satoshis, 'sats');

          // 构建花费交易
          const txBuilder = new TxBuilder({
            inputs: [{
              input: {
                prevOut: { txid, outIdx: output.outputIndex },
                signData: {
                  sats: BigInt(output.satoshis),
                  outputScript: p2pkhScript,
                },
              },
              signatory: P2PKHSignatory(seckey, pubkey, ALL_BIP143),
            }],
            outputs: [{ sats: BigInt(output.satoshis - 200n), script: p2pkhScript }],
          });

          const signedTx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
          await chronik.broadcastTx(toHex(signedTx.ser()));
        }
      }
    }
  },
});

await ws.waitForOpen();
ws.subscribeToAddress('ecash:' + toHex(pkh));
```

### 提示词模板

```
我需要构建一个发送 XEC 的交易

我需要创建一个 P2PKH 脚本

我需要从私钥派生公钥和地址

我需要实现一个钱包监听器来自动确认收到的付款

我需要创建和签署一个多签交易
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# ecash-lib 配置
- name: "ecash-lib"
  description: "eCash 交易构建和签名库"
  files:
    - "**/*wallet*"
    - "**/*tx*"
    - "**/*sign*"
    - "**/*ecash*"
  rules:
    - type: "import"
      statement: |
        import {
          Ecc,
          P2PKHSignatory,
          Script,
          TxBuilder,
          Tx,
          Address,
          fromHex,
          toHex,
          shaRmd160,
          sha256,
          hash256,
          ALL_BIP143,
          SINGLE_BIP143,
          NONE_BIP143,
        } from 'ecash-lib';

    - type: "best-practice"
      statement: |
        // 使用 BIP143 签名（eCash 推荐）
        // ALL_BIP143 = SIGHASH_ALL | SIGHASH_BIP143
        // SINGLE_BIP143 = SIGHASH_SINGLE | SIGHASH_BIP143
        // NONE_BIP143 = SIGHASH_NONE | SIGHASH_BIP143

    - type: "bigint"
      statement: |
        // 注意: eCash 使用 bigint 处理 satoshi 金额
        // 使用 BigInt() 字面量: 1000n, 546n
        // 不要使用 Number() 会有精度问题

    - type: "error-handling"
      statement: |
        // 签名错误处理
        try {
          const tx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
        } catch (error) {
          if (error.message.includes('Insufficient funds')) {
            throw new Error('余额不足，无法支付手续费');
          }
          throw error;
        }

    - type: "key-management"
      statement: |
        // 私钥处理最佳实践
        // 1. 永远不要在代码中硬编码私钥
        // 2. 使用环境变量或密钥管理服务
        // 3. 在测试环境使用 mock 私钥
```

### AI 角色设定

```
当你编写涉及 ecash-lib 的代码时：

1. 金额使用 BigInt (n 后缀)，如 1000n satoshis
2. 签名总是使用 BIP143 (ALL_BIP143)
3. 导入使用具名导出: import { Ecc, Script } from 'ecash-lib'
4. 私钥永远不要硬编码，使用环境变量
5. TxBuilder.sign() 返回 Tx 对象，调用 .ser() 获取原始交易
6. Script.bytecode 是 Uint8Array，使用 toHex() 转换
7. 建议配合 chronik-client 使用，监听 UTXO 变化
```

---

## API 参考

### Ecc

椭圆曲线密码学类。

| 方法 | 描述 |
|------|------|
| `derivePubkey(seckey)` | 从私钥派生公钥 |
| `ecdsaSign(seckey, msg)` | ECDSA 签名 |
| `ecdsaVerify(sig, msg, pk)` | ECDSA 验证 |
| `schnorrSign(seckey, msg)` | Schnorr 签名（eCash 默认） |
| `schnorrVerify(sig, msg, pk)` | Schnorr 验证 |
| `isValidSeckey(seckey)` | 验证私钥 |
| `compressPk(pk)` | 压缩公钥 |
| `signRecoverable(seckey, msg)` | 可恢复签名（用于消息签名） |
| `recoverSig(sig, msg)` | 恢复可恢复签名 |

### TxBuilder

交易构建器。

| 方法/属性 | 描述 |
|----------|------|
| `constructor(params)` | 创建构建器 |
| `inputs` | 输入数组 |
| `outputs` | 输出数组 |
| `sign(params?)` | 签名并返回 Tx |
| `static fromTx(tx)` | 从已签名交易创建（用于追加签名） |

**sign() 参数**:
- `feePerKb`: 费率 (bigint)
- `dustSats`: 最小输出金额
- `ecc`: Ecc 实例（可选）
- `changeScript`: 找零脚本（可选）

### Tx

已签名的交易。

| 方法 | 描述 |
|------|------|
| `ser()` | 序列化为 Uint8Array |
| `serSize()` | 序列化后大小 |
| `toHex()` | 序列化为 hex 字符串 |
| `txid()` | 获取交易 ID |
| `version` | 交易版本 |
| `inputs` | 输入数组 |
| `outputs` | 输出数组 |
| `locktime` | 锁定时间 |

### Script

脚本创建和操作。

| 静态方法 | 描述 |
|---------|------|
| `p2pkh(pkh)` | 创建 P2PKH 脚本 |
| `p2sh(scriptHash)` | 创建 P2SH 脚本 |
| `multisig(pubkeys, threshold, isP2sh)` | 创建多签脚本 |
| `fromAddress(address)` | 从地址创建脚本 |
| `fromOps(ops)` | 从 OP 代码创建脚本 |
| `instance method` | `isP2pkh()`, `isP2sh()`, `isOpReturn()` |

### P2PKHSignatory(seckey, pubkey, sigHashType)

创建 P2PKH 签名者。

### Signatory 类型

| 类型 | 用途 |
|------|------|
| `P2PKHSignatory(sk, pk, hashType)` | P2PKH 签名 |
| `P2PKSignatory(sk, hashType)` | P2PK 签名（不推荐） |

### SigHashType

| 常量 | 描述 |
|------|------|
| `ALL_BIP143` | 所有输入，BIP143（推荐） |
| `SINGLE_BIP143` | 单个输入匹配，BIP143 |
| `NONE_BIP143` | 无输入锁定，BIP143 |

### 地址操作

```typescript
import { Address } from 'ecash-lib';

// 解析 CashAddr
const addr = Address.fromCashAddress('ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d');
console.log(addr.prefix);  // 'ecash'
console.log(addr.type);    // 'P2PKH'
console.log(addr.hash);    // Uint8Array

// 解析 Legacy 地址
const legacyAddr = Address.fromLegacyAddress('1BoSBLqB8X5mVrWyaCuB7JuE5KK9SsJf9z');

// 更改前缀
const bchAddr = addr.withPrefix('bitcoincash');
```

### 哈希函数

```typescript
import { shaRmd160, sha256, hash256 } from 'ecash-lib';

const hash160 = shaRmd160(pubkey);  // RIPEMD160(SHA256(x))
const hash256x = sha256(data);     // SHA256
const doubleHash = hash256(data);   // SHA256(SHA256(x)) - 用于签名
```

### 实用函数

```typescript
import { fromHex, toHex } from 'ecash-lib';

// 十六进制转换
const bytes = fromHex('deadbeef');  // Uint8Array
const hex = toHex(bytes);           // string

// 其他
import { randomBytes } from 'ecash-lib';
const randomKey = randomBytes(32);  // 生成随机字节
```

---

## 代码示例

### HD 钱包支持

```typescript
import {
  Ecc,
  HdNode,
  entropyToMnemonic,
  mnemonicToSeed,
  toHex,
  fromHex,
} from 'ecash-lib';

const ecc = new Ecc();

// 从助记词派生
const mnemonic = entropyToMnemonic(crypto.getRandomValues(new Uint8Array(16)));
console.log('Mnemonic:', mnemonic);

const seed = mnemonicToSeed(mnemonic);
const root = HdNode.fromSeed(seed);

// 派生路径 m/44'/0'/0'/0/0
const child = root.derive(44 + 0x80000000)
  .derive(0 + 0x80000000)
  .derive(0 + 0x80000000)
  .derive(0)
  .derive(0);

const seckey = child.privateKey!;
const pubkey = ecc.derivePubkey(seckey);
console.log('Address:', child.address);
```

### SLP Token 转账

```typescript
import {
  Ecc,
  Script,
  TxBuilder,
  P2PKHSignatory,
  fromHex,
  shaRmd160,
  toHex,
  ALL_BIP143,
} from 'ecash-lib';
import { ALPH_TOKEN_TYPE_STANDARD } from 'ecash-lib/dist/token/alp';

const tokenId = fromHex('token_id_here');
const tokenReceiver = 'ecash:qpadrekpz6gjd8w0zfedmtqyld0r2j4qmuthccqd8d';
const amount = 1000n;

// 创建 ALP 输出
const alpOutput = Script.alpMintableOutput(
  tokenId,
  amount,
  ALPH_TOKEN_TYPE_STANDARD,
  receiverScript.bytecode
);

// 在交易中使用
const txBuild = new TxBuilder({
  inputs: [...],
  outputs: [
    { sats: 0n, script: alpOutput },
    { sats: 0n, script: receiverScript },
  ],
});
```

### PSBT (Partially Signed Transaction)

```typescript
import { Psbt, PsbtBuilder, Script } from 'ecash-lib';

// 创建 PSBT
const psbtBuilder = new PsbtBuilder({ ... });
const psbt = psbtBuilder.toPsbt();

// 添加签名
psbt.sign(0, signatory);

// 验证并提取
const tx = psbt.finalizeAll().extractTx();
```

---

## 故障排除

### 常见问题

**Q: 签名失败 "Invalid signature"**
- 确保使用 ALL_BIP143 而非简单的 SIGHASH_ALL
- 检查公钥和私钥是否匹配
- 验证 signData.sats 金额是否正确

**Q: 交易广播失败 "dust"**
- 增加输出金额到 dustSats (546 sats) 以上
- 或减少手续费

**Q: "Insufficient funds"**
- UTXO 总额不够支付 金额 + 手续费
- 需要合并多个 UTXO 或降低金额

**Q: TypeScript 找不到类型**
- ecash-lib 内置 TypeScript 类型定义
- 确保使用 `./dist/indexNodeJs.d.ts` 入口

**Q: bigint 精度问题**
- 使用 BigInt 字面量 (1000n)
- 不要转换为 Number 再转回
- 序列化时保持 BigInt

### 调试技巧

```typescript
// 查看交易详情
const tx = txBuild.sign({ feePerKb: 1000n, debug: true });
console.log(tx.inspect()); // 详细调试信息

// 计算手续费
const estimatedSize = txBuild.estimateSize();
const fee = estimatedSize * feePerKb / 1000n;

// 验证签名
const valid = ecc.ecdsaVerify(sig, sighash, pubkey);
```

### 与 chronik-client 配合

```typescript
// 推荐的工作流程
1. 使用 chronik-client 监听地址
2. 收到通知后获取 UTXO 详情
3. 使用 ecash-lib 构建交易
4. 使用 chronik-client.broadcastTx() 广播
5. 使用 chronik-client.broadcastAndFinalizeTx() 等待确认
```
