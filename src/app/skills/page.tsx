import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { getAllSkills } from "@/lib/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SkillsPage() {
  const skills = getAllSkills()

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">eCash Skills</h1>
        <p className="text-muted-foreground mb-8">
          点击「下载」获取 Claude Code / Cursor 配置文件
        </p>

        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.slug}
              className="p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{skill.version}</Badge>
                    <div className="flex flex-wrap gap-1">
                      {skill.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/skills/${skill.slug}`}>
                    <Button variant="outline" size="sm">查看详情</Button>
                  </Link>
                  <a href={`/skills/ecash/${skill.slug}.md`} download>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
