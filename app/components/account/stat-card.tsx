type StatCardProps = {
  label: string
  value: string
  helper?: string
}

export default function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-3xl border-bg-background p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
    </div>
  )
}