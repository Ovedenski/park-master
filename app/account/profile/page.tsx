import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import { getCurrentUser } from "@/lib/data/user"
import { updateProfile } from "./actions"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Personal details"
        description="Update your account information, contact details, and hosting preferences."
      />

      <form action={updateProfile} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Basic information"
          description="This information appears across your account."
        >
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={user.firstName}
                  className="w-full rounded-2xl border bg-background px-4 py-3 text-foreground outline-none transition focus:bor"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={user.lastName}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                defaultValue={user.bio}
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
              />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Address"
            description="Used for billing and account verification."
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-foreground">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  defaultValue={user.country}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={user.city}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={user.address}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-foreground outline-none transition focus:border-neutral-400"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Preferences"
            description="Control how you receive updates and booking activity."
          >
            <div className="space-y-4">
              <label className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Booking notifications
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Receive alerts for new reservations and guest messages.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="bookingNotifications"
                  defaultChecked
                  className="mt-1 h-4 w-4"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Marketing emails
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Occasional product tips, feature updates, and insights.
                  </p>
                </div>
                <input type="checkbox" name="marketingEmails" className="mt-1 h-4 w-4" />
              </label>
            </div>
          </SectionCard>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground transition  hover:bg-foreground hover:text-background"
            >
              Save changes
            </button>

            <button
              type="reset"
              className="rounded-full border border-foreground px-5 py-3 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}