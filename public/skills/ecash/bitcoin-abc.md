---
name: bitcoin-abc
description: Bitcoin ABC eCash node implementation, Chronik indexer, ecash-lib and contribution guidelines
version: 0.1.0
tags: [ecash, blockchain, node, indexer, contribution]
---

# Bitcoin ABC

Bitcoin ABC 是 eCash (XEC) 区块链的完整节点实现，包含 Chronik 索引器、ecash-lib 等核心模块。

## 概述

Bitcoin ABC 提供：
- eCash 区块链完整节点
- Chronik 高性能索引器
- ecash-lib 交易库
- 共识协议实现（Avalanche）
- SLP/ALP Token 支持

**仓库**: github.com/Bitcoin-ABC/bitcoin-abc
**代码审查**: reviews.bitcoinabc.org (Phabricator)
**开发语言**: C++, Rust, TypeScript/JavaScript

---

## Claude Code 使用指南

### 项目结构

```
bitcoin-abc/
├── src/                    # C++ 节点实现
├── modules/               # TypeScript/JavaScript 模块
│   ├── ecash-lib/        # eCash 交易库
│   ├── ecash-wallet/     # 钱包功能
│   ├── ecashaddrjs/      # 地址处理
│   ├── chronik-client/   # Chronik 客户端
│   └── cashtab/          # Cashtab 钱包
├── chronik/              # Rust 索引器实现
├── apps/                 # Web 应用
├── doc/                  # 文档
└── cmake/                # CMake 配置
```

### 模块目录结构

```
modules/ecash-lib/
├── src/                   # TypeScript 源码
├── tests/                 # 测试文件
├── testkeys/             # 测试密钥
├── wordlists/            # HD 钱包词表
├── package.json
├── tsconfig.json
└── README.md
```

### 开发环境要求

```bash
# Node.js (使用 pnpm)
node >= 20
pnpm >= 8

# C++ 构建
cmake >= 3.21
ninja
clang-16 / gcc-12+
llvm-16

# Rust (用于 Chronik)
rustup
cargo
```

### 构建步骤

```bash
# 克隆仓库
git clone ssh://vcs@reviews.bitcoinabc.org:2221/source/bitcoin-abc.git
cd bitcoin-abc

# 创建构建目录
mkdir build && cd build

# 配置 CMake (Debug)
cmake -GNinja .. -DCMAKE_BUILD_TYPE=Debug

# 构建
ninja

# 运行测试
ninja check        # 单元测试
ninja check-functional  # 功能测试
```

### 代码风格

**C++ 规范** (遵循 LLVM):
- 4 空格缩进（命名空间除外）
- 类/函数/命名空间使用大括号换行
- 其他情况大括号同行
- 函数使用 CamelCase
- 变量使用 lowerCamelCase
- 成员变量前缀 `m_`
- 常量使用 UPPER_SNAKE_CASE
- 命名空间使用 lower_snake_case

```cpp
// 正确示例
class TransactionValidator {
public:
    Result validate(const Transaction& tx) const;

private:
    int m_validationDepth;
    std::string m_lastError;
};

// 错误示例
class transaction_validator {  // 命名空间应为 lower_snake_case
public:
    bool ValidateTransaction(transaction TX);  // 参数应为 lowerCamelCase
private:
    int validation_depth_;  // 成员变量应前缀 m_
};
```

**TypeScript 规范**:
- 使用 ESLint + Prettier
- 启用 `strict: true`
- 使用具名导出

### 测试要求

```bash
# 运行所有测试
ninja check

# 运行单元测试
ninja check-unit

# 运行功能测试
ninja check-functional

# 查看测试覆盖率
ninja coverage-check-all

# 使用 Sanitizers 调试
cmake -GNinja .. \
  -DCMAKE_BUILD_TYPE=Debug \
  -DSANITIZERS_ENABLED=address,thread,undefined
```

### 提示词模板

```
我需要为 ecash-lib 添加一个新的签名类型

我需要了解如何贡献到 Bitcoin ABC

我需要查找 chronik 索引器的源码位置

我需要在 ecash-lib 中添加测试用例

我需要了解模块间的依赖关系
```

---

