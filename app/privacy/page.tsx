import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="September 2026">
      <p>
        Log &amp; Train respects your privacy. This policy explains, in simple terms, what
        information we collect and how we use it.
      </p>

      <h2>Information We Collect</h2>
      <p>When you use Log &amp; Train, we may collect information such as:</p>
      <ul>
        <li>Your name and email address.</li>
        <li>Account and profile information you provide.</li>
        <li>Workout information you choose to log.</li>
        <li>Program selections and training history.</li>
        <li>Basic technical and usage information needed to operate and improve the service.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use this information to:</p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Save and display your workouts and training history.</li>
        <li>Provide the features of Log &amp; Train.</li>
        <li>Maintain, secure and improve the service.</li>
        <li>Communicate with you when necessary.</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>We do not sell your personal information.</p>
      <p>
        We may use trusted service providers to help operate Log &amp; Train, such as hosting,
        authentication, analytics or email services. They may process information only as
        necessary to provide those services.
      </p>
      <p>We may also disclose information where required by law.</p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect your information, but no online service can
        guarantee absolute security.
      </p>

      <h2>Your Data</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information where
        applicable.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy as Log &amp; Train develops. The latest version will be
        available on this page.
      </p>

      <h2>Contact</h2>
      <p>For privacy questions or requests, contact us at [contact email].</p>
    </LegalPageLayout>
  );
}
