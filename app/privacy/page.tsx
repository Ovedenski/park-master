import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ParkMaster collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const lastUpdated = "29 May 2026";

  return (
    <main className="py-12">
      <Container className="max-w-3xl">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Legal
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-neutral mt-10 max-w-none space-y-8 dark:prose-invert">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              ParkMaster (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
              a marketplace for renting private parking spots. This Privacy
              Policy explains what personal information we collect when you use
              our service, how we use it, and the choices you have. ParkMaster
              is a final-year university project and is provided for educational
              and demonstration purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Information we collect</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Account data:</strong> your
                email address and authentication credentials (handled by
                Supabase Auth).
              </li>
              <li>
                <strong className="text-foreground">Profile data:</strong> any
                details you choose to provide on your profile page.
              </li>
              <li>
                <strong className="text-foreground">Listing data:</strong>{" "}
                addresses, descriptions, photos, and prices of the parking spots
                you list.
              </li>
              <li>
                <strong className="text-foreground">Booking data:</strong>{" "}
                reservation dates, guest names, totals, and status history.
              </li>
              <li>
                <strong className="text-foreground">Technical data:</strong> IP
                address, browser type, and basic usage logs created by Next.js
                and Supabase for security and performance.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              3. How we use your information
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>To provide the booking and listing service.</li>
              <li>To authenticate you and keep your account secure.</li>
              <li>
                To show your listings to potential guests and to show your
                reservations to the hosts you book with.
              </li>
              <li>To diagnose errors and improve the application.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Where data is stored</h2>
            <p className="text-muted-foreground">
              All personal data, listings, and bookings are stored in a Supabase
              project hosted in the European Union. Uploaded photos are stored
              in Supabase Storage. We do not transfer your data outside the EU.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Sharing your data</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. Booking details are
              visible to the host of the listing you reserved (or, for hosts, to
              the guest who booked your listing). We do not share data with
              advertisers or third-party analytics providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Your rights (GDPR)</h2>
            <p className="text-muted-foreground">
              Under the EU General Data Protection Regulation you have the right
              to access, correct, delete, or export your personal data. To
              exercise any of these rights, please use the contact details at
              the bottom of the home page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Cookies</h2>
            <p className="text-muted-foreground">
              ParkMaster uses only strictly necessary cookies to keep you signed
              in and to remember your theme preference. We do not use
              third-party tracking or advertising cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Changes to this policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. When we do,
              we will update the &quot;Last updated&quot; date above.
            </p>
          </section>
        </article>
      </Container>
    </main>
  );
}
