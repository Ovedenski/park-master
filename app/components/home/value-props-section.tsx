import { Container } from "@/components/layout/container";
import { ShieldCheck, Clock, Tag } from "lucide-react";

const PROPS = [
  {
    icon: ShieldCheck,
    title: "Secure & guaranteed",
    description:
      "Every host is verified. Your spot is reserved the moment you book.",
  },
  {
    icon: Clock,
    title: "Flexible by the hour",
    description:
      "Pay only for the time you need. From 15 minutes to a full month.",
  },
  {
    icon: Tag,
    title: "Cheaper than the street",
    description:
      "Skip the search and the parking fines. Locked-in prices, every time.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="bg-surface py-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-3">
          {PROPS.map((p) => (
            <div key={p.title}>
              <p.icon className="size-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
