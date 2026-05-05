import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"

export default function AccountPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="My account"
        description="Manage your listings, bookings, and personal details."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active listings" value="4" helper="2 need updates" />
        <StatCard label="Upcoming bookings" value="7" helper="Next check-in tomorrow" />
        <StatCard label="Total earnings" value="€3,240" helper="This month" />
        <StatCard label="Response rate" value="98%" helper="Last 30 days" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="Recent activity"
          description="A quick look at the latest changes across your account."
        >
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
              Your listing “Sea View Loft” was updated 2 hours ago.
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
              A new booking request arrived for May 12–15.
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
              Your payout for April has been processed.
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Next steps"
          description="Keep the account healthy and complete."
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
              Add house rules to 2 listings.
            </li>
            <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
              Complete your profile details.
            </li>
            <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
              Review pending booking requests.
            </li>
          </ul>
        </SectionCard>
      </section>
    </main>
  )
}