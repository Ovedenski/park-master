import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thdcabwkvqqhenbbnqwm.supabase.co",
      },
    ],
  },
}

export default nextConfig