import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DocsLayout } from "@/components/layout/DocsLayout"
import { getAllSkills } from "@/lib/navigation"

export default function SkillsPage() {
  const skills = getAllSkills()
  const firstSkill = skills[0]

  return (
    <DocsLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">eCash Skills</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            为 AI 编码工具 (Claude Code, Cursor) 提供的 eCash 开发指南和规则配置
          </p>
          {firstSkill && (
            <Link
              href={`/skills/${firstSkill.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              开始学习 <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">所有 Skills</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <h3 className="font-medium mb-1">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
