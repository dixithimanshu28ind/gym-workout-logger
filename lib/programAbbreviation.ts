const ABBREVIATIONS: Record<string, string> = {
  "bro-split": "Bro",
  pplul: "PPLUL",
  "full-body": "Full body",
};

const OWN_PROGRAM_ABBREVIATION = "My Own";

/** Short label for a program, used where full names don't fit (day tiles, badges). */
export function getProgramAbbreviation(programId: string | null | undefined): string {
  if (!programId) return OWN_PROGRAM_ABBREVIATION;
  return ABBREVIATIONS[programId] ?? OWN_PROGRAM_ABBREVIATION;
}
