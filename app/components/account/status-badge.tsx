import clsx from "clsx"

type Status = "active" | "draft" | "booked" | "pending" | "cancelled"

type StatusBadgeProps = {
  status: Status
}

const statusStyles: Record<Status, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  booked: "bg-blue-100 text-blue-700",
  pending: "bg-violet-100 text-violet-700",
  cancelled: "bg-rose-100 text-rose-700",
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  )
}