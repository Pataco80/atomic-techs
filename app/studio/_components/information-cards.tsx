import { IconTile } from "@/components/ios";
import type { IconKey } from "@/components/shared/icons";
import { Typography } from "@/components/nowts/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCard = {
  title: string;
  value: string;
  delta: string;
  icon: IconKey;
  tint: string;
};

const STAT_CARDS: StatCard[] = [
  {
    title: "Total likes",
    value: "12'032",
    delta: "+12.5% from last month",
    icon: "heart",
    tint: "bg-rose-500",
  },
  {
    title: "Total Threads",
    value: "124",
    delta: "-2.5% from last month",
    icon: "message",
    tint: "bg-blue-500",
  },
  {
    title: "New subscribers",
    value: "+1288",
    delta: "+5.2% from last month",
    icon: "user-round",
    tint: "bg-emerald-500",
  },
  {
    title: "Impressions",
    value: "120'011",
    delta: "-2.5% from last month",
    icon: "analytics",
    tint: "bg-purple-500",
  },
];

export default function InformationCards() {
  return (
    <div className="flex w-full items-start gap-4 max-lg:flex-col lg:gap-8">
      {STAT_CARDS.map((stat) => (
        <Card
          key={stat.title}
          className="bg-ios-card w-full flex-1 rounded-xl border-0 shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ios-secondary-label text-sm font-medium">
              {stat.title}
            </CardTitle>
            <IconTile name={stat.icon} className={stat.tint} />
          </CardHeader>
          <CardContent>
            <div className="text-ios-label text-2xl font-bold">
              {stat.value}
            </div>
            <Typography variant="tiny" className="text-ios-secondary-label">
              {stat.delta}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
