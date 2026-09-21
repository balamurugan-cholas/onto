import React from 'react'
import type { View } from './Navbar'

export type LegalView = Extract<View, 'terms' | 'privacy' | 'refund'>
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

const policies: Record<LegalView, { title: string; sections: Array<{ heading: string; body: string }> }> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: 'Agreement', body: 'These Terms govern your purchase and use of TimelineKit and VPlay plugins. By purchasing, downloading, or using our tools, you agree to these Terms.' },
      { heading: 'License', body: 'A completed purchase grants you a limited, non-exclusive, non-transferable license to install and use the software on your own computers for your own editing work. You may not resell, redistribute, share, reverse engineer, or provide the installer or download access to another person.' },
      { heading: 'Product and compatibility', body: 'Our plugins are intended for the supported versions of Adobe Premiere Pro and Windows operating systems described on the product page. Third-party platforms may change their services without notice, which can temporarily affect individual features.' },
      { heading: 'Payments and delivery', body: 'Payments are processed securely by Paddle, our merchant of record. After Paddle confirms a completed transaction, the website provides instant access to the installer. Prices and included updates are shown before checkout.' },
      { heading: 'Updates and support', body: 'Updates included with a lifetime license are provided for the active lifecycle of the product. This does not guarantee that every third-party platform or future host application version will remain supported indefinitely.' },
      { heading: 'Acceptable use', body: 'You are responsible for ensuring you have permission to download and use any media processed with our tools. You must comply with copyright law, platform terms, and all other applicable laws.' },
      { heading: 'Liability', body: 'To the maximum extent permitted by law, software is provided without guarantees of uninterrupted operation. Nothing in these Terms limits rights that cannot legally be excluded.' },
      { heading: 'Contact', body: `Questions about these Terms can be sent to ${SUPPORT_EMAIL}.` },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information we handle', body: 'We store the email address and securely hashed password you provide for your account, registered device identifiers used to enforce licensing, and purchase verification needed to provide your library and downloads. We do not receive or store your complete payment card numbers.' },
      { heading: 'Payments', body: 'Paddle processes checkout, taxes, payment details, receipts, and related customer information as our merchant of record under its own privacy policy.' },
      { heading: 'How information is used', body: 'We use information only to verify purchases, deliver software, provide support, prevent fraud or abuse, and maintain service integrity.' },
      { heading: 'Retention and security', body: 'Purchase-verification records are retained only as reasonably necessary for delivery, support, fraud prevention, and legal obligations. Short-lived download tokens expire automatically.' },
      { heading: 'Your choices and rights', body: 'You may request access to, correction of, or deletion of personal information held directly by us, subject to legal and transaction-record requirements.' },
      { heading: 'Contact', body: `For privacy questions or requests, email ${SUPPORT_EMAIL}.` },
    ],
  },
  refund: {
    title: 'Refund Policy',
    sections: [
      { heading: 'Refund requests', body: `You may request a refund within 14 days of purchase by emailing ${SUPPORT_EMAIL} with your Paddle receipt email and transaction number.` },
      { heading: 'Eligibility', body: 'Refund requests are reviewed based on applicable consumer law and the circumstances of the purchase. Please contact us first if a plugin cannot be installed so our support team can resolve the issue promptly.' },
      { heading: 'Processing', body: 'Paddle is our merchant of record and processes approved refunds back to the original payment method. Bank processing times may vary.' },
      { heading: 'Abuse', body: 'We may decline requests involving fraud, repeated refund abuse, redistribution, license violations, or circumstances where a refund is not required by applicable law.' },
      { heading: 'Contact', body: `To request a refund or ask a question, email ${SUPPORT_EMAIL}.` },
    ],
  },
}

export default function LegalPage({ type }: { type: LegalView }) {
  const policy = policies[type]
  return (
    <div className="editorial-subpage-container">
      <div className="editorial-subpage-header">
        <h1 className="editorial-subpage-title">{policy.title}</h1>
      </div>

      <article className="editorial-article-card">
        <p className="article-updated-date">Last updated: August 2026</p>
        {policy.sections.map((section) => (
          <section key={section.heading} className="article-section">
            <h2 className="article-section-title">{section.heading}</h2>
            <p className="article-section-body">{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  )
}
