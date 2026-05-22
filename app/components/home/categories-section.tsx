import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Home, Building2, Landmark } from "lucide-react";

const CATEGORIES = [
  {
    icon: Home,
    label: "Residential",
    description: "Private driveways and household garages.",
    href: "/listings?category=residential",
  },
  {
    icon: Building2,
    label: "Commercial",
    description: "Office buildings, mall garages, business lots.",
    href: "/listings?category=commercial",
  },
  {
    icon: Landmark,
    label: "Public",
    description: "Public parking lots and curbside spots.",
    href: "/listings?category=public",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-surface py-20">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Browse by category
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Find the right type of spot for your needs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group rounded-2xl border bg-card p-8 transition hover:border-primary/40 hover:shadow-md"
            >
              <cat.icon className="size-10 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{cat.label}</h3>
              <p className="mt-2 text-muted-foreground">{cat.description}</p>
              <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
                Browse {cat.label.toLowerCase()} →
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
