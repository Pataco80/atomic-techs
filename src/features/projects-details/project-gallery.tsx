"use client";

import { Typography } from "@/components/nowts/typography";
import { cn } from "@/lib/utils";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMedia } from "react-use";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type GalleryItem = ProjectWithStacks["gallery"][number];

/**
 * Project gallery rendered as alternating rows (image/text swap sides on every
 * other index, like the home `HighlightCard`). Clicking a visual opens a
 * lightbox at that slide showing the item title centered at the bottom, over a
 * themed glow backdrop (see `.gallery-lightbox` in globals.css).
 *
 * On mobile (< 768px) the prev/next arrows are hidden and navigation is
 * swipe-only (yarl's native gesture); the arrows stay on desktop for the mouse.
 */
export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState(-1);
  // `false` = SSR/first-paint default (desktop) → no hydration mismatch: the
  // rows use Tailwind classes (not `isMobile`), and the lightbox only mounts on
  // open (post-hydration, user click).
  const isMobile = useMedia("(max-width: 767px)", false);

  if (items.length === 0) return null;

  // The title is mapped to the caption `description` slot so it renders at the
  // bottom (centered); the short description is intentionally omitted here.
  const slides = items.map((item) => ({
    src: item.imageUrl,
    description: item.title,
  }));

  return (
    <>
      <div className="flex flex-col gap-14">
        {items.map((item, i) => (
          <article
            key={item.id}
            className={cn(
              "flex flex-col gap-6 lg:flex-row lg:gap-12",
              i % 2 !== 0 && "lg:flex-row-reverse",
            )}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Agrandir : ${item.title}`}
              className="focus-visible:ring-primary bg-muted relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg outline-none focus-visible:ring-2 lg:w-[320px] lg:shrink-0"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
            <div className="flex flex-1 flex-col gap-4 lg:py-2">
              <Typography variant="large" as="h3" className="font-medium">
                {item.title}
              </Typography>
              <Typography variant="muted" className="whitespace-pre-wrap">
                {item.shortDescription}
              </Typography>
            </div>
          </article>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Captions]}
        className="gallery-lightbox"
        carousel={{ padding: isMobile ? "16px" : "84px", finite: true }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        captions={{ descriptionTextAlign: "center" }}
        render={{
          iconPrev: () => <ChevronLeft className="size-6" />,
          iconNext: () => <ChevronRight className="size-6" />,
          iconClose: () => <X className="size-5" />,
          // Mobile: suppress the whole prev/next buttons (swipe-only). Desktop:
          // keep default buttons with the icons above. `null` return removes the
          // button; omitting the key falls back to yarl's default button.
          ...(isMobile && {
            buttonPrev: () => null,
            buttonNext: () => null,
          }),
        }}
      />
    </>
  );
}
