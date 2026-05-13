"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ListingForm from "@/components/listings/listing-form"
import { createSpot } from "@/list-spot/actions"
import { initialListingFormState } from "@/lib/listings/form-state"

export default async function ListSpotPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <p className="text-sm text-muted-foreground">Host dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">List your parking spot</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a parking listing available by the hour, by the month, or both.
        </p>
      </div>

      <ListingForm
        action={createSpot}
        initialState={initialListingFormState}
        submitLabel="Create listing"
        userEmail={user.email}
      />
    </main>
  )
}