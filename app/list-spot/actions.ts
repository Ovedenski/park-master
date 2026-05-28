"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { parseListingFormData } from "@/lib/listings/form"
import { removeListingImage, uploadListingImage } from "@/lib/listings/storage";
import type { ListingFormState } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function createSpot(
  prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const parsed = parseListingFormData(formData);

  if (!parsed.ok) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    };
  }

  // Track the uploaded image path separately so we can clean it up if the DB
  // insert fails — otherwise the file would orphan in Supabase Storage forever.
  let uploadedImagePath: string | null = null;

  try {
    uploadedImagePath =
      parsed.data.image && parsed.data.image.size > 0
        ? await uploadListingImage(supabase, {
            userId: user.id,
            file: parsed.data.image,
          })
        : null;

    const { image, removeImage, ...listingPayload } = parsed.data;

    const { error } = await supabase.from("listings").insert({
      host_id: user.id,
      ...listingPayload,
      image_path: uploadedImagePath,
    });

    if (error) {
      // DB rejected the insert — roll back the orphaned upload.
      if (uploadedImagePath) {
        await removeListingImage(supabase, uploadedImagePath).catch(() => {
          // Best-effort cleanup. If it fails we've already lost the DB row,
          // logging would be the next step in a real environment.
        });
      }
      return {
        success: false,
        message: error.message,
        fieldErrors: {},
        values: parsed.values,
      };
    }
  } catch {
    // Either the upload or the insert threw. Same cleanup logic.
    if (uploadedImagePath) {
      await removeListingImage(supabase, uploadedImagePath).catch(() => {
        // Best-effort cleanup.
      });
    }
    return {
      success: false,
      message: "Something went wrong while creating the listing.",
      fieldErrors: {},
      values: parsed.values,
    };
  }
  revalidatePath("/listings");
  redirect("/account/listings");
}