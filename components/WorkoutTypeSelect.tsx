"use client";

import { useEffect, useRef, useState } from "react";
import { WORKOUT_TYPES } from "@/lib/workoutTypes";

interface WorkoutTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  allowedTypes?: readonly string[];
}

export default function WorkoutTypeSelect({
  value,
  onChange,
  autoFocus,
  allowedTypes,
}: WorkoutTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const selectableTypes = allowedTypes ?? WORKOUT_TYPES;
  const filtered = selectableTypes.filter((t) =>
    t.toLowerCase().includes(query.trim().toLowerCase())
  );

  const selectType = (type: string) => {
    onChange(type);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        autoFocus={autoFocus}
        onClick={() => {
          setQuery("");
          setOpen((o) => !o);
        }}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {value || <span className="text-neutral-400">Select workout type</span>}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-card-border bg-card p-2 shadow-lg">
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workout types..."
            className="mb-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-neutral-400">No matches.</p>
            ) : (
              filtered.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => selectType(type)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent/10 ${
                    type === value ? "bg-accent/10 font-medium text-accent" : ""
                  }`}
                >
                  {type}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
