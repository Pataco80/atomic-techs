import { buildPersonJsonLd, buildProjectJsonLd } from "@/lib/seo/json-ld";
import { describe, expect, it } from "vitest";

describe("buildPersonJsonLd", () => {
  it("builds a schema.org Person with optional fields", () => {
    const ld = buildPersonJsonLd(
      {
        fullName: "Jean Dupont",
        headline: "Développeur",
        avatarUrl: "https://blob/avatar.png",
        email: "jean@exemple.com",
      },
      "https://site/",
    );
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Jean Dupont");
    expect(ld.url).toBe("https://site/");
    expect(ld).toMatchObject({
      jobTitle: "Développeur",
      image: "https://blob/avatar.png",
      email: "jean@exemple.com",
    });
  });

  it("falls back to a default name and omits absent fields", () => {
    const ld = buildPersonJsonLd(null, "https://site/");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Portfolio");
    expect("jobTitle" in ld).toBe(false);
    expect("image" in ld).toBe(false);
    expect("email" in ld).toBe(false);
  });
});

describe("buildProjectJsonLd", () => {
  it("builds a CreativeWork with name and url", () => {
    const ld = buildProjectJsonLd(
      {
        title: "Mon projet",
        longDescription: "Une description",
        imageUrl: "https://blob/p.png",
      },
      "https://site/portfolio/mon-projet",
    );
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld.name).toBe("Mon projet");
    expect(ld.url).toBe("https://site/portfolio/mon-projet");
    expect(ld).toMatchObject({
      description: "Une description",
      image: "https://blob/p.png",
    });
  });

  it("omits optional fields when absent", () => {
    const ld = buildProjectJsonLd(
      { title: "Sans détails" },
      "https://site/portfolio/sans-details",
    );
    expect("description" in ld).toBe(false);
    expect("image" in ld).toBe(false);
  });
});
