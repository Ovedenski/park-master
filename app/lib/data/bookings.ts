import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function getMyBookings() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

   if (userError || !user) {
    redirect("/login?message=Please log in to view your bookings")
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, listings(title)")
    .eq("user_id", user.id)
    .order("check_in", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}