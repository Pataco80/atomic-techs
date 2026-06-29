import { Activity, Heart, MessageCircle, User2 } from "lucide-react";

import { Typography } from "@/components/nowts/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InformationCards() {
  return (
    <div className="flex w-full items-start gap-4 max-lg:flex-col lg:gap-8">
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total likes</CardTitle>
          <Heart className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12'032</div>
          <Typography variant="tiny" className="text-muted-foreground">
            +12.5% from last month
          </Typography>
        </CardContent>
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
          <MessageCircle className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">124</div>
          <Typography variant="tiny" className="text-muted-foreground">
            -2.5% from last month
          </Typography>
        </CardContent>
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New subscribers</CardTitle>
          <User2 className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+1288</div>
          <Typography variant="tiny" className="text-muted-foreground">
            +5.2% from last month
          </Typography>
        </CardContent>
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          <Activity className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120'011</div>
          <Typography variant="tiny" className="text-muted-foreground">
            -2.5% from last month
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
