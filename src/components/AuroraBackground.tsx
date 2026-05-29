"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface AuroraBackgroundProps {
  className?: string
  showRadialGradient?: boolean
}

export function AuroraBackground({
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-20 pointer-events-none overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "absolute -inset-[10px] opacity-50 blur-[10px] will-change-transform animate-aurora",
          showRadialGradient &&
            "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
        )}
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%)," +
            "repeating-linear-gradient(100deg,#14b8a6 10%,#fde68a 15%,#7dd3fc 20%,#f9a8d4 25%,#86efac 30%)",
          backgroundSize: "300%, 200%",
          backgroundPosition: "50% 50%, 50% 50%",
        }}
      />
    </div>
  )
}
