import { useMemo, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export interface SearchableComboboxOption {
  readonly value: string;
  readonly label: string;
}

export interface SearchableComboboxProps {
  readonly id?: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly options: ReadonlyArray<SearchableComboboxOption>;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly triggerClassName?: string;
  readonly contentClassName?: string;
  readonly listClassName?: string;
}

export function SearchableCombobox({
  id,
  value,
  onValueChange,
  options,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  triggerClassName,
  contentClassName,
  listClassName,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? value;
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-9 w-full max-w-md justify-between py-2 text-left font-normal whitespace-normal",
            triggerClassName,
          )}
        >
          <span className="line-clamp-2">{selectedLabel}</span>
          <ChevronsUpDownIcon className="ms-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] max-w-md p-0",
          contentClassName,
        )}
        align="start"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList
            className={cn(
              "combobox-scroll overscroll-y-contain",
              listClassName,
            )}
          >
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  className={cn(
                    value === option.value && "bg-muted text-foreground",
                  )}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