## Cursor 规则配置

### .cursorrules 片段

```yaml
# Bitcoin ABC 配置
- name: "bitcoin-abc"
  description: "eCash 完整节点和开发框架"
  files:
    - "**/*bitcoin*abc*"
    - "**/modules/**"
    - "**/chronik/**"
  rules:
    - type: "cpp-style"
      statement: |
        # C++ 代码规范
        - 缩进: 4 空格 (LLVM 风格)
        - 函数: CamelCase
        - 变量: lowerCamelCase
        - 成员变量: m_ 前缀
        - 常量: UPPER_SNAKE_CASE
        - 命名空间: lower_snake_case

    - type: "imports"
      statement: |
        # TypeScript 模块导入顺序
        1. 外部依赖 (node_modules)
        2. 内部模块 (@ecash-lib, chronik-client)
        3. 相对导入 (./, ../)
        4. 类型导入使用 import type

    - type: "testing"
      statement: |
        # 测试要求
        - 所有新功能必须有单元测试
        - 公共 API 必须有文档注释
        - 使用 describe/it 风格
        - Mock 外部依赖

    - type: "commit"
      statement: |
        # 提交规范
        - 使用 arc diff 创建 diff
        - 遵循 Conventional Commits
        - feat: 新功能
        - fix: 错误修复
        - test: 测试相关
        - docs: 文档相关
```

### AI 角色设定

```
当你为 Bitcoin ABC 项目编写代码时：

1. C++ 代码遵循 LLVM 编码标准
2. TypeScript 使用严格模式
3. 所有公共 API 必须有 JSDoc 注释
4. 提交前运行相关测试
5. 使用 arc lint 进行代码检查
6. 不要直接提交到 master/main，先创建 topic branch
```

---

## 模块说明

### ecash-lib

**位置**: `modules/ecash-lib/`
**用途**: eCash 交易构建和签名核心库

```typescript
import {
  Ecc,
  Script,
  TxBuilder,
  Tx,
  P2PKHSignatory,
  ALL_BIP143,
} from 'ecash-lib';
```

### chronik-client

**位置**: `modules/chronik-client/`
**用途**: Chronik 索引器 API 客户端

```typescript
import { ChronikClient } from 'chronik-client';
const chronik = new ChronikClient(['https://chronik.be.cash/xec']);
```

### ecashaddrjs

**位置**: `modules/ecashaddrjs/`
**用途**: eCash 地址格式编解码

```typescript
import ecashaddr from 'ecashaddrjs';
const { prefix, type, hash } = ecashaddr.decode(address);
```

### ecash-wallet

**位置**: `modules/ecash-wallet/`
**用途**: HD 钱包实现

```typescript
import { Wallet, Mnemonic } from 'ecash-wallet';
```

### cashtab

**位置**: `modules/cashtab/`
**用途**: 全功能 Web 钱包参考实现

---

## 贡献流程

### 1. 环境准备

```bash
# 安装 Arcanist (Phabricator CLI)
# 需要 PHP 7.4+
curl -s https://getcomposer.org/installer | php
composer global require phacility/arcanist

# 添加到 PATH
echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> ~/.bashrc

# 克隆仓库
git clone ssh://vcs@reviews.bitcoinabc.org:2221/source/bitcoin-abc.git
cd bitcoin-abc
```

### 2. 创建分支

```bash
# 从 master/main 创建 topic branch
git checkout -b 'your-feature-name'

# 或从特定版本创建
git checkout -b 'your-feature-name' v0.24.0
```

### 3. 开发与提交

```bash
# 查看修改
git status
git diff

# 提交 (使用英文描述)
git commit -a -m '描述'

# 创建 diff 进行代码审查
arc diff

# 或更新现有 diff
arc diff HEAD^
```

### 4. 代码审查

```bash
# 审查通过后合并
arc land

# 或手动合并
git checkout master
git merge your-feature-branch
git push
```

### 代码审查要点

```cpp
// 检查清单
1. 是否有内存泄漏 (使用 RAII)
2. 是否有线程安全问题
3. 错误处理是否完整
4. 是否有性能问题
5. 测试覆盖率是否足够
6. 文档是否更新

// 常见拒绝原因
- 违反编码规范
- 缺少测试
- 测试失败
- 内存泄漏
- 线程不安全
```

