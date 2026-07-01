"use client";

import { Icon } from "@/components/shared/icons";
import { Input } from "@/components/ui/input";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

const feedbackSearchParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
};

export const FeedbackFilters = () => {
  const [filters, setFilters] = useQueryStates(feedbackSearchParams, {
    shallow: false,
    throttleMs: 1000,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Icon
          name="search"
          className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform"
        />
        <Input
          placeholder="Search feedback by message, email, or user..."
          value={filters.search}
          onChange={(e) => {
            void setFilters({
              search: e.target.value,
              page: 1,
            });
          }}
          className="bg-background appearance-none rounded-full pl-10 shadow-none"
        />
      </div>
    </div>
  );
};
