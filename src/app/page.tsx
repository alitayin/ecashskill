import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllSkills, getReferences } from "@/lib/navigation"

export default function Home() {
  const skills = getAllSkills()
  const references = getReferences()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">ecashskill</h1>
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
            <Button>查看详情 <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">包含的工具参考</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {references.map((ref) => (
              <Card key={ref.slug} className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{ref.name}</CardTitle>
                  <CardDescription className="text-sm">{ref.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
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
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2026 ecashskill
        </div>
      </footer>
    </div>
  )
}
