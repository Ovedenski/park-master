"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "./components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Welcome to Home Page!</h1>

      {/* <section className="py-24 bg-primary text-primary-foreground">
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
      </section> */}
      {/* PLan na homePage-a
    1. Navbar 
    2. Image section with cathy phrase and a CTA button (moje da e filtyr napravo da tursi za naselenoto mqsto) 
    3. Na kratko za platformata (otdavai pod naem , vzemai pod naem , za ralzichni chasove i parkingni na magazini- glavnata ideq
      da se integrirat parkingi na golemi magazini za sled rabotno vreme)
    4. List if categories of the parking spots
    5. Testimonials 
    6. Footer Navbar ( menu byrzi vruzki, menu Privacy Policy, menu contati )
    7. CopyRight */}
    </main>
  );
}
