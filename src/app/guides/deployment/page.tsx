"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useState } from "react"

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="bg-muted/50 p-4 rounded-lg border text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-2 hover:bg-muted rounded-md transition-colors"
        title="Copy"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export default function DeploymentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/guides"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回指南
        </Link>
        <h1 className="text-3xl font-bold mb-2">部署指南</h1>
        <p className="text-muted-foreground">
          选择你的 IDE 开始使用 eCash 开发技能
        </p>
      </div>

      <Tabs defaultValue="claude" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="claude">Claude Code</TabsTrigger>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
        </TabsList>

        <TabsContent value="claude" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claude Code Skill 安装</CardTitle>
              <CardDescription>
                通过插件市场安装 eCash 开发技能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. 添加插件市场</h3>
                <CodeBlock
                  language="bash"
                  code={`# 添加 ecashskill 插件市场
claude plugin marketplace add https://github.com/alitayin/ecashskill`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 安装 Skill</h3>
                <CodeBlock
                  language="bash"
                  code={`# 安装 ecashskill
claude plugin install ecashskill@ecashskill`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. 验证安装</h3>
                <CodeBlock
                  language="bash"
                  code={`# 查看已安装的 plugins
claude plugin list`}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">安装成功后</h4>
                <p className="text-sm text-muted-foreground">
                  Claude Code 会自动加载 eCash 技能，当你开始 eCash
                  相关开发时会自动使用。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">相关文件</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <Link href="/skills/SKILL.md" className="text-primary hover:underline">
                      SKILL.md
                    </Link>{" "}
                    - 技能主文件
                  </li>
                  <li>
                    <Link href="/skills/references" className="text-primary hover:underline">
                      references/
                    </Link>{" "}
                    - 工具参考文档
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cursor .cursorrules 配置</CardTitle>
              <CardDescription>
                将 eCash 开发规则添加到你的 Cursor 项目中
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">方式一：项目级规则</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  在项目根目录创建 .cursorrules 文件
                </p>
                <CodeBlock
                  language="bash"
                  code={`# 在项目根目录创建 .cursorrules
touch .cursorrules`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">方式二：全局规则</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  添加全局 Cursor 规则（所有项目生效）
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>打开 Cursor 设置 (Cmd/Ctrl + ,)</li>
                  <li>找到 Rules 选项</li>
                  <li>添加 eCash 开发规则</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">复制规则配置</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  点击下方按钮复制完整的 .cursorrules 配置
                </p>
                <CodeBlock
                  language="yaml"
                  code={`# eCash Development Rules for Cursor
# See: https://cursor.com/docs/rules

- name: "chronik-client"
  description: "eCash Chronik Indexer API client configuration"
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
        const chronik = new ChronikClient(['https://chronik.e.cash/xec']);

- name: "ecash-lib"
  description: "eCash transaction building and signing library"
  files:
    - "**/*wallet*"
    - "**/*tx*"
    - "**/*sign*"
  rules:
    - type: "import"
      statement: |
        import { Ecc, Script, TxBuilder, P2PKHSignatory, ALL_BIP143 } from 'ecash-lib';
    - type: "bigint"
      statement: |
        // Use BigInt for amounts: 1000n satoshis

- name: "ecash-wallet"
  description: "eCash HD wallet library"
  files:
    - "**/*wallet*"
  rules:
    - type: "best-practice"
      statement: |
        // Always sync() wallet first, use BigInt for amounts`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">推荐做法</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    为每个 eCash 项目创建独立的 .cursorrules
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    根据项目需求选择需要的规则模块
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    查看完整规则：
                    <Link
                      href="/skills/CURSOR.md"
                      className="text-primary hover:underline"
                    >
                      CURSOR.md
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">提示</h4>
                <p className="text-sm text-muted-foreground">
                  Cursor 的 .cursorrules 支持 YAML 格式，可以精确控制
                  AI 在不同文件类型时的行为。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-between">
        <Link
          href="/guides/quickstart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          上一页：快速入门
        </Link>
        <Link
          href="/skills"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          浏览技能文档
          <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  )
}
