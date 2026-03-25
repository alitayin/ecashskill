"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SkillCategory } from "@/lib/navigation"

interface SidebarClientProps {
  categories: SkillCategory[]
}

export function SidebarClient({ categories }: SidebarClientProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-card h-screen sticky top-0">
        <SidebarContent categories={categories} pathname={pathname} onLinkClick={() => {}} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 md:hidden" />
          }
        >
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            categories={categories}
            pathname={pathname}
            onLinkClick={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarContent({
  categories,
  pathname,
  onLinkClick,
}: {
  categories: SkillCategory[]
  pathname: string
  onLinkClick: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b">
        <h2 className="text-lg font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">eCash 开发指南</p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4">
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                {category.name}
              </h3>
              <ul className="space-y-1">
                {category.skills.map((skill) => {
                  const href = `/skills/${skill.slug}`
                  const isActive = pathname === href
                  return (
                    <li key={skill.slug}>
                      <Link
                        href={href}
                        onClick={onLinkClick}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {skill.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
