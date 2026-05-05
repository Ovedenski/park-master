import type { ReactNode } from "react"
import AccountSidebar from "@/components/account/account-sidebar"
import MobileAccountNav from "@/components/account/mobile-account-nav"

type AccountShellProps = {
  children: ReactNode
}

export default function AccountShell({ children }: AccountShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24">
            <AccountSidebar />
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="lg:hidden">
            <MobileAccountNav />
          </div>

          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}