import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function HostCtaSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-10 rounded-3xl border bg-card p-10 shadow-sm md:grid-cols-2 md:p-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              For hosts
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Earn from your unused parking spot
            </h2>
            <p className="mt-4 text-muted-foreground">
              Got a driveway, garage, or business lot sitting empty? Turn it
              into passive income — list it in less than 5 minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/list-spot">
                <Button size="lg">List Your Spot</Button>
              </Link>
              <Link href="/listings">
                <Button size="lg" variant="outline">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>

          <ul className="space-y-4 text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
              <span>
                <span className="font-medium text-foreground">
                  You set the price.
                </span>{" "}
                Hourly, monthly, or both.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
              <span>
                <span className="font-medium text-foreground">
                  You set the schedule.
                </span>{" "}
                Choose which days and hours you accept bookings.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
              <span>
                <span className="font-medium text-foreground">
                  No commitment.
                </span>{" "}
                Pause or delete your listing any time.
              </span>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
