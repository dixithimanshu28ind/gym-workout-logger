import Link from "next/link";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";

const SUPPORT_EMAIL = "support@logandtrain.com";

export default function SupportPage() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl">Support</h1>
        <p className="mt-4 text-base font-medium">Need help with Log &amp; Train?</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          If you&apos;re having trouble with your account, logging workouts, using a training
          program, or anything else in Log &amp; Train, we&apos;re happy to help.
        </p>

        <h2 className="mt-10 font-display text-lg">Contact us</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          When contacting support, please include a short description of the problem. If
          relevant, you can also include a screenshot.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>

        <h2 className="mt-10 font-display text-lg">Useful Links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Use
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/fitness-disclaimer" className="text-accent hover:underline">
              Fitness Disclaimer
            </Link>
          </li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
