import type { ReactNode } from "react"

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  )
}