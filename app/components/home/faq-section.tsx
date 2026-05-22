import { Container } from "@/components/layout/container";

const FAQS = [
  {
    q: "How do I book a parking spot?",
    a: "Search for a location, pick a spot you like, choose your date and time, and confirm. You'll get an instant confirmation with directions.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes — you can cancel any booking that hasn't started yet from your account page.",
  },
  {
    q: "How much does it cost to list my spot?",
    a: "Listing is completely free. You only pay when you receive a booking — and you keep the majority of the rental fee.",
  },
  {
    q: "Is my spot insured while it's rented?",
    a: "Hosts are responsible for verifying their property is suitable for rental. ParkMaster does not provide insurance — please check with your provider.",
  },
  {
    q: "Can I rent monthly?",
    a: "Absolutely. Many of our hosts offer monthly rentals at a discounted rate compared to the hourly equivalent.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border bg-card p-5 transition hover:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
                <span>{faq.q}</span>
                <span className="text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
