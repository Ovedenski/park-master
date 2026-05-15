"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function BookingsViewTabs() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") === "host" ? "host" : "mine";

  return (
    <div className="inline-flex rounded-full border border-border bg-muted p-1">
      <Link
        href="/account/bookings?view=mine"
        className={clsx(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          activeView === "mine"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        My bookings
      </Link>

      <Link
        href="/account/bookings?view=host"
        className={clsx(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          activeView === "host"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Reservations on my listings
      </Link>
    </div>
  );
}
