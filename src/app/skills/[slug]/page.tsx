import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { getReference, getAllSkills, getSkill } from "@/lib/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params

  // Check if it's the main skill
  if (slug === "ecash") {
    const skill = getSkill("ecash")
    if (!skill) return notFound()

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
            <a href={`/skills/ecash/SKILL.md`} download={`ecash-SKILL.md`}>
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
            <h2 className="text-xl font-semibold mb-4">安装命令</h2>
            <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
              <code>{`# 添加市场
claude plugin marketplace add https://github.com/alitayin/ecashskill

# 安装 eCash Skills
claude plugin install ecash@ecash-skills`}</code>
            </pre>
          </section>

          <section className="prose">
            <div dangerouslySetInnerHTML={{ __html: skill.content }} />
          </section>
        </main>
      </div>
    )
  }

  // It's a reference
  const ref = getReference(slug)
  if (!ref) return notFound()

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
          <a href={`/skills/ecash/references/${slug}.md`} download={`${slug}.md`}>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              下载 {ref.name}.md
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{ref.name}</h1>
        </div>

        <section className="prose">
          <div dangerouslySetInnerHTML={{ __html: ref.content }} />
        </section>
      </main>
    </div>
  )
}
