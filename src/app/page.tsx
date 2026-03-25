import Link from "next/link"
import { ArrowRight, Folder, File } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            ecashskill
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/skills" className="hover:text-primary">Skills</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">eCash AI 开发 Skills</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            为 Claude Code 提供的 eCash 区块链开发技能，包含完整工具生态参考
          </p>
          <Link href="/skills">
            <Button>浏览文件 <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">项目结构</h3>
          <div className="bg-muted/50 rounded-lg border">
            <ul className="divide-y">
              <li>
                <Link
                  href="/skills"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <Folder className="w-5 h-5 text-primary" />
                  <span className="font-medium">ecash/</span>
                  <span className="text-sm text-muted-foreground ml-2">eCash Skills 根目录</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/SKILL.md"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <File className="w-5 h-5 text-muted-foreground" />
                  <span>SKILL.md</span>
                  <span className="text-sm text-muted-foreground ml-2">主 Skill 文件</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/references"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <Folder className="w-5 h-5 text-primary" />
                  <span>references/</span>
                  <span className="text-sm text-muted-foreground ml-2">工具参考文档</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-16 bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold mb-4">快速安装</h3>
          <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
            <code>{`# 添加市场
claude plugin marketplace add https://github.com/alitayin/ecashskill

# 安装 eCash Skills
claude plugin install ecash@ecash-skills`}</code>
          </pre>
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
          © 2026 ecashskill
        </div>
      </footer>
    </div>
  )
}
