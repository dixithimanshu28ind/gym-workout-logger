"use client";

import { useEffect, useRef, useState } from "react";
import { formatDateKey, getMonthGridWeeks, parseLocalDateKey } from "@/lib/dates";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface WorkoutDatePickerProps {
  value: string;
  onChange: (dateKey: string) => void;
  loggedDates?: Set<string>;
}

export default function WorkoutDatePicker({ value, onChange, loggedDates }: WorkoutDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => parseLocalDateKey(value));
  const containerRef = useRef<HTMLDivElement>(null);

  const todayKey = formatDateKey(new Date());

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open) setViewMonth(parseLocalDateKey(value));
    setOpen((o) => !o);
  };

  const selectDate = (dateKey: string) => {
    onChange(dateKey);
    setOpen(false);
  };

  const monthLabel = viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const isCurrentOrFutureViewMonth =
    viewMonth.getFullYear() > new Date().getFullYear() ||
    (viewMonth.getFullYear() === new Date().getFullYear() && viewMonth.getMonth() >= new Date().getMonth());

  const weeks = getMonthGridWeeks(viewMonth);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {parseLocalDateKey(value).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-xl border border-card-border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="rounded-md px-2 py-1 text-sm text-neutral-600 hover:bg-background"
              aria-label="Previous month"
            >
              ←
            </button>
            <span className="text-sm font-medium">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              disabled={isCurrentOrFutureViewMonth}
              className="rounded-md px-2 py-1 text-sm text-neutral-600 hover:bg-background disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((cell) => {
              const isFuture = cell.dateKey > todayKey;
              const isToday = cell.dateKey === todayKey;
              const isLogged = loggedDates?.has(cell.dateKey) ?? false;
              const isSelected = cell.dateKey === value;

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  disabled={isFuture}
                  onClick={() => selectDate(cell.dateKey)}
                  className={`relative rounded-md py-1.5 text-sm transition ${
                    !cell.inCurrentMonth ? "text-neutral-300" : "text-foreground"
                  } ${isFuture ? "cursor-not-allowed opacity-30" : "hover:bg-accent/10"} ${
                    isLogged ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                  } ${isSelected ? "ring-2 ring-accent" : ""}`}
                >
                  {cell.date.getDate()}
                  {isToday && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
