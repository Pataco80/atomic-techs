export const SiteConfig = {
  title: "Atomic Tech's",
  description: "Portfolio of Atomic Tech's",
  prodUrl: "https://atomic-techs.vercel.app",
  appId: "atomic-techs",
  domain: "atomic-techs.vercel.app",
  appIcon: "/images/icon.png",
  company: {
    name: "Atomic Tech's",
    address: "Ch. des Clos 6A - 1020 Renens (VD) - Suisse", // Remove if not needed
  },
  brand: {
    primary: "#0055FF", // You can adjust this to your brand color
  },
  team: {
    image: "https://x.com/pataco80",
    website: "https://dwdeveloppment.ch",
    twitter: "https://x.com/pataco80",
    name: "Ricardo Do Vale",
  },
  features: {
    /**
     * If enable, you need to specify the logic of upload here : src/features/images/uploadImageAction.tsx
     * You can use Vercel Blob Storage : https://vercel.com/docs/storage/vercel-blob
     * Or you can use Cloudflare R2 : https://mlv.sh/cloudflare-r2-tutorial
     * Or you can use AWS S3 : https://mlv.sh/aws-s3-tutorial
     */
    enableImageUpload: false as boolean,
    /**
     * If enable, the user will be redirected to `/orgs` when he visits the landing page at `/`
     * The logic is located in middleware.ts
     */
    enableLandingRedirection: true as boolean,
  },
};
