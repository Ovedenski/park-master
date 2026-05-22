import { Container } from "@/components/layout/container";
import { Search, CalendarCheck, Car } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Look",
    description:
      "Search and compare prices at parking spots near your destination.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description:
      "Reserve your spot in seconds. Pay securely and get instant confirmation.",
  },
  {
    icon: Car,
    title: "Park",
    description:
      "Show up at the address, follow the instructions, and you're parked.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Three simple steps from search to parked.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-card p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="size-6" />
              </div>
              <div className="mt-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Step {idx + 1}
              </div>
              <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
