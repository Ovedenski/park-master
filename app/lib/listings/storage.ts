import "server-only"

const LISTING_IMAGES_BUCKET = "listings-images"

type UploadListingImageParams = {
  userId: string
  file: File
}

type ReplaceListingImageParams = {
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>
  userId: string
  file: File
  currentImagePath: string | null
}

export async function uploadListingImage(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  { userId, file }: UploadListingImageParams
) {
  if (!file || file.size === 0) {
    return null
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  return filePath
}

export async function removeListingImage(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  imagePath: string | null
) {
  if (!imagePath) return

  const { error } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .remove([imagePath])

  if (error) {
    throw new Error(error.message)
  }
}

export async function replaceListingImage(
  params: ReplaceListingImageParams
) {
  const { supabase, userId, file, currentImagePath } = params

  const nextImagePath = await uploadListingImage(supabase, { userId, file })

  if (currentImagePath) {
    await removeListingImage(supabase, currentImagePath)
  }

  return nextImagePath
}

export function getListingImageUrl(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  imagePath: string | null
) {
  if (!imagePath) return null

  return supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .getPublicUrl(imagePath).data.publicUrl
}