/**
 * The Custom Programs offering: what is sold, for how much, and where a
 * visitor goes to buy it. Pure data, no I/O.
 *
 * The prices are PLACEHOLDERS until the tax treatment (GST, tax-inclusive or
 * not) and the business bank account are settled. They live here, and only
 * here, so changing one is a one-line change. Anything that charges money must
 * take the price from the server side of this file, never from the browser.
 *
 * Whether any of this shows at all is decided by the `custom_programs` feature
 * flag (lib/features.ts).
 */

export type CustomProgramType = "training" | "training-diet";

export type CustomProgramOption = {
  type: CustomProgramType;
  name: string;
  /** In rupees. */
  price: number;
  description: string;
  cta: string;
};

export const CUSTOM_PROGRAM_OPTIONS: readonly CustomProgramOption[] = [
  {
    type: "training",
    name: "Training Program",
    price: 299,
    description:
      "A personalized workout program built around your goals, experience, schedule, available equipment and training preferences.",
    cta: "Get My Training Program",
  },
  {
    type: "training-diet",
    name: "Training + Diet Program",
    price: 499,
    description:
      "A personalized training program plus a diet plan built around your goals, food preferences and daily routine.",
    cta: "Get Training + Diet Program",
  },
];

/**
 * Where the buttons lead. The Custom Programs landing page is a separate card
 * and does not exist yet, so until it does the flag must not be Live in
 * production. The chosen option travels in the `type` query parameter so the
 * next page knows which one was picked.
 */
export const CUSTOM_PROGRAMS_PATH = "/programs/custom";

export function customProgramHref(type: CustomProgramType): string {
  return `${CUSTOM_PROGRAMS_PATH}?type=${type}`;
}

export function formatRupees(amount: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
}
