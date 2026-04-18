"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TriStateFilterProps } from "@/types";
import { Check, ChevronDown, Filter, Search, X } from "lucide-react";
import { useState } from "react";

export function TriStateFilter({
  label,
  category,
  items,
  states,
  onToggle,
  renderLabel,
}: TriStateFilterProps) {
  const [search, setSearch] = useState("");
  const activeCount = Object.values(states).filter((s) => s !== "none").length;
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            activeCount > 0 && "border-primary bg-primary/5 font-medium"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Filter className="h-3.5 w-3.5" />
            <span className="truncate">
              {activeCount > 0 ? `${label} (${activeCount})` : label}
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0 overflow-hidden max-h-[80vh] flex flex-col" align="start">
        <div className="border-b border-border/60 p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 h-40">
          <div className="p-1">
            {filteredItems.map((item) => {
              const state = states[item] || "none";
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onToggle(category, item)}
                  className="flex w-full items-center gap-3 rounded-sm px-2 py-1 text-xs hover:bg-muted"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors",
                      state === "none" && "border-muted-foreground/30",
                      state === "include" && "border-success bg-success text-success-foreground",
                      state === "exclude" && "border-destructive bg-destructive text-destructive-foreground"
                    )}
                  >
                    {state === "include" && <Check className="h-3 w-3" />}
                    {state === "exclude" && <X className="h-3 w-3" />}
                  </div>
                  <span className="truncate text-left">{renderLabel ? renderLabel(item) : item}</span>
                </button>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                No items found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
