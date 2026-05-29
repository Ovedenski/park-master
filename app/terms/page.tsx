import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of ParkMaster.",
};

export default function TermsPage() {
  const lastUpdated = "29 May 2026";

  return (
    <main className="py-12">
      <Container className="max-w-3xl">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Legal
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-neutral mt-10 max-w-none space-y-8 dark:prose-invert">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Acceptance of terms</h2>
            <p className="text-muted-foreground">
              By creating an account or using ParkMaster, you agree to these
              Terms of Service. If you do not agree, please do not use the
              service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. The service</h2>
            <p className="text-muted-foreground">
              ParkMaster is a final-year university project that demonstrates a
              marketplace for hourly and monthly parking-spot rentals.
              ParkMaster connects hosts (who list spots) and guests (who book
              them) but is not itself a party to any rental agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years old and capable of entering into a
              binding contract. By using the service you confirm that you meet
              these requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Accounts</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                You are responsible for keeping your password secure and for all
                activity under your account.
              </li>
              <li>
                You agree to provide accurate information when registering or
                updating your profile.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Listings (hosts)</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                You may only list a parking spot you own or are legally
                authorised to rent.
              </li>
              <li>
                Listings must accurately describe the spot, including its
                address, dimensions, and availability.
              </li>
              <li>
                You set your own prices. Prices are displayed in euro (EUR).
              </li>
              <li>
                You may approve, reject, or cancel reservations according to the
                rules described in our cancellation policy.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Bookings (guests)</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                A booking is confirmed only when the host marks it as approved.
                Pending bookings can be cancelled by either party at any time.
              </li>
              <li>
                Approved bookings can be cancelled by the guest up to 24 hours
                before the check-in time.
              </li>
              <li>
                You agree to use the parking spot only for legal purposes and to
                leave it in the condition you found it.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Payments</h2>
            <p className="text-muted-foreground">
              ParkMaster does not currently process payments. Any payment
              between host and guest is handled outside the platform. In a
              future production version, an integrated payment provider may be
              added.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Prohibited conduct</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>Posting illegal, fraudulent, or misleading listings.</li>
              <li>Attempting to break, probe, or overload the service.</li>
              <li>Harassing other users or violating their privacy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              9. Limitation of liability
            </h2>
            <p className="text-muted-foreground">
              ParkMaster is provided &quot;as is&quot; for educational and
              demonstration purposes, without warranties of any kind. To the
              fullest extent permitted by law, the project author shall not be
              liable for any damages arising out of the use or inability to use
              the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Governing law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the Republic of Bulgaria.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              11. Changes to these terms
            </h2>
            <p className="text-muted-foreground">
              We may revise these terms from time to time. The &quot;Last
              updated&quot; date above reflects the most recent change.
            </p>
          </section>
        </article>
      </Container>
    </main>
  );
}
