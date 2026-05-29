"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Copy, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { capabilityCards, installTabs, projectLinks } from "@/lib/site-content"
import { VERSION } from "@/lib/version"

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg border bg-muted/60 p-4 text-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        onClick={copy}
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto flex max-w-6xl flex-col gap-14 px-4 py-14">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">v{VERSION}</Badge>
              <Badge variant="outline">Agent Skills</Badge>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                eCash AI Development Skills
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A maintained skill pack for building with eCash, Chronik, ecash-lib,
                wallets, tokens, Agora, Cashtab, PayButton, and realistic test doubles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/skills/SKILL.md" />}>
                Browse skill
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button variant="outline" render={<Link href="/reference" />}>
                Reference map
              </Button>
              <Button
                variant="ghost"
                render={
                  <Link href="https://github.com/alitayin/ecashskill" target="_blank" rel="noopener noreferrer" />
                }
              >
                GitHub
                <ExternalLink data-icon="inline-end" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What it covers</CardTitle>
              <CardDescription>Practical references for common eCash agent work.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {capabilityCards.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-lg border bg-background/70 p-3">
                  <item.icon className="mt-0.5 text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">Install</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Pick the path that matches your agent. The skill is stored as markdown references,
              so it works without app runtime dependencies once installed.
            </p>
          </div>

          <Tabs defaultValue="claude" className="gap-4">
            <TabsList className="grid w-full grid-cols-3">
              {installTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {installTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>{tab.title}</CardTitle>
                    <CardDescription>{tab.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    {tab.steps.map((step, index) => (
                      <div key={step.title} className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium">
                          {index + 1}. {step.title}
                        </h3>
                        <CodeBlock code={step.code} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <Separator />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Project structure</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Start with the skill entry point, then drill into references when a task needs
              library-specific details.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projectLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50"
              >
                <item.icon className="mt-0.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{item.description}</span>
                </span>
                <ArrowRight className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
