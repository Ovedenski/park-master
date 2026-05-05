import Link from "next/link"

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/listings", label: "Listings" },
  { href: "/account/bookings", label: "Bookings" },
  { href: "/account/profile", label: "Profile" },
]

export default function MobileAccountNav() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}