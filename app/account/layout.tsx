import "@/globals.css";
import type { ReactNode } from "react"
import AccountShell from "@/components/account/account-shell"

type AccountLayoutProps = {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <AccountShell>{children}</AccountShell>
}