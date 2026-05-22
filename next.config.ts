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

module.exports = {
  images: {
    qualities: [25, 50, 75, 90],
  },
};