// import PageHeader from "@/components/account/page-header";
// import SectionCard from "@/components/account/section-card";
// import StatCard from "@/components/account/stat-card";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "My account",
//   description: "Manage your ParkMaster account, listings, and bookings.",
//   robots: { index: false, follow: false }, // private page → don't index
// };

// export default function AccountPage() {
//   return (
//     <main className="space-y-8">
//       <PageHeader
//         eyebrow="Dashboard"
//         title="My account"
//         description="Manage your listings, bookings, and personal details."
//       />

//       <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard label="Active listings" value="4" helper="2 need updates" />
//         <StatCard
//           label="Upcoming bookings"
//           value="7"
//           helper="Next check-in tomorrow"
//         />
//         <StatCard label="Total earnings" value="€3,240" helper="This month" />
//         <StatCard label="Response rate" value="98%" helper="Last 30 days" />
//       </section>

//       <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
//         <SectionCard
//           title="Recent activity"
//           description="A quick look at the latest changes across your account."
//         >
//           <div className="space-y-4 text-sm text-muted-foreground">
//             <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               Your listing “Sea View Loft” was updated 2 hours ago.
//             </div>
//             <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               A new booking request arrived for May 12–15.
//             </div>
//             <div className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               Your payout for April has been processed.
//             </div>
//           </div>
//         </SectionCard>

//         <SectionCard
//           title="Next steps"
//           description="Keep the account healthy and complete."
//         >
//           <ul className="space-y-3 text-sm text-muted-foreground">
//             <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               Add house rules to 2 listings.
//             </li>
//             <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               Complete your profile details.
//             </li>
//             <li className="rounded-2xl border border-border bg-background p-4 text-foreground">
//               Review pending booking requests.
//             </li>
//           </ul>
//         </SectionCard>
//       </section>
//     </main>
//   );
// }

import Link from "next/link";
import PageHeader from "@/components/account/page-header";
import SectionCard from "@/components/account/section-card";
import StatCard from "@/components/account/stat-card";
import StatusBadge from "@/components/account/status-badge";
import EmptyState from "@/components/account/empty-state";
import { getAccountOverview } from "@/lib/data/account";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your ParkMaster account, listings, and bookings.",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("bg-BG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatCheckIn(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export default async function AccountPage() {
  const overview = await getAccountOverview();

  // Conditional "Next steps" — only suggestions that match the real state.
  const suggestions: { key: string; href: string; label: string }[] = [];

  if (overview.pendingReservationCount > 0) {
    suggestions.push({
      key: "pending",
      href: "/account/bookings?view=host",
      label: `Review ${overview.pendingReservationCount} pending reservation${
        overview.pendingReservationCount === 1 ? "" : "s"
      }`,
    });
  }

  if (overview.activeListingCount === 0) {
    suggestions.push({
      key: "first-listing",
      href: "/list-spot",
      label: "Create your first listing",
    });
  }

  if (overview.upcomingBookingCount === 0) {
    suggestions.push({
      key: "browse-listings",
      href: "/listings",
      label: "Find a parking spot to book",
    });
  }

  suggestions.push({
    key: "profile",
    href: "/account/profile",
    label: "Keep your profile details up to date",
  });

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="My account"
        description="Manage your listings, bookings, and personal details."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active listings"
          value={String(overview.activeListingCount)}
          helper="Currently visible to guests"
        />
        <StatCard
          label="Upcoming reservations"
          value={String(overview.upcomingReservationCount)}
          helper="Approved bookings on your listings"
        />
        <StatCard
          label="Pending reservations"
          value={String(overview.pendingReservationCount)}
          helper="Awaiting your approval"
        />
        <StatCard
          label="My upcoming bookings"
          value={String(overview.upcomingBookingCount)}
          helper="Spots you've reserved as a guest"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="Recent activity"
          description="The latest bookings and reservations involving your account."
        >
          {overview.recentActivity.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="When you list a spot or book one, recent activity will show up here."
            />
          ) : (
            <ul className="space-y-3">
              {overview.recentActivity.map((item) => {
                const detailHref =
                  item.role === "host"
                    ? `/account/reservations/${item.id}`
                    : `/account/bookings/${item.id}`;

                return (
                  <li key={`${item.role}-${item.id}`}>
                    <Link
                      href={detailHref}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-foreground/20"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {item.listingTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.role === "host"
                            ? `Reservation from ${item.guestName}`
                            : `Your booking · ${item.guestName}`}{" "}
                          · check-in {formatCheckIn(item.checkIn)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Next steps"
          description="Personalised suggestions based on your current state."
        >
          <ul className="space-y-3 text-sm">
            {suggestions.map((s) => (
              <li
                key={s.key}
                className="rounded-2xl border border-border bg-background p-4 text-foreground"
              >
                <Link href={s.href} className="font-medium hover:underline">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>
    </main>
  );
}