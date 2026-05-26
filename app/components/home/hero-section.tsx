import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-image-v2.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Soft overlay so text is always readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80 dark:from-background/85 dark:via-background/60 dark:to-background/90"
      />

      {/* Content */}
      <Container className="relative z-10 py-20 text-center md:py-28">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by drivers across Bulgaria
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Find a parking spot
          <span className="block text-muted-foreground">wherever you go.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Hourly or monthly. Reserved before you arrive. Cheaper than the
          street.
        </p>

        <form
          action="/listings"
          method="get"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border bg-card/95 p-2 shadow-lg backdrop-blur sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="text"
              name="q"
              placeholder="Where are you going? e.g. Sofia, Lozenets"
              className="w-full rounded-xl bg-transparent px-12 py-3 text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="lg" className="sm:w-auto">
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          <span className="text-muted-foreground">Popular:</span>
          <Link
            href="/listings?q=Sofia"
            className="rounded-full border bg-card/80 px-3 py-1 backdrop-blur hover:bg-accent"
          >
            Sofia
          </Link>
          <Link
            href="/listings?q=Plovdiv"
            className="rounded-full border bg-card/80 px-3 py-1 backdrop-blur hover:bg-accent"
          >
            Plovdiv
          </Link>
          <Link
            href="/listings?q=Varna"
            className="rounded-full border bg-card/80 px-3 py-1 backdrop-blur hover:bg-accent"
          >
            Varna
          </Link>
          <Link
            href="/listings?q=Burgas"
            className="rounded-full border bg-card/80 px-3 py-1 backdrop-blur hover:bg-accent"
          >
            Burgas
          </Link>
        </div>
      </Container>
    </section>
  );
}
