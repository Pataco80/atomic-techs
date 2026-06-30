"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const LABELS: Record<string, string> = {
  users: "Analytics",
  projects: "Projets",
  stacks: "Stacks",
  about: "À Propos",
};

export function AppBreadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);
  const basePath = "/studio";

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-ios-card rounded-full px-4 py-2 shadow-sm">
        <BreadcrumbItem>
          <BreadcrumbLink href={basePath}>
            <Home size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.slice(1).length - 1;
          const currentPath = `/${paths.slice(0, index + 2).join("/")}`;

          const displayName = LABELS[path] ?? path;

          return (
            <Fragment key={path + index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={currentPath}
                    className="flex items-center gap-2"
                  >
                    {displayName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
