import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function meta() {
  return [{ title: "Settings - CircaCal" }];
}

export default function Settings() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Settings
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Body metrics and preferences. Nothing is saved yet—this screen is
          UI-only for now.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-weight">Current weight</Label>
          <Input
            id="settings-weight"
            name="weight"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="e.g. 72.5"
          />
          <p className="text-pretty text-xs text-muted-foreground">
            Kilograms for now; unit settings can come later.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-height">Height (optional)</Label>
          <Input
            id="settings-height"
            name="height"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="e.g. 175"
          />
          <p className="text-pretty text-xs text-muted-foreground">
            Centimeters.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-notes">Notes (optional)</Label>
          <Input
            id="settings-notes"
            name="notes"
            type="text"
            autoComplete="off"
            placeholder="e.g. goal weight, injuries, context"
          />
        </div>
      </div>
    </div>
  );
}
