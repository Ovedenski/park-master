"use client";
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as React from "react";

export default function HomePage() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <h1 className="text-6xl font-bold">Welcome to Home Page!</h1>
    // </main>

    <main>
      {/* Hero */}
      <section className="py-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Rent Out Your Parking Spot Easily
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your unused parking space into income. List it in minutes and
            connect with drivers nearby.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/create">
              <Button size="lg">List Your Spot</Button>
            </Link>

            <Link href="/listings">
              <Button variant="outline" size="lg">
                Browse Spots
              </Button>
            </Link>
          </div>
        </Container>
      </section>

{/* 
      <section className="py-20">
  <Container>
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-semibold">
        Available Spots
      </h2>

      <Link href="/listings">
        <Button variant="ghost">View All</Button>
      </Link>
    </div>

    <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      { Mock Cards }
      <div className="border rounded-xl p-6">
        <h3 className="font-medium">Downtown Garage</h3>
        <p className="text-muted-foreground mt-2">
          $8 / hour
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h3 className="font-medium">Private Driveway</h3>
        <p className="text-muted-foreground mt-2">
          $5 / hour
        </p>
      </div>
    </div>
  </Container>
</section>
 */}

    <section className="py-24 bg-primary text-primary-foreground">
  <Container className="text-center">
    <h2 className="text-3xl md:text-4xl font-semibold">
      Start Earning From Your Parking Spot Today
    </h2>

    <p className="mt-4 text-lg opacity-90">
      It takes less than 5 minutes to list your space.
    </p>

    <div className="mt-8">
      <Link href="/create">
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
