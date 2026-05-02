export function BodyMetricsHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Body metrics
      </h1>
      <p className="text-pretty text-sm text-muted-foreground">
        Each save adds a new log entry. Adjust or remove past entries from the
        history table.
      </p>
    </div>
  );
}
