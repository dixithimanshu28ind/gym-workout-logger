import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Use" lastUpdated="September 2026">
      <p>Welcome to Log &amp; Train.</p>
      <p>By using Log &amp; Train, you agree to these Terms of Use.</p>

      <h2>Using Log &amp; Train</h2>
      <p>Log &amp; Train is provided for personal fitness and workout tracking purposes.</p>
      <p>
        You are responsible for the information you enter into the service and for keeping your
        account credentials secure.
      </p>
      <p>
        You agree not to misuse the service, attempt to interfere with its operation, or use it
        for unlawful purposes.
      </p>

      <h2>Fitness Information</h2>
      <p>
        Workout programs, exercises and other fitness information provided by Log &amp; Train are
        for general informational purposes only and are not medical advice.
      </p>
      <p>
        Please read our <Link href="/fitness-disclaimer">Fitness Disclaimer</Link> before starting
        a workout program.
      </p>

      <h2>Your Account</h2>
      <p>You are responsible for activity performed through your account.</p>
      <p>
        You may stop using Log &amp; Train at any time. Where account deletion is available, you
        may request or initiate deletion of your account and associated data.
      </p>

      <h2>Service Availability</h2>
      <p>We may update, change or discontinue parts of Log &amp; Train as the product develops.</p>
      <p>
        We cannot guarantee that the service will always be available without interruption or
        errors.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. The latest version will always be available
        on this page.
      </p>

      <h2>Contact</h2>
      <p>If you have questions about these Terms, please contact us at [contact email].</p>
    </LegalPageLayout>
  );
}
