"use client";

import { SegmentedControl } from "@/components/ios";
import { useState, type ReactNode } from "react";

type AboutTabsProps = {
  person: ReactNode;
  org: ReactNode;
  career: ReactNode;
  pages: ReactNode;
};

const SEGMENTS = [
  { value: "person", label: "Profil" },
  { value: "org", label: "Organisation" },
  { value: "career", label: "Parcours" },
  { value: "pages", label: "Pages" },
];

/**
 * iOS-style segmented tab switcher for the About back-office. All four panels
 * stay mounted (so form state survives a tab switch); the inactive ones are
 * hidden via `hidden`.
 */
export function AboutTabs({ person, org, career, pages }: AboutTabsProps) {
  const [active, setActive] = useState("person");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <SegmentedControl
          aria-label="Sections À propos"
          value={active}
          onValueChange={setActive}
          segments={SEGMENTS}
        />
      </div>

      <div hidden={active !== "person"}>{person}</div>
      <div hidden={active !== "org"}>{org}</div>
      <div hidden={active !== "career"}>{career}</div>
      <div hidden={active !== "pages"}>{pages}</div>
    </div>
  );
}
