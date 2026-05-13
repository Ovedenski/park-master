"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { parseListingFormData } from "@/lib/listings/form"
import { uploadListingImage } from "@/lib/listings/storage"
import type { ListingFormState } from "@/lib/types"

export async function createSpot(
  prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const parsed = parseListingFormData(formData)

  if (!parsed.ok) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    }
  }

  try {
    const imagePath =
      parsed.data.image && parsed.data.image.size > 0
        ? await uploadListingImage(supabase, {
            userId: user.id,
            file: parsed.data.image,
          })
        : null

    const { image, removeImage, ...listingPayload } = parsed.data

    const { error } = await supabase.from("listings").insert({
      host_id: user.id,
      ...listingPayload,
      image_path: imagePath,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {},
        values: parsed.values,
      }
    }
  } catch {
    return {
      success: false,
      message: "Something went wrong while creating the listing.",
      fieldErrors: {},
      values: parsed.values,
    }
  }

  redirect("/account/listings")
}