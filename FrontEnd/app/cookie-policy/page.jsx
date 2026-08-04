import { LegalPageLayout } from "@/components/LegalPageLayout"
import Link from "next/link"

export const metadata = {
  title: "Cookie Policy | Salora",
  description: "How Salora uses cookies and similar technologies.",
}

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" updated="August 3, 2026">
      <section>
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device that help websites
          remember information about your visit, such as your preferences and
          login state.
        </p>
      </section>

      <section>
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Keep you signed in to your Salora account.</li>
          <li>Remember your preferences across visits.</li>
          <li>Understand how the platform is used so we can improve it.</li>
        </ul>
      </section>

      <section>
        <h2>3. Types of Cookies We Use</h2>
        <ul>
          <li>
            <span className="font-semibold text-white">Essential:</span>{" "}
            required for authentication and core functionality.
          </li>
          <li>
            <span className="font-semibold text-white">Functional:</span>{" "}
            remember settings like your dashboard preferences.
          </li>
          <li>
            <span className="font-semibold text-white">Analytics:</span> help us
            understand usage patterns to improve Salora.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Managing Cookies</h2>
        <p>
          Most browsers let you control cookies through their settings,
          including blocking or deleting them. Disabling essential cookies may
          prevent parts of Salora, like signing in, from working correctly.
        </p>
      </section>

      <section>
        <h2>5. Third-Party Cookies</h2>
        <p>
          Some cookies may be set by trusted third-party services we use to
          operate Salora, such as authentication or analytics providers.
        </p>
      </section>

      <section>
        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will update the
          &quot;Last updated&quot; date above when we do.
        </p>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>
          Questions about this Cookie Policy? Reach us at{" "}
          <Link href="/#contact" className="text-primary hover:underline">
            Contact Us
          </Link>
        </p>
      </section>
    </LegalPageLayout>
  )
}
