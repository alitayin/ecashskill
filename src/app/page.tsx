import Link from "next/link"
import { ArrowRight, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllSkills } from "@/lib/navigation"

export default function Home() {
  const skills = getAllSkills()

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
            为 Claude Code 和 Cursor 提供的 eCash 区块链开发技能市场
          </p>
          <Link href="/skills">
            <Button>浏览 Skills <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">所有 Skills ({skills.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <Card className="hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                    <CardDescription>{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>v{skill.version}</span>
                      <span>•</span>
                      <span>{skill.tags?.slice(0, 3).join(", ")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold mb-4">快速安装</h3>
          <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
            <code>{`# 添加市场
claude plugin marketplace add https://github.com/alitayin/ecashskill

# 安装 skill
claude plugin install <skill-name>@ecash-skills`}</code>
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
