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

const cursorRulesFull = `# eCash Development Rules for Cursor
# See: https://github.com/alitayin/ecashskill

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
        // Recommended to use ConnectionStrategy.ClosestFirst for auto-selecting optimal node
        const chronik = await ChronikClient.useStrategy(
          ConnectionStrategy.ClosestFirst,
          ['https://chronik.e.cash']
        );
    - type: "error-handling"
      statement: |
        // Handle chronik connection errors
        try {
          const tx = await chronik.tx(txid);
        } catch (error) {
          if (error.message.includes('Not Found')) {
            console.error('Transaction not found:', txid);
          } else if (error.message.includes('timeout')) {
            console.error('Chronik request timeout');
          }
        }
    - type: "websocket"
      statement: |
        // Remember to handle disconnection and reconnection after WebSocket subscription
        const ws = chronik.ws({
          onMessage: handleMessage,
          onReconnect: (e) => console.log('Reconnecting...'),
          autoReconnect: true,
          keepAlive: true,
        });

- name: "ecash-lib"
  description: "eCash transaction building and signing library"
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
        // Use BIP143 signing (eCash recommended)
        // ALL_BIP143 = SIGHASH_ALL | SIGHASH_BIP143
    - type: "bigint"
      statement: |
        // Note: eCash uses bigint for satoshi amounts
        // Use BigInt() literals: 1000n, 546n
    - type: "error-handling"
      statement: |
        // Signing error handling
        try {
          const tx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
        } catch (error) {
          if (error.message.includes('Insufficient funds')) {
            throw new Error('Insufficient balance to pay fee');
          }
          throw error;
        }

- name: "ecash-wallet"
  description: "eCash HD wallet library"
  files:
    - "**/*wallet*"
    - "**/*ecash*wallet*"
  rules:
    - type: "import"
      statement: |
        import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';
    - type: "initialization"
      statement: |
        // Wallet initialization flow
        const chronik = new ChronikClient(['https://chronik.e.cash']);
        const wallet = Wallet.fromMnemonic(mnemonic, chronik);
        await wallet.sync(); // Sync UTXOs and balance
    - type: "hd-wallet"
      statement: |
        // HD wallet configuration
        const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
          hd: true,
          accountNumber: 0,
          receiveIndex: 0,
          changeIndex: 0,
        });
    - type: "best-practice"
      statement: |
        // Never store private keys in frontend
        // Use wallet signing instead of directly manipulating private keys
        // Call wallet.sync() after each send to update UTXOs
    - type: "balance"
      statement: |
        // Balance is BigInt
        console.log(wallet.balanceSats); // 1000000n

- name: "ecashaddrjs"
  description: "eCash address format encoding/decoding"
  files:
    - "**/*address*"
    - "**/utils/**/*.ts"
    - "**/validation/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import ecashaddr from 'ecashaddrjs';
    - type: "best-practice"
      statement: |
        // Must validate type and hash after address decoding
        const { prefix, type, hash } = ecashaddr.decode(address);
        if (type !== 'P2PKH' && type !== 'P2SH') {
          throw new Error('Unsupported address type');
        }
    - type: "validation"
      statement: |
        // Validation function template
        function isValidEcashAddress(address: string): boolean {
          try {
            const { prefix } = ecashaddr.decode(address);
            return prefix === 'ecash';
          } catch {
            return false;
          }
        }

- name: "ecash-agora"
  description: "eCash Agora decentralized trading protocol"
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
        // Oneshot for NFT - all or nothing
        const oneshot = new AgoraOneshot({
          enforcedOutputs: [...],
          cancelPk: makerCancelPk,
        });
    - type: "partial"
      statement: |
        // Partial for fungible Tokens - can purchase partially
        const partial = AgoraPartial.approximateParams({
          offeredAtoms: amount,
          priceNanoSatsPerAtom: price,
          minAcceptedAtoms: minAmount,
          tokenId,
          tokenType,
          tokenProtocol: 'SLP' | 'ALP',
        });

- name: "cashtab-connect"
  description: "Cashtab browser extension wallet connection"
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
    - type: "cleanup"
      statement: |
        // Cleanup on component unmount
        useEffect(() => {
          return () => cashtab.destroy();
        }, []);

- name: "mock-chronik-client"
  description: "Chronik test mocking library"
  files:
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/__tests__/**"
  rules:
    - type: "import"
      statement: |
        import { MockChronikClient } from 'mock-chronik-client';
    - type: "setup"
      statement: |
        // Setup mock before test
        beforeEach(() => {
          mockChronik = new MockChronikClient();
          mockChronik.setChronikInfo({ version: '1.0.0' });
          mockChronik.setBlockchainInfo({ tipHeight: 800000 });
        });
    - type: "teardown"
      statement: |
        // Cleanup after test
        afterEach(() => {
          mockChronik = null;
        });

- name: "bitcoin-abc"
  description: "eCash full node and development framework"
  files:
    - "**/*bitcoin*abc*"
    - "**/modules/**"
    - "**/chronik/**"
  rules:
    - type: "cpp-style"
      statement: |
        # C++ Code Standards
        - Indentation: 4 spaces (LLVM style)
        - Functions: CamelCase
        - Variables: lowerCamelCase
        - Member variables: m_ prefix
    - type: "testing"
      statement: |
        # Testing Requirements
        - All new features must have unit tests
        - Use describe/it style

- name: "ecash-quicksend"
  description: "Quick transaction sender for simple payments"
  files:
    - "**/*quicksend*"
    - "**/*payment*"
    - "**/simple/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { Quicksend } from 'ecash-quicksend';
    - type: "note"
      statement: |
        // Note: ecash-quicksend is for simple payments and prototypes
        // For large production projects, use ecash-wallet with ecash-lib
        // Limited maintenance - not suitable for production-critical apps
`

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
                <CardTitle>Cursor .cursorrules Setup</CardTitle>
                <CardDescription>
                  Add eCash development rules to your Cursor project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Option 1: Project-level Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a .cursorrules file in your project root
                  </p>
                  <CodeBlock
                    language="bash"
                    code={"touch .cursorrules"}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Option 2: Global Rules</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open Cursor Settings (Cmd/Ctrl + ,)</li>
                    <li>Find the Rules option</li>
                    <li>Add eCash development rules</li>
                  </ol>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Full .cursorrules Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy the complete configuration below
                  </p>
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <pre className="p-4 text-sm overflow-y-auto h-96">
                          <code>{cursorRulesFull}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => navigator.clipboard.writeText(cursorRulesFull)}
                        >
                          <Copy className="w-4 h-4 mr-1" data-icon="inline-start" />
                          Copy All
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Cursor&apos;s .cursorrules supports YAML format, allowing precise control over AI behavior for different file types.
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
                    <span className="text-sm text-muted-foreground ml-auto">Main Skill file</span>
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
