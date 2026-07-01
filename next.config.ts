import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    // Les Server Actions plafonnent le body à 1 Mo par défaut. Les uploads
    // d'images passent par une Server Action et autorisent jusqu'à 2 Mo, donc on
    // relève le plafond au-dessus (marge multipart). L'action applique la vraie
    // limite de 2 Mo et renvoie un message clair au-delà.
    serverActions: { bodySizeLimit: "4mb" },
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
