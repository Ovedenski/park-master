type ListingPageProps = {
  params: {
    listing: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { listing } = params

  // later:
  // const listingData = await getListingBySlug(listing)

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-neutral-500">Listing</p>
        <h1 className="text-3xl font-semibold">{listing}</h1>
        <p className="mt-4 text-neutral-600">
          Render your listing details here.
        </p>
      </div>
    </main>
  )
}