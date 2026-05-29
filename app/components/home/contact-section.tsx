import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-muted/30 py-20"
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Get in touch
          </p>
          <h2
            id="contact-heading"
            className="mt-2 text-3xl font-semibold md:text-4xl"
          >
            Have a question? We&apos;re here to help.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you&apos;re looking for a spot or thinking of listing one,
            drop us a line and we&apos;ll get back to you as soon as we can.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
            <Mail className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="mt-4 text-base font-semibold">Email us</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Replies usually within 24 hours.
            </p>
            <Link
              href="mailto:info@parkmaster.com"
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              info@parkmaster.com
            </Link>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
            <MapPin className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="mt-4 text-base font-semibold">Find us</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sofia, Bulgaria
            </p>
            <p className="text-sm text-muted-foreground">
              Operating across Sofia-Capital
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
            <Clock className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="mt-4 text-base font-semibold">Support hours</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Mon – Fri · 09:00 – 18:00 EEST
            </p>
            <p className="text-sm text-muted-foreground">
              Weekend replies may be delayed.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
