import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?message=Please log in to view your profile")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return {
    id: user.id,
    email: user.email ?? profile.email ?? "",
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    country: profile.country ?? "",
    city: profile.city ?? "",
    address: profile.address ?? "",
    bookingNotifications: profile.booking_notifications ?? true,
    marketingEmails: profile.marketing_emails ?? false,
    avatarUrl: profile.avatar_url ?? "",
  }
}