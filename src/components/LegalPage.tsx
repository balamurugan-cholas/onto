import type { View } from './Navbar'

export type LegalView = Extract<View, 'terms' | 'privacy' | 'refund'>
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

const policies: Record<LegalView, { title: string; sections: Array<{ heading: string; body: string }> }> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: 'Agreement', body: 'These Terms govern your purchase and use of VPlay, a downloadable plugin sold by ONTO. By purchasing, downloading, or using VPlay, you agree to these Terms.' },
      { heading: 'License', body: 'A completed purchase grants you a limited, non-exclusive, non-transferable license to install and use VPlay for your own editing work. You may not resell, redistribute, share, reverse engineer, or provide the installer or download access to another person.' },
      { heading: 'Product and compatibility', body: 'VPlay is intended for the supported versions of Adobe Premiere Pro and operating systems described on the product page. Third-party platforms may change their services without notice, which can temporarily affect individual download features.' },
      { heading: 'Payments and delivery', body: 'Payments are processed by Paddle, our merchant of record. After Paddle confirms a completed transaction, the website provides access to the VPlay installer. Prices and included updates are shown on the product page before checkout.' },
      { heading: 'Updates and support', body: 'Updates included with a lifetime license are provided for the lifetime of the VPlay product. This does not guarantee that every third-party platform or future host application version will remain supported.' },
      { heading: 'Acceptable use', body: 'You are responsible for ensuring you have permission to download and use any media processed with VPlay. You must comply with copyright law, platform terms, and all other applicable laws.' },
      { heading: 'Liability', body: 'To the maximum extent permitted by law, VPlay is provided without guarantees of uninterrupted operation. ONTO is not liable for indirect, incidental, or consequential loss. Nothing in these Terms limits rights that cannot legally be excluded.' },
      { heading: 'Contact', body: `Questions about these Terms can be sent to ${SUPPORT_EMAIL}.` },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information we handle', body: 'ONTO may receive information you provide when contacting support and limited purchase information needed to verify access, such as a Paddle transaction identifier and product identifier. We do not receive or store your complete payment-card details.' },
      { heading: 'Payments', body: 'Paddle processes checkout, taxes, payment details, receipts, and related customer information as our merchant of record. Paddle handles that information under its own privacy policy.' },
      { heading: 'How information is used', body: 'We use information only to verify purchases, deliver VPlay, provide support, prevent fraud or abuse, maintain the service, and comply with legal obligations.' },
      { heading: 'Service providers', body: 'The website and fulfillment system use service providers including Paddle, Cloudflare, and GitHub. These providers may process technical information required to operate, secure, and deliver the service.' },
      { heading: 'Retention and security', body: 'Purchase-verification records are retained only as reasonably necessary for delivery, support, fraud prevention, and legal obligations. Short-lived download tokens expire automatically. No internet service can guarantee absolute security.' },
      { heading: 'Your choices and rights', body: 'You may request access to, correction of, or deletion of personal information held directly by ONTO, subject to legal and transaction-record requirements. Requests relating to Paddle-held payment data may also need to be directed to Paddle.' },
      { heading: 'Contact', body: `For privacy questions or requests, email ${SUPPORT_EMAIL}.` },
    ],
  },
  refund: {
    title: 'Refund Policy',
    sections: [
      { heading: 'Refund requests', body: `You may request a refund within 14 days of purchase by emailing ${SUPPORT_EMAIL} with the Paddle receipt email and transaction number. Do not send payment-card details.` },
      { heading: 'Eligibility', body: 'Refund requests are reviewed based on applicable consumer law and the circumstances of the purchase. Please contact us first if VPlay is defective or cannot be installed so we can attempt to resolve the issue promptly. This policy does not limit any mandatory consumer rights.' },
      { heading: 'Processing', body: 'Paddle is our merchant of record and processes approved refunds back to the original payment method. Bank and payment-provider processing times may vary.' },
      { heading: 'Abuse', body: 'We may decline requests involving fraud, repeated refund abuse, redistribution, license violations, or circumstances where a refund is not required by applicable law.' },
      { heading: 'Contact', body: `To request a refund or ask a question, email ${SUPPORT_EMAIL}.` },
    ],
  },
}

export default function LegalPage({ type }: { type: LegalView }) {
  const policy = policies[type]
  return (
    <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px 48px', position: 'relative', zIndex: 10 }}>
      <article style={{ width: 'min(820px, 100%)', margin: '0 auto', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', padding: 'clamp(22px, 5vw, 48px)' }}>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Anton', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400 }}>{policy.title}</h1>
        <p style={{ margin: '0 0 28px', color: 'rgba(0,0,0,0.55)', fontSize: 13 }}>Last updated: August 29, 2026</p>
        {policy.sections.map((section) => (
          <section key={section.heading} style={{ marginTop: 24 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>{section.heading}</h2>
            <p style={{ margin: 0, color: 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.75 }}>{section.body}</p>
          </section>
        ))}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ display: 'inline-block', marginTop: 30, color: '#000', fontWeight: 700 }}>{SUPPORT_EMAIL}</a>
      </article>
    </main>
  )
}
