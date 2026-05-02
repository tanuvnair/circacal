import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function meta() {
  return [{ title: "Statistics - CircaCal" }];
}

export default function Statistics() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Statistics
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Trends for your daily deficit, maintenance, and surplus picks will
          show up here once tracking is wired up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card className="min-w-0" size="sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">This week</CardTitle>
            <CardDescription>Average intake vs goal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-pretty text-sm text-muted-foreground">
              No data yet.
            </p>
          </CardContent>
        </Card>
        <Card className="min-w-0" size="sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Trend</CardTitle>
            <CardDescription>Calories over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-pretty text-sm text-muted-foreground">
              Charts coming soon.
            </p>
          </CardContent>
        </Card>
        <Card
          className="min-w-0 min-[480px]:col-span-2 lg:col-span-1"
          size="sm"
        >
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Insights</CardTitle>
            <CardDescription>Patterns and streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-pretty text-sm text-muted-foreground">
              No insights yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