---

## API 参考

### 构建 C++ 模块

```bash
# 在指定目录构建
cd modules/ecash-lib
pnpm install
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm lint
```

### 测试工具

```bash
# 运行 chronik 功能测试
./test/functional/chronik_test

# 运行 ecash-lib 测试
pnpm test

# 生成覆盖率报告
pnpm coverage
```

### 调试工具

```bash
# 启用 ASan (Address Sanitizer)
ASAN_OPTIONS=detect_leaks=1 ./bitcoin-abc

# 启用 TSan (Thread Sanitizer)
TSAN_OPTIONS=halt_on_errors=1 ./bitcoin-abc

# 启用 UBSan (Undefined Behavior Sanitizer)
UBSAN_OPTIONS=halt_on_error=1 ./bitcoin-abc
```

---

## 代码示例

### 添加新的 ecash-lib 函数

```typescript
// modules/ecash-lib/src/myNewFeature.ts

/**

* Description of the new feature
* @param param1 - Description of param1
* @returns Description of return value
* @throws Error - Description of possible errors
*/
export function myNewFeature(param1: string): number {
  // Implementation
  return param1.length;
}
```

### 添加测试

```typescript
// modules/ecash-lib/tests/myNewFeature.test.ts

import { describe, it, expect } from 'vitest';
import { myNewFeature } from '../src/myNewFeature';

describe('myNewFeature', () => {
  it('should return correct length', () => {
    expect(myNewFeature('hello')).toBe(5);
  });

  it('should handle empty string', () => {
    expect(myNewFeature('')).toBe(0);
  });
});
```

### 文档注释示例

```cpp
// src/validation.h

/**
 * @class TransactionValidator
 * @brief Validates transactions against consensus rules
 *
 * This class performs various checks including:
 * - Script validation
 * - Signature verification
 * - Token protocol compliance
 *
 * @note Not thread-safe, use separate instances per thread
 */
class TransactionValidator {
public:
    /**

     * @brief Constructs a new transaction validator
     * @param rules The consensus validation rules to use
     * @param coinsView The coins view for UTXO lookup
     */
    explicit TransactionValidator(
        const ConsensusRules& rules,
        std::shared_ptr<CoinsView> coinsView);

    /**

     * @brief Validates a transaction
     * @param tx The transaction to validate
     * @returns ValidationResult containing success or error info
     * @throws std::runtime_error if internal error occurs
     */
    ValidationResult validate(const Transaction& tx) const;

private:
    const ConsensusRules& m_rules;
    std::shared_ptr<const CoinsView> m_coinsView;
    int m_validationDepth;
};
```

---

## 故障排除

### 常见问题

**Q: arc diff 失败**
- 确保已登录 Phabricator: `arc install-certificate`
- 检查 SSH 密钥配置
- 确认有代码审查权限

**Q: 构建失败**
- 确保使用支持的编译器版本 (clang-16 或 gcc-12+)
- 清理构建目录: `rm -rf build && mkdir build`
- 检查依赖是否完整

**Q: 测试失败**
- 确保代码是最新的: `git pull`
- 清理并重新构建
- 检查测试日志获取详细信息

**Q: pnpm install 失败**
- 确保 Node 版本 >= 20
- 清除缓存: `pnpm store prune`
- 删除 node_modules 重新安装

**Q: Chronik 测试失败**
- 确保本地节点正在运行
- 检查端口 8331 是否可用
- 查看节点日志

### 资源链接

- **代码审查**: https://reviews.bitcoinabc.org
- **问题追踪**: https://reviews.bitcoinabc.org/maniphest
- **开发 Telegram**: https://t.me/eCashDevelopment
- **文档**: https://github.com/Bitcoin-ABC/bitcoin-abc/tree/master/doc

### 版本兼容性

```bash
# 检查各模块版本要求
cat modules/ecash-lib/package.json | grep '"version"'
cat modules/chronik-client/package.json | grep '"version"'

# Node 兼容性
node --version  # 需要 >= 20
pnpm --version  # 需要 >= 8
```
