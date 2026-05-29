import fs from "fs"
import path from "path"
import matter, { type GrayMatterFile } from "gray-matter"

const skillsRoot = path.join(/*turbopackIgnore: true*/ process.cwd(), "plugins/ecashskill/skills/ecashskill")

export interface FileItem {
  name: string
  type: "file" | "directory"
  path: string
}

export interface FileContent {
  content: string
  data: GrayMatterFile<string>["data"]
}

export interface Breadcrumb {
  name: string
  path: string
}

function normalizeSkillPath(relativePath: string = "") {
  const normalized = path
    .normalize(relativePath)
    .replace(/\\/g, "/")
    .replace(/^(\.\.(\/|$))+/, "")

  return normalized === "." ? "" : normalized.replace(/^\/+/, "")
}

function resolveSkillPath(relativePath: string = "") {
  const safePath = normalizeSkillPath(relativePath)
  const fullPath = path.resolve(skillsRoot, safePath)
  const rootWithSeparator = `${skillsRoot}${path.sep}`

  if (fullPath !== skillsRoot && !fullPath.startsWith(rootWithSeparator)) {
    return null
  }

  return { fullPath, safePath }
}

export function getDirectoryContents(relativePath: string = ""): FileItem[] {
  const resolved = resolveSkillPath(relativePath)
  if (!resolved || !fs.existsSync(resolved.fullPath) || !fs.statSync(resolved.fullPath).isDirectory()) {
    return []
  }

  const items = fs.readdirSync(resolved.fullPath)
  return items
    .filter(name => !name.startsWith("."))
    .map(name => {
      const itemPath = path.join(resolved.fullPath, name)
      const stat = fs.statSync(itemPath)
      return {
        name,
        type: (stat.isDirectory() ? "directory" : "file") as "file" | "directory",
        path: resolved.safePath ? `${resolved.safePath}/${name}` : name,
      }
    })
    .sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

export function getFileContent(relativePath: string): FileContent | null {
  const resolved = resolveSkillPath(relativePath)
  if (!resolved) {
    return null
  }

  if (fs.existsSync(resolved.fullPath) && fs.statSync(resolved.fullPath).isFile()) {
    const fileContents = fs.readFileSync(resolved.fullPath, "utf8")
    const { data, content } = matter(fileContents)
    return { content, data }
  }

  return null
}

export function getBreadcrumbs(relativePath: string): Breadcrumb[] {
  const parts = normalizeSkillPath(relativePath).split("/").filter(Boolean)
  const breadcrumbs: Breadcrumb[] = [{ name: "skills", path: "" }]

  let currentPath = ""
  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part
    breadcrumbs.push({ name: part, path: currentPath })
  }

  return breadcrumbs
}
