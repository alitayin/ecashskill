"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode
  showRadialGradient?: boolean
  invert?: boolean
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
  invert = false,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-bg",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          cn("absolute -inset-[10px] opacity-50 blur-[10px] will-change-transform animate-aurora", invert && "invert dark:invert-0"),
          showRadialGradient &&
            "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
        )}
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%)," +
            "repeating-linear-gradient(100deg,#3b82f6 10%,#a5b4fc 15%,#93c5fd 20%,#ddd6fe 25%,#60a5fa 30%)",
          backgroundSize: "300%, 200%",
          backgroundPosition: "50% 50%, 50% 50%",
        }}
      />
      {children}
    </div>
  )
}
