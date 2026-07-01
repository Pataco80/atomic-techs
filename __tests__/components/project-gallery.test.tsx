import { screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setup } from "../../test/setup";
import { ProjectGallery } from "@/features/projects-details/project-gallery";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";

type GalleryItem = ProjectWithStacks["gallery"][number];

// yet-another-react-lightbox relies on ResizeObserver, which jsdom lacks.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = () => undefined;
      unobserve = () => undefined;
      disconnect = () => undefined;
    },
  );
});

/**
 * Control `useMedia("(max-width: 767px)")` by pinning `matchMedia.matches`.
 * The gallery only queries the one mobile media query, so a flat return is safe.
 */
function mockViewport(isMobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function makeItem(id: string, title: string): GalleryItem {
  return {
    id,
    projectId: "p1",
    imageUrl: "/test.png",
    title,
    shortDescription: `${title} description`,
    order: 0,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    deletedAt: null,
  };
}

const ITEMS: GalleryItem[] = [
  makeItem("1", "Première"),
  makeItem("2", "Seconde"),
];

describe("ProjectGallery lightbox navigation", () => {
  beforeEach(() => {
    mockViewport(false);
  });

  it("hides the prev/next arrows on mobile (swipe-only)", async () => {
    mockViewport(true);
    const { user } = setup(<ProjectGallery items={ITEMS} />);

    await user.click(
      screen.getByRole("button", { name: /agrandir : première/i }),
    );

    expect(screen.queryByRole("button", { name: /previous/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /next/i })).toBeNull();
  });

  it("keeps the prev/next arrows on desktop", async () => {
    mockViewport(false);
    const { user } = setup(<ProjectGallery items={ITEMS} />);

    await user.click(
      screen.getByRole("button", { name: /agrandir : première/i }),
    );

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
