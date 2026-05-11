import AccountNavLink from "@/components/account/account-nav-link"

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/listings", label: "My listings" },
  { href: "/account/bookings", label: "My bookings" },
  { href: "/account/profile", label: "Profile" },
]

export default function AccountSidebar() {
  return (
    <div className="rounded-3xl border border-border bg-background p-4 shadow-sm">
      <div className="border-b border-border px-3 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          User dashboard
        </h2>
      </div>

      <nav className="mt-4 space-y-2">
        {navItems.map((item) => (
          <AccountNavLink key={item.href} href={item.href}>
            {item.label}
          </AccountNavLink>
        ))}
      </nav>
        <div className="mt-6 border-t border-border pt-4">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}