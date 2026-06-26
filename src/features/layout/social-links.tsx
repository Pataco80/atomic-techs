import { cn } from "@/lib/utils";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

function readSocial(socials: unknown, key: string): string | null {
  if (
    socials == null ||
    typeof socials !== "object" ||
    Array.isArray(socials)
  ) {
    return null;
  }
  const value = (socials as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

const SOCIALS = [
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "twitter", label: "Twitter / X", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
] as const;

/** Renders the org's social links (from the `socials` JSON), or nothing. */
export function SocialLinks({
  socials,
  className,
}: {
  socials: unknown;
  className?: string;
}) {
  const items = SOCIALS.map((s) => ({
    ...s,
    href: readSocial(socials, s.key),
  })).filter((s): s is typeof s & { href: string } => Boolean(s.href));

  if (items.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map(({ key, label, Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Icon className="size-5" />
        </a>
      ))}
    </div>
  );
}
