import type { Program } from "@/lib/types";

export const PROGRAMS: Program[] = [
  {
    id: "bro-split",
    name: "Bro Split",
    subtitle: "12-Week Bro Split",
    description:
      "Each training day focuses mainly on one body part, giving that muscle group your full attention before moving to the next the following day. A good fit if you enjoy concentrating on one muscle group at a time.",
    durationWeeks: 12,
    daysPerWeek: 5,
    sessionMinutes: 60,
    schedule: [
      { day: 1, focus: "Chest + Core" },
      { day: 2, focus: "Back" },
      { day: 3, focus: "Shoulders + Core" },
      { day: 4, focus: "Legs" },
      { day: 5, focus: "Arms" },
      { day: 6, focus: "Rest" },
      { day: 7, focus: "Rest" },
    ],
  },
  {
    id: "pplul",
    name: "Push / Pull / Legs / Upper / Lower",
    subtitle: "12-Week PPLUL",
    description:
      "Push, Pull, Legs, Upper, Lower — most major muscles get trained around twice a week, spreading the weekly workload across more sessions instead of one big day per muscle group.",
    durationWeeks: 12,
    daysPerWeek: 5,
    sessionMinutes: 60,
    schedule: [
      { day: 1, focus: "Push + Core" },
      { day: 2, focus: "Pull" },
      { day: 3, focus: "Legs" },
      { day: 4, focus: "Upper" },
      { day: 5, focus: "Lower + Core" },
      { day: 6, focus: "Rest" },
      { day: 7, focus: "Rest" },
    ],
  },
  {
    id: "full-body",
    name: "Full Body + Conditioning",
    subtitle: "12-Week Full Body + Conditioning",
    description:
      "Two Full Body days train every major muscle group twice a week, two shorter sessions give extra attention to core, forearms and calves, and one HIIT day adds conditioning without a long extra workout.",
    durationWeeks: 12,
    daysPerWeek: 5,
    sessionMinutes: 60,
    schedule: [
      { day: 1, focus: "Full Body A" },
      { day: 2, focus: "Core + Forearms" },
      { day: 3, focus: "Full Body B" },
      { day: 4, focus: "Calves + Core + Forearms" },
      { day: 5, focus: "HIIT" },
      { day: 6, focus: "Rest" },
      { day: 7, focus: "Rest" },
    ],
  },
];

export function getProgramById(id: string | null | undefined): Program | undefined {
  if (!id) return undefined;
  return PROGRAMS.find((p) => p.id === id);
}
