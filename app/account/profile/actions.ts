"use server"

import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const updatedUser = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    country: String(formData.get("country") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
  }

  console.log("Updated profile data:", updatedUser)

  revalidatePath("/account/profile")
}