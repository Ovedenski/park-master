"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const payload = {
    id: user.id,
    email: String(formData.get("email") ?? "").trim(),
    first_name: String(formData.get("firstName") ?? "").trim(),
    last_name: String(formData.get("lastName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    country: String(formData.get("country") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    booking_notifications: formData.get("bookingNotifications") === "on",
    marketing_emails: formData.get("marketingEmails") === "on",
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("profiles").upsert(payload)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/account/profile")
}