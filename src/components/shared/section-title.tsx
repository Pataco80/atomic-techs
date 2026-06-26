import { cn } from "@/lib/utils";

/**
 * Section heading: a monospace ".../subtitle" breadcrumb above a large title.
 */
export function SectionTitle({
  title,
  subtitle,
  as: Tag = "h2",
  className,
}: {
  title: string;
  subtitle: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-primary font-mono text-sm">{`.../${subtitle}`}</span>
      <Tag className="text-3xl font-medium tracking-tight">{title}</Tag>
    </div>
  );
}
