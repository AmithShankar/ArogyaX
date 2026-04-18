"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// ─── Mini Select Dropdown ─────────────────────────────────────────────────────

interface SelectDropdownProps {
  value: number;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
  className?: string;
}

const SelectDropdown = React.memo(function SelectDropdown({
  value,
  options,
  onChange,
  className,
}: SelectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? String(value);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Scroll selected item into view when opened
  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const selected = listRef.current.querySelector(
      "[data-selected='true']",
    ) as HTMLElement;
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-0.5 h-7 px-2 rounded-lg",
          "bg-transparent text-sm font-semibold text-foreground",
          "hover:bg-muted/60 active:bg-muted/80 transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40",
          open && "bg-muted/60",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selectedLabel}
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground/60 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full mt-1 z-[200]",
            "bg-card border border-border/60 rounded-xl",
            "shadow-[0_4px_24px_rgba(0,0,0,0.14),_0_1px_4px_rgba(0,0,0,0.08)]",
            "overflow-hidden min-w-[7rem]",
          )}
        >
          <ul
            ref={listRef}
            className="max-h-[160px] overflow-y-auto p-1 overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
              >
                <button
                  type="button"
                  data-selected={opt.value === value}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs",
                    "transition-colors duration-100",
                    opt.value === value
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground font-normal hover:bg-accent/60",
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

// ─── Custom Caption ───────────────────────────────────────────────────────────

interface CustomCaptionProps {
  displayMonth: Date;
  fromYear: number;
  toYear: number;
  onMonthChange: (date: Date) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomCaption = React.memo(function CustomCaption({
  displayMonth,
  fromYear,
  toYear,
  onMonthChange,
}: CustomCaptionProps) {
  const monthOptions = React.useMemo(
    () => MONTH_NAMES.map((label, i) => ({ label, value: i })),
    [],
  );

  const yearOptions = React.useMemo(
    () =>
      Array.from({ length: toYear - fromYear + 1 }, (_, i) => ({
        label: String(fromYear + i),
        value: fromYear + i,
      })),
    [fromYear, toYear],
  );

  const handleMonthChange = (month: number) => {
    onMonthChange(new Date(displayMonth.getFullYear(), month, 1));
  };

  const handleYearChange = (year: number) => {
    onMonthChange(new Date(year, displayMonth.getMonth(), 1));
  };

  const handlePrev = () => {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() - 1);
    onMonthChange(d);
  };

  const handleNext = () => {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() + 1);
    onMonthChange(d);
  };

  const atStart =
    displayMonth.getFullYear() === fromYear && displayMonth.getMonth() === 0;
  const atEnd =
    displayMonth.getFullYear() === toYear && displayMonth.getMonth() === 11;

  const navBtnClass = cn(
    "inline-flex items-center justify-center rounded-lg",
    "h-9 w-9 sm:h-7 sm:w-7 shrink-0",
    "text-muted-foreground opacity-60 hover:opacity-100",
    "hover:bg-muted/60 active:bg-muted",
    "transition-all duration-150",
    "disabled:pointer-events-none disabled:opacity-20",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40",
  );

  return (
    <div className="relative flex items-center justify-center w-full py-0.5">
      {/* Prev - absolute left */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={atStart}
        aria-label="Previous month"
        className={cn(navBtnClass, "absolute left-0")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Selects - truly centered */}
      <div className="flex items-center gap-0.5">
        <SelectDropdown
          value={displayMonth.getMonth()}
          options={monthOptions}
          onChange={handleMonthChange}
        />
        <SelectDropdown
          value={displayMonth.getFullYear()}
          options={yearOptions}
          onChange={handleYearChange}
        />
      </div>

      {/* Next - absolute right */}
      <button
        type="button"
        onClick={handleNext}
        disabled={atEnd}
        aria-label="Next month"
        className={cn(navBtnClass, "absolute right-0")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
});

// ─── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = (props.fromYear as number | undefined) ?? 1900;
  const toYear = (props.toYear as number | undefined) ?? currentYear;

  const isControlled = props.month !== undefined;
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    props.defaultMonth ??
      (props.selected instanceof Date ? props.selected : new Date()),
  );
  const month = isControlled ? props.month! : internalMonth;
  const setMonth: (d: Date) => void = isControlled
    ? (props.onMonthChange ?? (() => {}))
    : setInternalMonth;

  const {
    fromYear: _fy,
    toYear: _ty,
    month: _m,
    onMonthChange: _omc,
    defaultMonth: _dm,
    ...rest
  } = props;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={month}
      onMonthChange={setMonth}
      fromYear={fromYear}
      toYear={toYear}
      className={cn("p-3 w-full max-w-[288px] sm:max-w-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden",
        nav: "hidden",
        nav_button: "hidden",
        nav_button_previous: "hidden",
        nav_button_next: "hidden",
        table: "w-full border-collapse",
        head_row: "flex justify-center mb-1",
        head_cell:
          "text-muted-foreground/50 w-8 text-[0.65rem] font-semibold uppercase tracking-widest text-center",
        row: "flex w-full mt-1 justify-center",
        // No focus-within or hover on cell - keep hover contained to the day button only
        cell: "p-0 text-center text-sm",
        day: cn(
          "h-8 w-8 p-0 font-normal rounded-full",
          "inline-flex items-center justify-center",
          "transition-colors duration-150",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
          "aria-selected:opacity-100",
          "cursor-pointer select-none",
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground font-medium",
          "hover:bg-primary/90 hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground",
          "shadow-sm shadow-primary/30",
        ),
        // Today: bold teal text + small dot indicator - no background/ring that bleeds
        day_today:
          "font-bold text-primary [&:not([aria-selected])]:after:block [&:not([aria-selected])]:after:absolute [&:not([aria-selected])]:after:bottom-0.5 [&:not([aria-selected])]:after:left-1/2 [&:not([aria-selected])]:after:-translate-x-1/2 [&:not([aria-selected])]:after:h-1 [&:not([aria-selected])]:after:w-1 [&:not([aria-selected])]:after:rounded-full [&:not([aria-selected])]:after:bg-primary relative",
        day_outside:
          "text-muted-foreground/30 opacity-40 aria-selected:bg-accent/20 aria-selected:text-muted-foreground/50",
        day_disabled:
          "text-muted-foreground/20 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground/20",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_hidden: "invisible",
        vhidden: "hidden",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <CustomCaption
            displayMonth={displayMonth}
            fromYear={fromYear}
            toYear={toYear}
            onMonthChange={setMonth}
          />
        ),
      }}
      {...rest}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
