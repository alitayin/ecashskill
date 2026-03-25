import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { getSkill } from "@/lib/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params
  const skill = getSkill(slug)

  if (!skill) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> 返回列表
          </Link>
          <a
            href={`/skills/ecash/${slug}/SKILL.md`}
            download={`${slug}-SKILL.md`}
          >
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              下载 SKILL.md
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
          <p className="text-muted-foreground mb-4">{skill.description}</p>
          <div className="flex items-center gap-4">
            <Badge>v{skill.version}</Badge>
            <div className="flex flex-wrap gap-1">
              {skill.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-muted/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Claude Code</h3>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>点击上方「下载」按钮获取 SKILL.md</li>
                <li>放入项目 <code className="bg-muted px-1 py-0.5 rounded">.claude/skills/</code> 目录</li>
                <li>Claude Code 自动加载此 Skill</li>
              </ol>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">一键安装</h3>
              <pre className="bg-background p-3 rounded border text-xs overflow-x-auto">
                <code>claude plugin marketplace add https://github.com/alitayin/ecashskill{`
claude plugin install ${slug}@ecash-skills`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="prose">
          <div dangerouslySetInnerHTML={{ __html: skill.content }} />
        </section>
      </main>
    </div>
  )
}
