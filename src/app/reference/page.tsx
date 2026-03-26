import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const references = [
  {
    title: "API 速查表",
    description: "eCash API 常用方法快速参考",
    category: "API",
  },
  {
    title: "开发资源链接",
    description: "有用的外部开发资源和文档",
    category: "Resources",
  },
  {
    title: "错误码说明",
    description: "常见错误码及解决方案",
    category: "Debug",
  },
]

export default function ReferencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Reference</h1>
        <p className="text-muted-foreground">
          API 速查表与开发资源
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {references.map((ref) => (
          <Card key={ref.title}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{ref.category}</Badge>
              </div>
              <CardTitle>{ref.title}</CardTitle>
              <CardDescription>{ref.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">即将推出...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
