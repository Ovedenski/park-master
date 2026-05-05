import Link from "next/link"

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b bg-background pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-full bg-background px-5 py-3 text-sm font-medium text-background transition hover:bg-neutral-800"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}