"use client";

import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import type { AppAuthPlan } from "@/lib/auth/stripe/auth-plans";
import {
  ADDITIONAL_FEATURES,
  LIMITS_CONFIG,
} from "@/lib/auth/stripe/auth-plans";
import { BILLING_URL } from "@/lib/LINKS";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoadingButton } from "../form/submit-button";
import { upgradeUserAction } from "./plans.action";

export function PricingCard({
  plan,
  isYearly,
}: {
  plan: AppAuthPlan;
  isYearly?: boolean;
}) {
  // Get the current user
  const { data: session } = useSession();

  const { execute: upgradeUser, isPending } = useAction(upgradeUserAction, {
    onSuccess: (result) => {
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError ?? "Failed to upgrade plan");
    },
  });

  // Calculate pricing details
  const monthlyPrice = plan.price;
  const yearlyPrice = plan.yearlyPrice ?? plan.price * 12;
  const displayPrice = isYearly ? Math.round(yearlyPrice / 12) : monthlyPrice;
  const originalPrice = isYearly ? monthlyPrice : null;

  // Calculate discount percentage
  const calculateDiscount = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const annualCost = monthlyPrice * 12;
    const discount = ((annualCost - yearlyPrice) / annualCost) * 100;
    return Math.round(discount);
  };

  const discount = calculateDiscount(plan.price, plan.yearlyPrice ?? 0);

  return (
    <Card
      className={cn(
        "flex flex-col pb-0 transition-all duration-200 hover:shadow-lg",
        plan.isPopular && "border-primary relative overflow-hidden shadow-md",
      )}
    >
      {plan.isPopular && (
        <div className="absolute top-5 right-0">
          <div className="bg-primary text-primary-foreground rounded-l-full px-4 py-1 text-xs font-semibold">
            Most Popular
          </div>
        </div>
      )}

      <CardHeader className={cn("pb-0")}>
        <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
        <CardDescription className="mt-1.5">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-6">
        <div className="mb-8">
          <div className="flex items-baseline">
            <Typography as="span" variant="h3" className="font-bold">
              {plan.currency === "USD" ? "$" : plan.currency}
            </Typography>
            <Typography
              as="span"
              variant="h2"
              className="font-bold tracking-tight"
            >
              {displayPrice}
            </Typography>
            <span className="text-muted-foreground ml-1.5">/mo</span>
          </div>

          {isYearly && originalPrice !== null && originalPrice > 0 && (
            <div className="mt-2 flex items-center">
              <span className="text-muted-foreground mr-2 line-through">
                ${originalPrice}/mo
              </span>
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary"
              >
                Save {discount}%
              </Badge>
            </div>
          )}

          {isYearly && yearlyPrice > 0 && (
            <Typography variant="muted" className="mt-2">
              Billed as ${yearlyPrice} per year
            </Typography>
          )}

          {plan.freeTrial && (
            <div className="bg-primary/10 text-primary mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
              <Clock className="mr-1.5 size-3.5" />
              {plan.freeTrial.days}-day free trial
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Typography
            variant="muted"
            as="h4"
            className="text-muted-foreground font-semibold tracking-wider uppercase"
          >
            Plan Includes
          </Typography>

          <ul className="space-y-5">
            {/* Generate features from limits object */}
            {Object.entries(plan.limits).map(([key, value]) => {
              const limitConfig =
                LIMITS_CONFIG[key as keyof typeof LIMITS_CONFIG];

              const Icon = limitConfig.icon;

              return (
                <li key={key} className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3 size-5 shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <Typography variant="default" className="font-medium">
                      {limitConfig.getLabel(value as number)}
                    </Typography>
                    <Typography variant="muted">
                      {limitConfig.description}
                    </Typography>
                  </div>
                </li>
              );
            })}

            {/* Additional features based on plan */}
            {ADDITIONAL_FEATURES[
              plan.name as keyof typeof ADDITIONAL_FEATURES
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <li key={index} className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3 size-5 shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <Typography variant="default" className="font-medium">
                      {feature.label}
                    </Typography>
                    <Typography variant="muted">
                      {feature.description}
                    </Typography>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-6 pb-8">
        <LoadingButton
          loading={isPending}
          size="lg"
          className={cn(
            "w-full text-base font-medium",
            plan.isPopular ? "bg-primary hover:bg-primary/90" : "",
          )}
          onClick={() => {
            if (!session?.user) {
              toast.error("Please sign in to upgrade");
              return;
            }
            upgradeUser({
              plan: plan.name,
              annual: isYearly,
              successUrl: `${BILLING_URL}/success`,
              cancelUrl: `${BILLING_URL}/cancel`,
            });
          }}
        >
          {plan.price === 0
            ? "Get Started"
            : isYearly
              ? "Subscribe Yearly"
              : "Subscribe Monthly"}
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
