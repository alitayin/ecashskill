import { BookOpen, Bot, Boxes, Code2, FileText, GitBranch, Library, Plug, ShieldCheck, Wallet } from "lucide-react"

export const installTabs = [
  {
    value: "claude",
    label: "Claude Code",
    title: "Claude Code plugin",
    description: "Install the eCash AI Skill as a Claude Code plugin for eCash development sessions.",
    steps: [
      {
        title: "Add marketplace",
        code: "claude plugin marketplace add https://github.com/alitayin/ecashskill",
      },
      {
        title: "Install skill",
        code: "claude plugin install ecashskill@ecashskill",
      },
      {
        title: "Verify installation",
        code: "claude plugin list",
      },
    ],
  },
  {
    value: "skills-cli",
    label: "Skills CLI",
    title: "Agent Skills install",
    description: "Use the Agent Skills CLI for Codex, Cursor, Claude Code, OpenCode, and compatible agents.",
    steps: [
      {
        title: "Install into the current project",
        code: "npx skills add alitayin/ecashskill",
      },
      {
        title: "Commit the installed skill with your project",
        code: "git add .agents/skills/ecashskill",
      },
    ],
  },
  {
    value: "cursor",
    label: "Cursor",
    title: "Cursor project or global install",
    description: "Install the same eCash AI Skill package where Cursor can auto-discover it.",
    steps: [
      {
        title: "Project install",
        code: "npx skills add alitayin/ecashskill",
      },
      {
        title: "Optional global install",
        code: "mkdir -p ~/.cursor/skills\ncp -R .agents/skills/ecashskill ~/.cursor/skills/",
      },
    ],
  },
] as const

export const capabilityCards = [
  {
    title: "Chronik queries",
    description: "Agent-ready guidance for address history, UTXOs, token lookups, broadcasts, and WebSockets.",
    icon: Library,
  },
  {
    title: "Wallet and signing",
    description: "Rules for HD wallet paths, XEC units, token actions, transaction building, and signing patterns.",
    icon: Wallet,
  },
  {
    title: "Apps and integrations",
    description: "Implementation context for Cashtab, Cashtab Connect, PayButton, Agora, and quicksend flows.",
    icon: Plug,
  },
  {
    title: "Testing guidance",
    description: "Mock Chronik clients, deterministic transaction fixtures, unit boundaries, and network-free checks.",
    icon: ShieldCheck,
  },
] as const

export const referenceCards = [
  {
    title: "Chronik",
    description: "Indexer API, WebSockets, endpoint maps, token conventions, and node targets.",
    href: "/skills/references/chronik/chronik.md",
    category: "Infrastructure",
    icon: Library,
  },
  {
    title: "chronik-client",
    description: "TypeScript client quick starts, common queries, broadcast helpers, and subscriptions.",
    href: "/skills/references/chronik-client.md",
    category: "API",
    icon: Code2,
  },
  {
    title: "ecash-lib",
    description: "Transaction building, scripts, signing, serialization, and core primitives.",
    href: "/skills/references/ecash-lib.md",
    category: "Transactions",
    icon: Boxes,
  },
  {
    title: "ecash-wallet",
    description: "HD wallets, watch-only wallets, XEC sends, token actions, and derivation paths.",
    href: "/skills/references/ecash-wallet.md",
    category: "Wallet",
    icon: Wallet,
  },
  {
    title: "ecash-agora",
    description: "Offer discovery, partial and oneshot sales, accept/cancel transactions, and price units.",
    href: "/skills/references/ecash-agora.md",
    category: "Markets",
    icon: GitBranch,
  },
  {
    title: "ecash-quicksend",
    description: "Small-project XEC/token sends and Agora helpers with mnemonic-based wallet setup.",
    href: "/skills/references/ecash-quicksend.md",
    category: "Payments",
    icon: Bot,
  },
  {
    title: "Cashtab",
    description: "Wallet reference behavior, browser extension integration, and app-level conventions.",
    href: "/skills/references/cashtab.md",
    category: "Apps",
    icon: BookOpen,
  },
  {
    title: "PayButton",
    description: "Payment button and widget setup for donations, checkout, callbacks, and self-hosted APIs.",
    href: "/skills/references/paybutton.md",
    category: "Payments",
    icon: FileText,
  },
] as const

export const projectLinks = [
  {
    title: "SKILL.md",
    description: "Skill entry point with usage triggers, reference map, and prompt templates.",
    href: "/skills/SKILL.md",
    icon: FileText,
  },
  {
    title: "references/",
    description: "Versioned eCash docs for Chronik, wallets, tokens, payments, marketplaces, and tests.",
    href: "/skills/references",
    icon: Library,
  },
] as const
