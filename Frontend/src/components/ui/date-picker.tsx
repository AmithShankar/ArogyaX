"use client"

import { format, isDate, isValid, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onChange,
  placeholder = "DD-MM-YYYY",
  className,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    date && isValid(date) ? format(date, "dd-MM-yyyy") : ""
  )

  // Update input value when external date changes
  React.useEffect(() => {
    if (date && isDate(date) && isValid(date)) {
      setInputValue(format(date, "dd-MM-yyyy"))
    } else if (!date) {
      setInputValue("")
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    
    // Auto-formatting (masking) for DD-MM-YYYY
    // Allow only digits and dashes
    const cleanVal = val.replace(/[^\d]/g, "")
    
    let formatted = ""
    if (cleanVal.length > 0) formatted += cleanVal.slice(0, 2)
    if (cleanVal.length > 2) formatted += "-" + cleanVal.slice(2, 4)
    if (cleanVal.length > 4) formatted += "-" + cleanVal.slice(4, 8)
    
    setInputValue(formatted)

    // Try to parse if we have a full date string length
    if (formatted.length === 10) {
      const parsedDate = parse(formatted, "dd-MM-yyyy", new Date())
      if (isValid(parsedDate)) {
        onChange?.(parsedDate)
      }
    }
  }

  const handleDateSelect = (newDate?: Date) => {
    onChange?.(newDate)
    if (newDate) {
      setInputValue(format(newDate, "dd-MM-yyyy"))
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover>
        <div className="group relative flex items-center">
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "h-10 w-full rounded-xl border-border/60 bg-muted/20 pl-4 pr-11 font-normal transition-all duration-200",
              "hover:border-primary/50 hover:bg-muted/40 hover:shadow-sm",
              "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
              !date && "text-muted-foreground"
            )}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-1.5 text-primary ring-1 ring-primary/20 transition-all hover:bg-primary hover:text-primary-foreground hover:ring-primary/40 focus:outline-none"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-auto p-0 overflow-hidden border border-border/60 rounded-2xl shadow-[0_8px_32px_hsl(var(--primary)/0.08),_0_2px_8px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in-95 duration-200"
          align="end"
          side="bottom"
          avoidCollisions
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
