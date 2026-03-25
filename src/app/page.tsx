import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
            <a href="#usage" className="hover:text-primary">使用说明</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">eCash AI 开发 Skills</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            为 Claude Code 和 Cursor 提供的 eCash 区块链开发技能配置
          </p>
          <Link href="/skills">
            <Button>浏览 Skills <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">所有 Skills ({skills.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <Card className="hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle>{skill.name}</CardTitle>
                    <CardDescription>{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-sm text-primary">
                      查看配置 <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section id="usage" className="bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold mb-4">使用说明</h3>
          <div className="space-y-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Claude Code</h4>
              <p className="text-muted-foreground mb-2">
                在 Claude Code 对话中，直接粘贴 Skill 中的提示词模板即可使用。
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cursor</h4>
              <p className="text-muted-foreground mb-2">
                复制 Skill 中的 .cursorrules 配置片段，添加到你的项目根目录。
              </p>
            </div>
          </div>
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
