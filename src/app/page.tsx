"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Folder, File, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ParticleBackground } from "@/components/ParticleBackground"

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-muted/50 p-4 rounded-lg border text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        onClick={copy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-1" data-icon="inline-start" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-1" data-icon="inline-start" />
            Copy
          </>
        )}
      </Button>
    </div>
  )
}


export default function Home() {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <section className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="mb-4">v1.0.0</Badge>
          <h2 className="text-4xl font-bold tracking-tight">eCash AI Development Skills</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Comprehensive eCash blockchain development skills for Claude Code and Cursor
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/alitayin/ecashskill"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-8 px-4 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <Separator className="my-12" />

        <Tabs defaultValue="claude" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claude">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
          </TabsList>

          <TabsContent value="claude" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Claude Code Installation</CardTitle>
                <CardDescription>
                  Install via plugin marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">1. Add Plugin Marketplace</h3>
                  <CodeBlock
                    language="bash"
                    code={"claude plugin marketplace add https://github.com/alitayin/ecashskill"}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">2. Install Skill</h3>
                  <CodeBlock
                    language="bash"
                    code={"claude plugin install ecashskill@ecashskill"}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">3. Verify Installation</h3>
                  <CodeBlock
                    language="bash"
                    code={"claude plugin list"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>After Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Claude Code will automatically load the eCash skills when you start working on eCash-related development.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cursor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cursor Agent Skills</CardTitle>
                <CardDescription>
                  Install eCash skills for Cursor via GitHub remote rule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Install from GitHub</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open Cursor Settings (<code className="bg-muted px-1 rounded">Cmd+Shift+J</code>)</li>
                    <li>Navigate to <strong>Rules</strong></li>
                    <li>In Project Rules, click <strong>Add Rule → Remote Rule (Github)</strong></li>
                    <li>Enter the repository URL below</li>
                  </ol>
                  <CodeBlock
                    language="bash"
                    code={"https://github.com/alitayin/ecashskill"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Or install manually</h3>
                  <p className="text-sm text-muted-foreground">
                    Clone the repo and place the skills folder in your project:
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"cp -r ecashskill/.agents/skills .agents/skills"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Cursor will auto-discover these skills from <code className="bg-muted px-1 rounded">.agents/skills/</code>:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>ecash-core</strong> — XEC basics, address format, quick start</li>
                    <li><strong>chronik</strong> — Blockchain indexer &amp; chronik-client</li>
                    <li><strong>ecash-lib</strong> — Transaction building &amp; signing</li>
                    <li><strong>ecash-wallet</strong> — HD wallet management</li>
                    <li><strong>ecash-agora</strong> — Decentralized exchange protocol</li>
                    <li><strong>cashtab</strong> — Web wallet &amp; browser extension</li>
                    <li><strong>ecash-testing</strong> — Mock utilities for unit tests</li>
                  </ul>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Skills are auto-discovered by Cursor from <code className="bg-muted px-1 rounded">.agents/skills/</code> and applied automatically when relevant. You can also invoke any skill manually with <code className="bg-muted px-1 rounded">/skill-name</code> in Agent chat.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-12" />

        <section className="space-y-6">
          <h3 className="text-2xl font-semibold tracking-tight">Project Structure</h3>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                <li>
                  <a
                    href="/skills/ecash-core/SKILL.md"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <File className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">ecash-core/SKILL.md</span>
                    <span className="text-sm text-muted-foreground ml-auto">Core skill</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/skills/references"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <Folder className="w-5 h-5 text-primary" />
                    <span className="font-medium">references/</span>
                    <span className="text-sm text-muted-foreground ml-auto">Tool reference documents</span>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
