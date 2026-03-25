import Link from "next/link"
import { ArrowLeft, Download, Folder } from "lucide-react"
import { getAllSkills, getReferences } from "@/lib/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SkillsPage() {
  const skills = getAllSkills()
  const references = getReferences()

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">eCash Skills</h1>
          <p className="text-muted-foreground">
            点击查看详情，点击下载获取完整 Skill 包
          </p>
        </div>

        {/* Main Skill */}
        {skills.map((skill) => (
          <div key={skill.slug} className="mb-8 p-6 rounded-lg border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Folder className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold">{skill.name}</h2>
                  <p className="text-muted-foreground mt-1">{skill.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary">v{skill.version}</Badge>
                    <div className="flex flex-wrap gap-1">
                      {skill.tags?.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <a href={`/skills/ecash/SKILL.md`} download={`ecash-SKILL.md`}>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  下载 SKILL.md
                </Button>
              </a>
            </div>
          </div>
        ))}

        {/* References */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">包含的工具参考</h3>
          <div className="space-y-2">
            {references.map((ref) => (
              <Link
                key={ref.slug}
                href={`/skills/${ref.slug}`}
                className="block p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{ref.name}</h4>
                    <p className="text-sm text-muted-foreground">{ref.description}</p>
                  </div>
                  <span className="text-sm text-primary">查看详情 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
