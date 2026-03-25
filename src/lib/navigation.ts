import fs from "fs"
import path from "path"
import matter from "gray-matter"

const skillsDirectory = path.join(process.cwd(), "src/skills/ecash")

export interface SkillMeta {
  name: string
  description: string
  version: string
  tags: string[]
  slug: string
}

export interface SkillCategory {
  name: string
  skills: SkillMeta[]
}

export function getAllSkills(): SkillMeta[] {
  const files = fs.readdirSync(skillsDirectory)
  const skills = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(".md", "")
      const fullPath = path.join(skillsDirectory, file)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)
      return {
        slug,
        ...(data as Omit<SkillMeta, "slug">),
      }
    })
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkillsByCategory(): SkillCategory[] {
  const skills = getAllSkills()

  const categoryMap: Record<string, SkillMeta[]> = {
    infrastructure: [],
    utilities: [],
    transaction: [],
    wallet: [],
    applications: [],
  }

  skills.forEach((skill) => {
    const tags = skill.tags || []
    if (tags.includes("node") || tags.includes("blockchain") || tags.includes("indexer")) {
      categoryMap.infrastructure.push(skill)
    } else if (tags.includes("wallet") || tags.includes("hd")) {
      categoryMap.wallet.push(skill)
    } else if (tags.includes("transaction") || tags.includes("signing")) {
      categoryMap.transaction.push(skill)
    } else if (tags.includes("application") || tags.includes("app")) {
      categoryMap.applications.push(skill)
    } else {
      categoryMap.utilities.push(skill)
    }
  })

  return [
    { name: "基础设施", skills: categoryMap.infrastructure },
    { name: "工具库", skills: categoryMap.utilities },
    { name: "交易签名", skills: categoryMap.transaction },
    { name: "钱包", skills: categoryMap.wallet },
    { name: "应用", skills: categoryMap.applications },
  ].filter((cat) => cat.skills.length > 0)
}

export function getSkill(slug: string): (SkillMeta & { content: string }) | null {
  const fullPath = path.join(skillsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  return {
    slug,
    content,
    ...(data as Omit<SkillMeta, "slug">),
  }
}
