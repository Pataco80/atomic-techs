import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getStacks } from "@/query/portfolio/get-stacks";
import { Suspense } from "react";
import { StacksList } from "./_components/stacks-list";

export default function StacksPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          Stacks
        </LayoutTitle>
        <LayoutDescription>
          Gérez les technologies maîtrisées et leur séniorité.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <Suspense fallback={<StacksSkeleton />}>
          <StacksSection />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}

async function StacksSection() {
  const stacks = await getStacks();

  return <StacksList stacks={stacks} />;
}

function StacksSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {["a", "b", "c", "d"].map((key) => (
        <Skeleton key={key} className="h-16 w-full" />
      ))}
    </div>
  );
}
