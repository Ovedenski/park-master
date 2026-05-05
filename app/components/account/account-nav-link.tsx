"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import clsx from "clsx"

type AccountNavLinkProps = {
  href: string
  children: ReactNode
}

export default function AccountNavLink({
  href,
  children,
}: AccountNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center  rounded-2xl px-4 py-3 text-sm font-medium transition",
        isActive
          ? "bg-foreground text-background"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      {children}
    </Link>
  )
}