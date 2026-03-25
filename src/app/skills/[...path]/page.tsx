import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, File, Folder, Download, ChevronRight } from "lucide-react"
import { getDirectoryContents, getFileContent, getBreadcrumbs } from "@/lib/navigation"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ path?: string[] }>
}

export default async function SkillsPage({ params }: PageProps) {
  const { path } = await params
  const relativePath = path ? path.join("/") : ""

  // If it's a file, show content
  if (relativePath && (relativePath.endsWith(".md") || relativePath.includes("."))) {
    const file = getFileContent(relativePath)
    if (!file) return notFound()

    const filename = relativePath.split("/").pop() || ""
    const breadcrumbs = getBreadcrumbs(relativePath.slice(0, relativePath.lastIndexOf("/")))

    return (
      <div className="min-h-screen">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/skills">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.path} className="flex items-center">
                    {i > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                    <span className={i === breadcrumbs.length - 1 ? "font-medium" : ""}>
                      {crumb.name}
                    </span>
                  </span>
                ))}
              </nav>
            </div>
            <a href={`/skills/ecash/${relativePath}`} download={filename}>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">{filename}</h1>
          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: file.content }} />
          </article>
        </main>
      </div>
    )
  }

  // It's a directory, show contents
  const items = getDirectoryContents(relativePath)
  const breadcrumbs = getBreadcrumbs(relativePath)

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={relativePath ? "/skills" : "/"}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {relativePath ? "返回 Skills" : "返回首页"}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {relativePath && (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center">
                {i > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                <Link
                  href={i === 0 ? "/skills" : `/skills/${crumb.path}`}
                  className={i === breadcrumbs.length - 1 ? "font-medium" : "hover:text-foreground"}
                >
                  {crumb.name}
                </Link>
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-2xl font-bold mb-6">
          {relativePath ? relativePath.split("/").pop() : "eCash Skills"}
        </h1>

        <div className="bg-muted/50 rounded-lg border">
          {items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">空目录</div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.type === "directory" ? `/skills/${item.path}` : `/skills/${item.path}`}
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    {item.type === "directory" ? (
                      <Folder className="w-5 h-5 text-primary" />
                    ) : (
                      <File className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={item.type === "directory" ? "font-medium" : ""}>
                      {item.name}
                    </span>
                    {item.type === "directory" && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
