import fs from "fs"
import path from "path"
import matter from "gray-matter"

const skillsRoot = path.join(process.cwd(), "plugins/ecash/skills/ecash")

export interface FileItem {
  name: string
  type: "file" | "directory"
  path: string
}

export function getDirectoryContents(relativePath: string = ""): FileItem[] {
  const fullPath = path.join(skillsRoot, relativePath)
  if (!fs.existsSync(fullPath)) {
    return []
  }

  const items = fs.readdirSync(fullPath)
  return items
    .filter(name => !name.startsWith("."))
    .map(name => {
      const itemPath = path.join(fullPath, name)
      const stat = fs.statSync(itemPath)
      return {
        name,
        type: (stat.isDirectory() ? "directory" : "file") as "file" | "directory",
        path: relativePath ? `${relativePath}/${name}` : name,
      }
    })
    .sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

export function getFileContent(relativePath: string): { content: string; data: any } | null {
  // Handle both /skills/ecash/SKILL.md and SKILL.md paths
  let fullPath = relativePath

  // If path doesn't start with ecash/, try adding it
  if (!fullPath.startsWith("ecash")) {
    fullPath = path.join(skillsRoot, relativePath)
  } else {
    fullPath = path.join(skillsRoot, relativePath.replace("skills/ecash/", ""))
  }

  // Also try the direct path
  const directPath = path.join(skillsRoot, relativePath)
  const tryPaths = [fullPath, directPath, path.join(skillsRoot, "ecash", relativePath)]

  for (const tryPath of tryPaths) {
    if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) {
      const fileContents = fs.readFileSync(tryPath, "utf8")
      const { data, content } = matter(fileContents)
      return { content, data }
    }
  }

  return null
}

export function getBreadcrumbs(relativePath: string) {
  const parts = relativePath.split("/").filter(Boolean)
  const breadcrumbs = [{ name: "ecash", path: "" }]

  let currentPath = ""
  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part
    breadcrumbs.push({ name: part, path: currentPath })
  }

  return breadcrumbs
}
