import { Link } from "react-router";

import { Button } from "~/components/ui/button";

export function BodyMetricHistoryPagination({
  page,
  totalPages,
  previousTo,
  nextTo,
}: {
  page: number;
  totalPages: number;
  previousTo: string;
  nextTo: string;
}) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-3">
      {page <= 1 ? (
        <Button type="button" variant="outline" disabled>
          Previous
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link to={previousTo} replace>
            Previous
          </Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page >= totalPages ? (
        <Button type="button" variant="outline" disabled>
          Next
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link to={nextTo} replace>
            Next
          </Link>
        </Button>
      )}
    </div>
  );
}
