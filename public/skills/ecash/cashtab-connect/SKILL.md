---
name: cashtab-connect
description: DApp integration library for Cashtab browser extension wallet
version: 1.1.0
tags: [wallet, dapp, extension, browser, connection]
---

# cashtab-connect

用于连接 Cashtab 浏览器扩展钱包的 DApp 开发库。

## 概述

cashtab-connect 提供：
- 钱包地址请求
- XEC 转账
- Token 转账
- BIP21 URI 支持
- 完整的错误处理
- TypeScript 类型支持

**npm**: `cashtab-connect`
**版本**: 1.1.0
**官方仓库**: github.com/Bitcoin-ABC/bitcoin-abc (modules/cashtab-connect)

---

## Claude Code 使用指南

### 安装

```bash
npm install cashtab-connect
```

### 基础用法

```typescript
import { CashtabConnect } from 'cashtab-connect';

const cashtab = new CashtabConnect();

// 等待扩展安装
await cashtab.waitForExtension();

// 请求用户地址
const address = await cashtab.requestAddress();
console.log('User address:', address);
```

### 发送 XEC

```typescript
// 发送 XEC
await cashtab.sendXec(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  '1000.12'  // 可以是字符串或数字
);
```

### 发送 Token

```typescript
await cashtab.sendToken(
  'ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0',
  'token_id_here',
  '100.5'  // 代币数量（支持小数）
);
```

### BIP21 支付

```typescript
// 使用 BIP21 URI 创建交易
await cashtab.sendBip21('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0?amount=100');

// 从 BIP21 创建交易
const tx = cashtab.createTransactionFromBip21('ecash:qp3wj05au4l7q2m5ng4qg0vpeejl42lvl0nqj8q0q0?amount=50&message=Payment');
```

### 检查扩展可用性

```typescript
// 同步检查
if (cashtab.isExtensionAvailable()) {
  console.log('Cashtab extension is installed');
}

// 异步等待
try {
  await cashtab.waitForExtension();
  console.log('Extension is ready');
} catch (error) {
  console.log('Extension not available');
}
```

### 清理资源

```typescript
// 移除事件监听器
cashtab.destroy();
```

### 提示词模板

```
我需要连接用户的 Cashtab 钱包

我需要请求用户的 eCash 地址

我需要通过 Cashtab 发送 XEC

我需要通过 Cashtab 发送 Token

我需要处理钱包未安装的情况
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# cashtab-connect 配置
- name: "cashtab-connect"
  description: "Cashtab 浏览器扩展钱包连接"
  files:
    - "**/*cashtab*"
    - "**/*wallet*connect*"
    - "**/dapp/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { CashtabConnect } from 'cashtab-connect';
        import {
          CashtabExtensionUnavailableError,
          CashtabAddressDeniedError,
          CashtabTransactionDeniedError,
          CashtabTimeoutError,
        } from 'cashtab-connect';

    - type: "initialization"
      statement: |
        // 初始化 CashtabConnect
        const cashtab = new CashtabConnect({
          timeout: 30000,
          extensionNotAvailableMessage: '请安装 Cashtab 钱包',
          addressDeniedMessage: '用户拒绝了地址请求',
        });

    - type: "error-handling"
      statement: |
        // 错误处理模式
        try {
          const address = await cashtab.requestAddress();
        } catch (error) {
          if (error instanceof CashtabExtensionUnavailableError) {
            // 引导用户安装扩展
          } else if (error instanceof CashtabAddressDeniedError) {
            // 用户拒绝
          } else if (error instanceof CashtabTimeoutError) {
            // 超时
          }
        }

    - type: "cleanup"
      statement: |
        // 组件卸载时清理
        useEffect(() => {
          return () => cashtab.destroy();
        }, []);
```

### AI 角色设定

```
当你使用 cashtab-connect 时：

1. 先调用 waitForExtension() 确保扩展可用
2. 使用 isExtensionAvailable() 做预检查
3. 金额参数可以是字符串或数字
4. 总是处理四种错误类型
5. 组件卸载时调用 destroy()
6. 不要在生产环境硬编码超时时间
```

---

## API 参考

### CashtabConnect

```typescript
const cashtab = new CashtabConnect(options?: CashtabConnectOptions);
```

**选项:**

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `timeout` | number | 30000 | 请求超时（毫秒） |
| `extensionNotAvailableMessage` | string | - | 扩展不可用时的错误消息 |
| `addressDeniedMessage` | string | - | 地址请求被拒绝的消息 |

