import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getListingImageUrl } from "@/lib/listings/storage"
import type { Listing } from "@/lib/types";
import { narrowListingRow } from "../listings/normalize";


export async function getMyListings(): Promise<Listing[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to view your listings");
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    narrowListingRow(
      row,
      row.image_path
        ? supabase.storage.from("listings-images").getPublicUrl(row.image_path)
            .data.publicUrl
        : null,
    ),
  );
}

export async function getAllListings(): Promise<Listing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    narrowListingRow(
      row,
      row.image_path
        ? supabase.storage.from("listings-images").getPublicUrl(row.image_path)
            .data.publicUrl
        : null,
    ),
  );
}