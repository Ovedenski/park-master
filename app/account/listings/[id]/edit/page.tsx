import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/listings/listing-form";
import { updateListing } from "../../actions";
import { getListingImageUrl } from "@/lib/listings/storage";
import { initialListingFormState } from "@/lib/listings/form-state";
import { narrowListingRow } from "@/lib/listings/normalize";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to edit your listing");
  }

  const { data: row, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("host_id", user.id)
    .single();

  if (error || !row) {
    notFound();
  }

  const currentImageUrl = getListingImageUrl(supabase, row.image_path);

  const listing = narrowListingRow(row, currentImageUrl);

  const boundUpdateListing = updateListing.bind(
    null,
    listing.id,
    listing.image_path,
  );

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <p className="text-sm text-muted-foreground">Host dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Edit listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your parking spot details, pricing, and availability.
        </p>
      </div>

      <ListingForm
        action={boundUpdateListing}
        initialState={initialListingFormState}
        submitLabel="Save changes"
        listing={listing}
        currentImageUrl={currentImageUrl}
        userEmail={user.email}
      />
    </main>
  );
}
