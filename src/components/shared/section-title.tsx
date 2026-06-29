import { cn } from "@/lib/utils";
import { Typography } from "@/components/nowts/typography";
/**
 * Section heading: a monospace ".../subtitle" breadcrumb above a large title.
 */
export function SectionTitle({
  title,
  subtitle,
  as: Tag = "h2",
  titleVariant = "h2",
  className,
}: {
  title: string;
  subtitle: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5";
  titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-primary font-mono text-sm">{`.../${subtitle}`}</span>
      <Typography
        as={Tag}
        variant={titleVariant}
        className="font-medium tracking-tight"
      >
        {title}
      </Typography>
    </div>
  );
}
