import { Link } from "react-router";
import { FlameIcon } from "lucide-react";

import { cn } from "~/lib/utils";

function CircaCalLogo({
  to,
  iconOnly = false,
  className,
  ...props
}: { to: string; iconOnly?: boolean } & Omit<
  React.ComponentProps<typeof Link>,
  "to"
>) {
  return (
    <Link
      to={to}
      className={cn("flex flex-col items-center gap-1", className)}
      {...props}
    >
      <FlameIcon className="text-primary" />
      {!iconOnly && (
        <span className="text-primary text-xl font-bold tracking-tight">
          CircaCal
        </span>
      )}
    </Link>
  );
}

export { CircaCalLogo };
