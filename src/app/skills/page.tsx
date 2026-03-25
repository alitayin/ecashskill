import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const skills = [
  {
    slug: "wallet-connect",
    title: "eCash 钱包连接",
    description: "学习如何将 eCash 钱包连接到你的 AI Agent",
    category: "wallet",
  },
  {
    slug: "token-transfer",
    title: "Token 转账",
    description: "实现 eCash Token 的发送和接收功能",
    category: "defi",
  },
  {
    slug: "agent-template",
    title: "AI Agent 模板",
    description: "快速创建 eCash 交互的 AI Agent",
    category: "agent",
  },
]

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills</h1>
        <p className="text-muted-foreground">
          eCash 相关的 AI Agent Skill 开发指南
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.slug} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{skill.category}</Badge>
              </div>
              <CardTitle>{skill.title}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/skills/${skill.slug}`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                查看详情 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
