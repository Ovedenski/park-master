// app/page.tsx
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getAllListings } from "@/lib/data/listings";

import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedSpotsSection } from "@/components/home/featured-spots-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { HostCtaSection } from "@/components/home/host-cta-section";
import { FaqSection } from "@/components/home/faq-section";

export default async function HomePage() {
  const allListings = await getAllListings();
  const featured = allListings.slice(0, 6);

  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <CategoriesSection />
      <FeaturedSpotsSection listings={featured} />
      <ValuePropsSection />
      <HostCtaSection />
      <FaqSection />

      {/* Final CTA — keep the closer punchy */}
      <section className="bg-primary py-24 text-primary-foreground">
        <Container className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Start earning from your parking spot today
          </h2>
          <p className="mt-4 text-lg opacity-90">
            It takes less than 5 minutes to list your space.
          </p>
          <div className="mt-8">
            <Link href="/list-spot">
              <Button size="lg" variant="secondary">
                List Your Spot
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
