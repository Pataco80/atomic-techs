import { Typography } from "@/components/nowts/typography";
import { Icon, type IconKey } from "@/components/shared/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InlineTooltip } from "@/components/ui/tooltip";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { getFeedbackById } from "@/query/feedback/get-feedback";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UserDetailsCard } from "../../_components/user-details-card";

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

export default function Page(props: {
  params: Promise<{ feedbackId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <FeedbackDetailPage {...props} />
    </Suspense>
  );
}

async function FeedbackDetailPage(props: {
  params: Promise<{ feedbackId: string }>;
}) {
  const params = await props.params;
  await getRequiredAdmin();

  const feedback = await getFeedbackById(params.feedbackId);

  if (!feedback) {
    notFound();
  }

  const reviewIcon = ReviewIcons.find((icon) => icon.value === feedback.review);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          Feedback
        </LayoutTitle>
        <LayoutDescription>
          Submitted {new Date(feedback.createdAt).toLocaleDateString()}
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent className="space-y-6">
        {feedback.user ? (
          <UserDetailsCard user={feedback.user} />
        ) : (
          <Card className="bg-ios-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Anonymous</CardTitle>
              <CardDescription>Email {feedback.email}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className="bg-ios-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Review</CardTitle>
            <CardDescription>
              {reviewIcon && (
                <div className="flex items-center gap-3">
                  <InlineTooltip title={reviewIcon.tooltip}>
                    <Icon
                      name={reviewIcon.icon}
                      size={28}
                      className="text-primary"
                    />
                  </InlineTooltip>
                  <Typography variant="muted">{reviewIcon.tooltip}</Typography>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="p" className="whitespace-pre-wrap">
              {feedback.message}
            </Typography>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
