import { getSkillsByCategory } from "@/lib/navigation"
import { SidebarClient } from "./SidebarClient"

export function Sidebar() {
  const categories = getSkillsByCategory()
  return <SidebarClient categories={categories} />
}
