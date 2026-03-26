import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const guides = [
  {
    slug: "quickstart",
    title: "快速入门",
    description: "5分钟搭建你的第一个 eCash AI 应用",
    difficulty: "入门",
  },
  {
    slug: "wallet-integration",
    title: "钱包集成指南",
    description: "详细讲解如何集成 eCash 钱包",
    difficulty: "进阶",
  },
  {
    slug: "advanced-agent",
    title: "高级 Agent 开发",
    description: "构建复杂的 eCash 交互逻辑",
    difficulty: "高级",
  },
]

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Guides</h1>
        <p className="text-muted-foreground">
          从入门到进阶的完整教程
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {guides.map((guide) => (
          <Card key={guide.slug} className="hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </div>
              <Badge
                variant={
                  guide.difficulty === "入门"
                    ? "secondary"
                    : guide.difficulty === "进阶"
                    ? "default"
                    : "destructive"
                }
              >
                {guide.difficulty}
              </Badge>
            </CardHeader>
            <CardContent>
              <Link
                href={`/guides/${guide.slug}`}
                className="inline-flex items-center text-sm text-primary hover:underline transition-colors"
              >
                开始阅读 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
