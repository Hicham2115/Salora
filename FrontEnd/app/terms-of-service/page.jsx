import { LegalPageLayout } from "@/components/LegalPageLayout"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Salora",
  description: "The terms that govern your use of the Salora platform.",
}

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="August 3, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account or using Salora, you agree to these Terms of
          Service. If you do not agree, please do not use the platform.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Salora provides salons and barbershops with tools to manage bookings,
          clients, services, and their online presence.
        </p>
      </section>

      <section>
        <h2>3. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activity that occurs under your
          account.
        </p>
      </section>

      <section>
        <h2>4. Subscription &amp; Billing</h2>
        <p>
          Some features of Salora require a paid subscription. Fees, trial
          periods, and billing cycles will be clearly presented before you are
          charged. You may cancel your subscription at any time.
        </p>
      </section>

      <section>
        <h2>5. Acceptable Use</h2>
        <ul>
          <li>Do not use Salora for any unlawful purpose.</li>
          <li>Do not attempt to disrupt or compromise platform security.</li>
          <li>Do not upload content you do not have the right to share.</li>
        </ul>
      </section>

      <section>
        <h2>6. Client Data &amp; Booking Content</h2>
        <p>
          Salon owners are responsible for the accuracy of the client and
          booking data they enter, and for obtaining any consent required from
          their own clients to store and process that data.
        </p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          Salora and its branding, design, and software are owned by us or our
          licensors. You retain ownership of the content you upload (photos,
          service descriptions, client data).
        </p>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          We may suspend or terminate accounts that violate these Terms. You may
          stop using Salora and close your account at any time.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer of Warranties</h2>
        <p>
          Salora is provided &quot;as is&quot; without warranties of any kind,
          to the fullest extent permitted by law.
        </p>
      </section>

      <section>
        <h2>10. Limitation of Liability</h2>
        <p>
          To the extent permitted by law, Salora is not liable for indirect,
          incidental, or consequential damages arising from your use of the
          platform.
        </p>
      </section>

      <section>
        <h2>11. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of Salora
          after changes take effect constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2>12. Contact Us</h2>
        <p>
          Questions about these Terms? Reach us at{" "}
          <Link href="/#contact" className="text-primary hover:underline">
            Contact Us
          </Link>
        </p>
      </section>
    </LegalPageLayout>
  )
}
