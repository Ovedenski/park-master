import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function getMyListings() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?message=Please log in to view your listings")
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}