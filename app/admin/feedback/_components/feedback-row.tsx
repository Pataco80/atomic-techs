import { iosMenuContent, iosMenuItem } from "@/components/ios";
import { Typography } from "@/components/nowts/typography";
import { Icon, type IconKey } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { InlineTooltip } from "@/components/ui/tooltip";
import type { FeedbackWithUser } from "@/query/feedback/get-feedback";
import Link from "next/link";
import { UserTableCell } from "../../_components/user-table-cell";

const ReviewIcons: { value: number; icon: IconKey; tooltip: string }[] = [
  {
    value: 1,
    icon: "angry",
    tooltip: "Extremely Dissatisfied",
  },
  {
    value: 2,
    icon: "frown",
    tooltip: "Somewhat Dissatisfied",
  },
  {
    value: 3,
    icon: "meh",
    tooltip: "Neutral",
  },
  {
    value: 4,
    icon: "smile-plus",
    tooltip: "Satisfied",
  },
];

type FeedbackRowProps = {
  feedback: FeedbackWithUser;
};

export const FeedbackRow = ({ feedback }: FeedbackRowProps) => {
  const reviewIcon = ReviewIcons.find((icon) => icon.value === feedback.review);

  const truncatedMessage =
    feedback.message.length > 200
      ? `${feedback.message.slice(0, 200)}...`
      : feedback.message;

  return (
    <TableRow key={feedback.id}>
      <TableCell>
        <UserTableCell
          user={feedback.user}
          fallbackEmail={feedback.email}
          href={`/admin/feedback/${feedback.id}`}
          size="sm"
        />
      </TableCell>
      <TableCell>
        {reviewIcon ? (
          <InlineTooltip title={reviewIcon.tooltip}>
            <div className="flex items-center">
              <Icon name={reviewIcon.icon} size={24} className="text-primary" />
            </div>
          </InlineTooltip>
        ) : (
          <Typography variant="muted">No rating</Typography>
        )}
      </TableCell>
      <TableCell>
        <div className="max-w-md">
          <Typography
            variant="muted"
            className="truncate"
            title={feedback.message}
          >
            {truncatedMessage}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Typography variant="muted">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon name="more-horizontal" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={iosMenuContent}>
            <DropdownMenuItem className={iosMenuItem} asChild>
              <Link href={`/admin/feedback/${feedback.id}`}>
                <Icon name="eye" className="mr-2 size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
