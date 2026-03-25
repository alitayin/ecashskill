import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAllSkills } from "@/lib/navigation"
import { Badge } from "@/components/ui/badge"

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
          选择一个 Skill 查看 Claude Code 提示词和 Cursor 配置
        </p>

        <div className="space-y-3">
          {skills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="block p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">{skill.version}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {skill.tags?.slice(0, 5).map((tag) => (
                  <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
