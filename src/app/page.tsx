import Link from "next/link"
import { ArrowRight, Code, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">ecash 开发资源站</h1>
        <p className="text-lg text-muted-foreground mb-8">
          为开发者提供 ecash 区块链相关的 AI 开发指南、Skill MD 和 Cursor 规则文件等资源
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/skills">
            <Button>开始探索 <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
          <Link href="/guides">
            <Button variant="outline">阅读指南</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={<Code className="w-6 h-6" />}
          title="Skills"
          description="AI Agent Skill 开发指南与最佳实践"
          href="/skills"
        />
        <FeatureCard
          icon={<FileText className="w-6 h-6" />}
          title="Guides"
          description="从入门到进阶的完整教程"
          href="/guides"
        />
        <FeatureCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Reference"
          description="API 速查表与开发资源"
          href="/reference"
        />
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button variant="link" className="px-0">
            了解更多 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
