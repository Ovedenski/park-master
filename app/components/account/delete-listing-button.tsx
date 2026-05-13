"use client"

import { useFormStatus } from "react-dom"

export default function DeleteListingButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      onClick={(event) => {
        if (pending) return

        const confirmed = window.confirm(
          "Delete this listing permanently?"
        )

        if (!confirmed) {
          event.preventDefault()
        }
      }}
      disabled={pending}
      className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}