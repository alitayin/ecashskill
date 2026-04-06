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
import { VERSION } from "@/lib/version"

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
          <Badge variant="secondary" className="mb-4">v{VERSION}</Badge>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="claude">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="others">OpenClaw &amp; 39 more</TabsTrigger>
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
                <CardTitle>Option 2: skills CLI</CardTitle>
                <CardDescription>
                  Install via the Agent Skills standard CLI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Claude Code also supports Agent Skills. Run in your project directory:
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"npx skills add alitayin/ecashskill"}
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
                  Install eCash skills via the skills CLI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Install with skills CLI</h3>
                  <p className="text-sm text-muted-foreground">
                    Run the following command in your project directory. No installation required — skills are auto-discovered by Cursor from <code className="bg-muted px-1 rounded">.agents/skills/</code>.
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"npx skills add alitayin/ecashskill"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Global install (all projects)</h3>
                  <p className="text-sm text-muted-foreground">
                    To make these skills available in every project, copy to your global Cursor skills directory:
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"npx skills add alitayin/ecashskill\ncp -r .agents/skills/* ~/.cursor/skills/"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Cursor will auto-discover these skills from <code className="bg-muted px-1 rounded">.agents/skills/</code>:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>ecashskill</strong> — Full eCash development skill with all references (chronik, ecash-lib, ecash-wallet, ecash-agora, cashtab, testing)</li>
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

          <TabsContent value="others" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>OpenClaw &amp; 39 More Agents</CardTitle>
                <CardDescription>
                  Install via the skills CLI — works with any Agent Skills compatible tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Install with skills CLI</h3>
                  <p className="text-sm text-muted-foreground">
                    The <code className="bg-muted px-1 rounded">npx skills</code> CLI automatically installs and configures skills for your agent. Supports <a href="https://github.com/vercel-labs/skills?tab=readme-ov-file#available-agents" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenCode, Claude Code, Codex, Cursor, and 39 more</a>.
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"npx skills add alitayin/ecashskill"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">How it works</h3>
                  <p className="text-sm text-muted-foreground">
                    Agent Skills is an open standard. The CLI downloads the skill into your project&apos;s <code className="bg-muted px-1 rounded">.agents/skills/</code> directory, which is auto-discovered by any compatible agent.
                  </p>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Browse more skills and see the leaderboard at <a href="https://skills.sh" target="_blank" rel="noopener noreferrer" className="text-primary underline">skills.sh</a>.
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
                    href="/skills/SKILL.md"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <File className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">SKILL.md</span>
                    <span className="text-sm text-muted-foreground ml-auto">Main skill</span>
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
