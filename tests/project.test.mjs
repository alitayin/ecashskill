import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import matter from "gray-matter"

const root = process.cwd()
const skillRoot = path.join(root, "plugins/ecashskill/skills/ecashskill")
const referencesRoot = path.join(skillRoot, "references")

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))
}

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return walkFiles(fullPath)
    }
    return [fullPath]
  })
}

function readMatter(filePath) {
  return matter(fs.readFileSync(filePath, "utf8"))
}

test("version values stay in sync across app and plugin metadata", () => {
  const pkg = readJson("package.json")
  const plugin = readJson("plugins/ecashskill/.claude-plugin/plugin.json")
  const rootVersion = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim()
  const pluginVersion = fs.readFileSync(path.join(root, "plugins/ecashskill/VERSION"), "utf8").trim()
  const skill = readMatter(path.join(skillRoot, "SKILL.md"))

  assert.match(pkg.version, /^\d+\.\d+\.\d+$/)
  assert.equal(rootVersion, pkg.version)
  assert.equal(pluginVersion, pkg.version)
  assert.equal(plugin.version, pkg.version)
  assert.equal(skill.data.version, pkg.version)
})

test("all reference documents have complete frontmatter", () => {
  const referenceFiles = walkFiles(referencesRoot).filter((file) => file.endsWith(".md"))

  assert.ok(referenceFiles.length >= 12)

  for (const file of referenceFiles) {
    const { data, content } = readMatter(file)
    assert.equal(typeof data.name, "string", `${file} missing name`)
    assert.ok(data.name.length > 0, `${file} has empty name`)
    assert.equal(typeof data.description, "string", `${file} missing description`)
    assert.ok(data.description.length > 0, `${file} has empty description`)
    assert.match(String(data.version), /^\d+\.\d+\.\d+$/, `${file} missing semver version`)
    assert.ok(Array.isArray(data.tags), `${file} missing tags`)
    assert.ok(data.tags.length > 0, `${file} must have at least one tag`)
    assert.match(content, /^# /m, `${file} missing h1`)
  }
})

test("navigation rejects path traversal and only exposes skill files", () => {
  const navigationSource = fs.readFileSync(path.join(root, "src/lib/navigation.ts"), "utf8")

  assert.match(navigationSource, /normalizeSkillPath/)
  assert.doesNotMatch(navigationSource, /data:\s*any/)
  assert.doesNotMatch(navigationSource, /path\.join\(skillsRoot,\s*relativePath\)/)
})

test("repository does not ship macOS metadata files", () => {
  const generatedDirs = new Set([".git", ".next", "node_modules"])
  const unwanted = walkFiles(root).filter((file) => {
    const relative = path.relative(root, file)
    return !relative.split(path.sep).some((part) => generatedDirs.has(part)) && path.basename(file) === ".DS_Store"
  })

  assert.deepEqual(unwanted, [])
})
