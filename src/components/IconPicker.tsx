import { useState, useMemo } from "react";
import { icons } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconNames = useMemo(() => Object.keys(icons), []);
  const filtered = useMemo(
    () => iconNames.filter((n) => n.toLowerCase().includes(search.toLowerCase())).slice(0, 80),
    [iconNames, search]
  );

  const SelectedIcon = icons[value as keyof typeof icons];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          {SelectedIcon ? <SelectedIcon className="h-4 w-4" /> : null}
          <span className="truncate text-sm">{value || "Select icon…"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <ScrollArea className="h-52">
          <div className="grid grid-cols-6 gap-1">
            {filtered.map((name) => {
              const Icon = icons[name as keyof typeof icons];
              return (
                <button
                  key={name}
                  onClick={() => { onChange(name); setOpen(false); }}
                  title={name}
                  className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-md transition-colors hover:bg-muted",
                    value === name && "bg-primary/15 text-primary ring-1 ring-primary/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No icons found</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
