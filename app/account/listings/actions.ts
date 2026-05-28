"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { parseListingFormData } from "@/lib/listings/form"
import {
  removeListingImage,
  uploadListingImage,
} from "@/lib/listings/storage"
import type { ListingFormState } from "@/lib/types"

export async function updateListing(
  listingId: string,
  currentImagePath: string | null,
  prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in first");
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

  // Plan the image change without touching storage yet, so we can roll back
  // cleanly if the DB update fails.
  //
  // - `newlyUploadedPath`  : a file we just put in storage; delete on failure.
  // - `pathToDeleteOnOk`   : the OLD file we replaced; delete on success only.
  // - `nextImagePath`      : what the DB row's image_path will become.
  let newlyUploadedPath: string | null = null;
  let pathToDeleteOnOk: string | null = null;
  let nextImagePath: string | null = currentImagePath;

  try {
    if (parsed.data.image && parsed.data.image.size > 0) {
      // New file uploaded → replaces whatever was there.
      newlyUploadedPath = await uploadListingImage(supabase, {
        userId: user.id,
        file: parsed.data.image,
      });
      pathToDeleteOnOk = currentImagePath;
      nextImagePath = newlyUploadedPath;
    } else if (parsed.data.removeImage && currentImagePath) {
      // No replacement, just removing the existing one.
      pathToDeleteOnOk = currentImagePath;
      nextImagePath = null;
    }

    const { image, removeImage, ...listingPayload } = parsed.data;

    const { error } = await supabase
      .from("listings")
      .update({
        ...listingPayload,
        image_path: nextImagePath,
      })
      .eq("id", listingId)
      .eq("host_id", user.id);

    if (error) {
      // DB rejected the update — roll back the freshly uploaded file.
      if (newlyUploadedPath) {
        await removeListingImage(supabase, newlyUploadedPath).catch(() => {
          // Best-effort cleanup.
        });
      }
      return {
        success: false,
        message: error.message,
        fieldErrors: {},
        values: parsed.values,
      };
    }

    // DB write succeeded — now it's safe to delete the old file.
    if (pathToDeleteOnOk) {
      await removeListingImage(supabase, pathToDeleteOnOk).catch(() => {
        // Old file delete is best-effort. The DB row no longer references it,
        // so worst case it becomes orphaned. Logging would be next step in prod.
      });
    }

    revalidatePath("/account/listings");
    revalidatePath(`/account/listings/${listingId}/edit`);
    revalidatePath(`/listings/${listingId}`);
  } catch {
    // Either the upload or something else threw. Roll back the new upload.
    if (newlyUploadedPath) {
      await removeListingImage(supabase, newlyUploadedPath).catch(() => {
        // Best-effort cleanup.
      });
    }
    return {
      success: false,
      message: "Something went wrong while saving the listing.",
      fieldErrors: {},
      values: parsed.values,
    };
  }

  revalidatePath("/listings");
  redirect("/account/listings");
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