### 方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `waitForExtension(timeout?)` | Promise<void> | 等待扩展可用 |
| `isExtensionAvailable()` | boolean | 检查扩展是否可用 |
| `requestAddress()` | Promise<string> | 请求用户地址 |
| `sendXec(address, amount)` | Promise<void> | 发送 XEC |
| `sendToken(address, tokenId, quantity)` | Promise<void> | 发送 Token |
| `sendBip21(bip21)` | Promise<void> | 使用 BIP21 URI 发送 |
| `createTransactionFromBip21(bip21)` | object | 从 BIP21 创建交易 |
| `destroy()` | void | 清理事件监听器 |

### 错误类型

| 错误类 | 描述 |
|--------|------|
| `CashtabExtensionUnavailableError` | 扩展未安装 |
| `CashtabAddressDeniedError` | 用户拒绝提供地址 |
| `CashtabTransactionDeniedError` | 用户拒绝交易 |
| `CashtabTimeoutError` | 请求超时 |

---

## 代码示例

### React 组件集成

```tsx
import React, { useEffect, useState } from 'react';
import { CashtabConnect } from 'cashtab-connect';
import {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
} from 'cashtab-connect';

function WalletConnect() {
  const [cashtab] = useState(() => new CashtabConnect());
  const [isAvailable, setIsAvailable] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cashtab.waitForExtension()
      .then(() => setIsAvailable(true))
      .catch(() => setIsAvailable(false));

    return () => cashtab.destroy();
  }, [cashtab]);

  const handleConnect = async () => {
    try {
      setError(null);
      const addr = await cashtab.requestAddress();
      setAddress(addr);
    } catch (err) {
      if (err instanceof CashtabExtensionUnavailableError) {
        setError('请先安装 Cashtab 钱包扩展');
      } else if (err instanceof CashtabAddressDeniedError) {
        setError('您拒绝了地址请求');
      } else {
        setError('连接失败，请重试');
      }
    }
  };

  return (
    <div>
      {!isAvailable && (
        <button onClick={() => window.open('https://cashtab.com')}>
          安装 Cashtab 钱包
        </button>
      )}

      {isAvailable && !address && (
        <button onClick={handleConnect}>连接钱包</button>
      )}

      {address && <p>已连接: {address}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

### 支付组件

```tsx
function PaymentButton({ toAddress, amount }: { toAddress: string; amount: string }) {
  const [cashtab] = useState(() => new CashtabConnect());
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handlePay = async () => {
    try {
      setStatus('pending');
      await cashtab.sendXec(toAddress, amount);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button onClick={handlePay} disabled={status === 'pending'}>
      {status === 'idle' && `支付 ${amount} XEC`}
      {status === 'pending' && '等待确认...'}
      {status === 'success' && '支付成功'}
      {status === 'error' && '支付失败'}
    </button>
  );
}
```

---

## 工作原理

### 扩展检测

```typescript
// Cashtab 扩展在 window 对象上注入标识
window.bitcoinAbc === 'cashtab'
```

### 消息协议

```typescript
// 发送到扩展的消息格式
{
  text: "Cashtab",
  type: "FROM_PAGE",
  addressRequest: true,  // 或
  txInfo: { bip21: "ecash:...?amount=..." }
}

// 扩展返回的消息格式
{
  type: "FROM_CASHTAB",
  success: boolean,
  address?: string,
  txResponse?: {
    approved: boolean,
    txid?: string,
    reason?: string
  }
}
```

---

## 故障排除

### 常见问题

**Q: waitForExtension 总是失败**
- 检查是否安装了 Cashtab 扩展
- 检查浏览器兼容性
- 尝试增加超时时间

**Q: requestAddress 无响应**
- 用户可能取消了弹窗
- 扩展可能需要刷新页面
- 检查控制台是否有错误

**Q: sendXec 失败**
- 确保用户有足够余额
- 检查地址格式是否正确
- 可能是用户拒绝了交易

**Q: 内存泄漏**
- 确保组件卸载时调用 destroy()
- 不要创建多个 CashtabConnect 实例

### 检测脚本

```typescript
// 检查扩展是否安装
function isCashtabInstalled(): boolean {
  return typeof window !== 'undefined' &&
    (window as any).bitcoinAbc === 'cashtab';
}

// 检查扩展版本
function getCashtabVersion(): string | null {
  return (window as any).cashtabVersion || null;
}
```
