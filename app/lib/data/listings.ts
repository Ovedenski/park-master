import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { MyListing } from "@/lib/types"
import { getListingImageUrl } from "@/lib/listings/storage"

export async function getMyListings(): Promise<MyListing[]> {
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

  return (data ?? []).map((listing) => ({
    ...listing,
    available_days: listing.available_days ?? [],
    image_url: getListingImageUrl(supabase, listing.image_path),
  }))
}

export async function getAllListings(): Promise<MyListing[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((listing) => ({
    ...listing,
    available_days: listing.available_days ?? [],
    image_url: getListingImageUrl(supabase, listing.image_path),
  }))
}