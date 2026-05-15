"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { parseListingFormData } from "@/lib/listings/form"
import {
  removeListingImage,
  replaceListingImage,
} from "@/lib/listings/storage"
import type { ListingFormState } from "@/lib/types"

export async function updateListing(
  listingId: string,
  currentImagePath: string | null,
  prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?message=Please log in first")
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
    let nextImagePath = currentImagePath

    if (parsed.data.removeImage && currentImagePath) {
      await removeListingImage(supabase, currentImagePath)
      nextImagePath = null
    }

    if (parsed.data.image && parsed.data.image.size > 0) {
      nextImagePath = await replaceListingImage({
        supabase,
        userId: user.id,
        file: parsed.data.image,
        currentImagePath: nextImagePath,
      })
    }

    const { image, removeImage, ...listingPayload } = parsed.data

    const { error } = await supabase
      .from("listings")
      .update({
        ...listingPayload,
        image_path: nextImagePath,
      })
      .eq("id", listingId)
      .eq("host_id", user.id)

    if (error) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {},
        values: parsed.values,
      }
    }

    revalidatePath("/account/listings")
    revalidatePath(`/account/listings/${listingId}/edit`)
    revalidatePath(`/listings/${listingId}`)
  } catch {
    return {
      success: false,
      message: "Something went wrong while saving the listing.",
      fieldErrors: {},
      values: parsed.values,
    }
  }

  revalidatePath("/listings");
  redirect("/account/listings")
  
}

export async function deleteListing(listingId: string, imagePath: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?message=Please log in first")
  }

  if (imagePath) {
    await removeListingImage(supabase, imagePath)
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("host_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/account/listings")
  revalidatePath("/listings");

}