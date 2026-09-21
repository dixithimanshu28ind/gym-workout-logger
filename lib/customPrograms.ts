/**
 * The Custom Programs offering: what is sold, for how much, how long it takes,
 * and where a visitor goes to buy it. Pure data, no I/O.
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
  /**
   * Whether this option's landing page exists. While it does not, the Programs
   * page shows the option as "Coming soon" even when the feature flag is Live:
   * a price and a button pointing at a page that is not there would send every
   * visitor's browser to prefetch a 404.
   *
   * Interim. GYM-45 replaces this with a real feature flag per option
   * (custom_diet_programs), controlled from the CMS.
   */
  landingPageReady: boolean;
};

export const CUSTOM_PROGRAM_OPTIONS: readonly CustomProgramOption[] = [
  {
    type: "training",
    name: "Training Program",
    price: 299,
    description:
      "A personalized workout program built around your goals, experience, schedule, available equipment and training preferences.",
    cta: "Get My Training Program",
    landingPageReady: true,
  },
  {
    type: "training-diet",
    name: "Training + Diet Program",
    price: 499,
    description:
      "A personalized training program plus a diet plan built around your goals, food preferences and daily routine.",
    cta: "Get Training + Diet Program",
    landingPageReady: false,
  },
];

/**
 * Each option has its own landing page under /programs/custom/<type>. Only the
 * Training page exists so far; Training + Diet is a separate card (its own
 * feature flag, GYM-45), so its address leads nowhere yet.
 *
 * The questionnaire the landing page hands over to is another card too, so
 * until it exists the flag must stay Off or Coming soon in production.
 */
export const CUSTOM_PROGRAMS_PATH = "/programs/custom";

export function customProgramHref(type: CustomProgramType): string {
  return `${CUSTOM_PROGRAMS_PATH}/${type}`;
}

export const CUSTOM_TRAINING_QUESTIONNAIRE_PATH = `${customProgramHref("training")}/questionnaire`;

export function getCustomProgramOption(type: CustomProgramType): CustomProgramOption {
  const option = CUSTOM_PROGRAM_OPTIONS.find((o) => o.type === type);
  if (!option) throw new Error(`Unknown custom program type: ${type}`);
  return option;
}

/**
 * The delivery promise shown on the Training landing page. Kept here so the
 * hero and the "How it works" steps cannot disagree. The process that keeps it
 * is a later card; until then this is copy the process must honour.
 */
export const CUSTOM_PROGRAM_DELIVERY_TIME = "24–36 hours";

export function formatRupees(amount: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
}
