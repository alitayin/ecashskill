import { notFound } from "next/navigation"
import { DocsLayout } from "@/components/layout/DocsLayout"
import { getSkill } from "@/lib/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
    <DocsLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/skills"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </Link>

        <article>
          <header className="mb-8 pb-8 border-b">
            <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
            <p className="text-muted-foreground mb-4">{skill.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Version: {skill.version}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {skill.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-muted rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div
            className="prose prose-slate max-w-none
              prose-headings:scroll-mt-20
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:underline
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4
              prose-ul:my-4 prose-li:mb-1
              prose-hr:my-8 prose-hr:border-border"
          >
            <div dangerouslySetInnerHTML={{ __html: skill.content }} />
          </div>
        </article>
      </div>
    </DocsLayout>
  )
}
