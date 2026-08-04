import { LegalPageLayout } from "@/components/LegalPageLayout"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Salora",
  description:
    "How Salora collects, uses, and protects your data and your clients' data.",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="August 3, 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Salora (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides a
          booking and salon management platform for salons, barbershops, and
          their clients. This Privacy Policy explains what information we
          collect, how we use it, and the choices you have.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>
            Account information: name, email address, phone number, and salon
            details you provide when signing up.
          </li>
          <li>
            Booking data: appointments, services, client names, and contact
            details entered by salon owners to manage bookings.
          </li>
          <li>
            Usage data: pages visited, features used, and device/browser
            information collected automatically to improve the product.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain the Salora platform.</li>
          <li>Process bookings and send appointment reminders.</li>
          <li>Respond to support requests and account inquiries.</li>
          <li>Improve our features and monitor platform performance.</li>
        </ul>
      </section>

      <section>
        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share limited data
          with service providers who help us operate the platform (such as
          hosting, authentication, and messaging providers), and only to the
          extent necessary for them to perform those services.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect the
          information stored on Salora. No method of transmission or storage is
          100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          information at any time by contacting us using the details below.
        </p>
      </section>

      <section>
        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Salora is intended for business use by salon owners and staff and is
          not directed at children under 18.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will update
          the &quot;Last updated&quot; date above when we do.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          Questions about this Privacy Policy? Reach us at{" "}
          <Link href="/#contact" className="text-primary hover:underline">
            Contact Us
          </Link>
        </p>
      </section>
    </LegalPageLayout>
  )
}
