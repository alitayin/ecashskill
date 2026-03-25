import fs from "fs"
import path from "path"
import matter from "gray-matter"

const skillsDirectory = path.join(process.cwd(), "public/skills/ecash")

export interface SkillMeta {
  name: string
  description: string
  version: string
  tags: string[]
  slug: string
}

export interface Reference {
  slug: string
  name: string
  description: string
}

export function getAllSkills(): SkillMeta[] {
  const skillPath = path.join(skillsDirectory, "SKILL.md")
  if (!fs.existsSync(skillPath)) {
    return []
  }
  const fileContents = fs.readFileSync(skillPath, "utf8")
  const { data } = matter(fileContents)
  return [{
    slug: "ecash",
    ...(data as Omit<SkillMeta, "slug">),
  }]
}

export function getReferences(): Reference[] {
  const refsDir = path.join(skillsDirectory, "references")
  if (!fs.existsSync(refsDir)) {
    return []
  }
  const files = fs.readdirSync(refsDir).filter(f => f.endsWith(".md"))
  return files.map(file => {
    const slug = file.replace(".md", "")
    const fullPath = path.join(refsDir, file)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)
    return {
      slug,
      name: (data as any).name || slug,
      description: (data as any).description || "",
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkill(slug: string): (SkillMeta & { content: string }) | null {
  const skillPath = path.join(skillsDirectory, "SKILL.md")
  if (!fs.existsSync(skillPath)) {
    return null
  }
  const fileContents = fs.readFileSync(skillPath, "utf8")
  const { data, content } = matter(fileContents)
  return {
    slug: "ecash",
    content,
    ...(data as Omit<SkillMeta, "slug">),
  }
}

export function getReference(slug: string): { name: string, content: string } | null {
  const refPath = path.join(skillsDirectory, "references", `${slug}.md`)
  if (!fs.existsSync(refPath)) {
    return null
  }
  const fileContents = fs.readFileSync(refPath, "utf8")
  const { data, content } = matter(fileContents)
  return {
    name: (data as any).name || slug,
    content,
  }
}
