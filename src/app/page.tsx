import Link from "next/link"
import { ArrowRight, Folder, File } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">eCash AI Development Skills</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Comprehensive eCash blockchain development skills for Claude Code with complete tool ecosystem references
          </p>
          <Link href="/skills">
            <Button>Browse Files <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">Project Structure</h3>
          <div className="bg-muted/50 rounded-lg border">
            <ul className="divide-y">
              <li>
                <Link
                  href="/skills/SKILL.md"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <File className="w-5 h-5 text-muted-foreground" />
                  <span>SKILL.md</span>
                  <span className="text-sm text-muted-foreground ml-2">Main Skill file</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/references"
                  className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <Folder className="w-5 h-5 text-primary" />
                  <span>references/</span>
                  <span className="text-sm text-muted-foreground ml-2">Tool reference documents</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-16 bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold mb-4">Quick Install</h3>
          <pre className="bg-background p-4 rounded-lg border text-sm overflow-x-auto">
            <code>{`# 添加市场
claude plugin marketplace add https://github.com/alitayin/ecashskill

# 安装 eCash Skills
claude plugin install ecash@ecash-skills`}</code>
          </pre>
        </section>
      </main>
    </div>
  )
}
