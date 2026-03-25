import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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

  // Extract Claude Code section and Cursor rules section
  const content = skill.content || ""

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> 返回列表
          </Link>
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

        {/* Claude Code Section */}
        <section className="mb-10 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Claude Code 使用
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            复制以下内容到 Claude Code 对话中使用
          </p>
          <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
            <code>你是一个 eCash 开发专家，擅长使用 {skill.name} 进行开发。</code>
          </pre>
        </section>

        {/* Cursor Rules Section */}
        <section className="mb-10 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Cursor 配置
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            添加到你的 <code className="bg-muted px-1 py-0.5 rounded">.cursorrules</code> 文件
          </p>
          <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
            <code>{`# ${skill.name}
${skill.description}`}</code>
          </pre>
        </section>

        {/* Full Content */}
        <section className="prose">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </section>
      </main>
    </div>
  )
}
