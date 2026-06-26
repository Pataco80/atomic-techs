import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  // `cacheComponents` (Next 16 Dynamic IO) is intentionally OFF: it corrupts
  // next-safe-action's result serialization (serverError becomes a client
  // reference), breaking EVERY server action's error path — including the public
  // contact action. Nothing here uses `"use cache"`, so there is no loss.
  typedRoutes: true,
  images: {
    remotePatterns: [
      // Project / avatar images uploaded via Vercel Blob (Spec 02 upload field).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
