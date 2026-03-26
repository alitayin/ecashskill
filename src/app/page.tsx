"use client"

import { useState } from "react"
import { ArrowRight, Folder, File, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        - Use describe/it style`

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">eCash AI Development Skills</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Comprehensive eCash blockchain development skills for Claude Code and Cursor
          </p>
          <Button>Browse Docs <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </section>

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
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Add Plugin Marketplace</h3>
                  <CodeBlock
                    language="bash"
                    code={`claude plugin marketplace add https://github.com/alitayin/ecashskill`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Install Skill</h3>
                  <CodeBlock
                    language="bash"
                    code={`claude plugin install ecashskill@ecashskill`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Verify Installation</h3>
                  <CodeBlock
                    language="bash"
                    code={`claude plugin list`}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg border p-6">
              <h3 className="font-semibold mb-2">After Installation</h3>
              <p className="text-sm text-muted-foreground">
                Claude Code will automatically load the eCash skills when you start working on eCash-related development.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="cursor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cursor .cursorrules Setup</CardTitle>
                <CardDescription>
                  Add eCash development rules to your Cursor project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Option 1: Project-level Rules</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create a .cursorrules file in your project root
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`touch .cursorrules`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Option 2: Global Rules</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open Cursor Settings (Cmd/Ctrl + ,)</li>
                    <li>Find the Rules option</li>
                    <li>Add eCash development rules</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Full .cursorrules Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Copy the complete configuration below
                  </p>
                  <div className="relative border rounded-lg">
                    <pre className="p-4 text-sm overflow-y-auto h-96 bg-muted/30">
                      <code>{cursorRulesFull}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(cursorRulesFull)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy All
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Cursor&apos;s .cursorrules supports YAML format, allowing precise control over AI behavior for different file types.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mt-16">
          <h3 className="text-2xl font-semibold mb-6">Project Structure</h3>
          <div className="bg-muted/50 rounded-lg border">
            <ul className="divide-y">
              <li>
                <a
                  href="/skills/SKILL.md"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <File className="w-5 h-5 text-muted-foreground" />
                  <span>SKILL.md</span>
                  <span className="text-sm text-muted-foreground ml-2">Main Skill file</span>
                </a>
              </li>
              <li>
                <a
                  href="/skills/references"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <Folder className="w-5 h-5 text-primary" />
                  <span>references/</span>
                  <span className="text-sm text-muted-foreground ml-2">Tool reference documents</span>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
