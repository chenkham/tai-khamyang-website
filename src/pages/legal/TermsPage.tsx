import ScrollReveal from '@/components/ScrollReveal';

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen pt-[calc(var(--navbar-height)+4rem)] pb-20 relative z-10">
      <div className="wm-container max-w-4xl px-6 md:px-12 mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Terms and Conditions
            </h1>
            <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Last Updated: October 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-secondary)' }}>
            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using the Tai Hub platform ("we", "our", or "us"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these Terms, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>2. Tai Khamyang Cultural Heritage & Intellectual Property</h2>
            <p className="mb-4">
              Tai Hub is dedicated to the preservation and educational dissemination of the critically endangered Tai Khamyang language. 
              The unique digital assets provided on this platform are subject to strict cultural property protections:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>3D Models and Assets:</strong> The 3D artifacts, environmental designs, and cultural representations are the intellectual property of the Tai Hub project and are protected under copyright.</li>
              <li><strong>Linguistic Data:</strong> The dictionary database, translations, and audio pronunciation recordings are the cultural heritage of the Tai Khamyang people. </li>
              <li><strong>Prohibition of Scraping:</strong> You are explicitly prohibited from scraping, mass-downloading, redistributing, or monetizing the dictionary data, audio files, or 3D models without explicit, written consent from the Tai Khamyang community council and the Tai Hub administrators.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>3. Educational Use and Content Accuracy</h2>
            <p className="mb-6">
              This platform is an educational resource built on a best-effort basis by community contributors and linguists. Because Tai Khamyang is a critically endangered language, there may be variations in dialect, spelling, or pronunciation. 
              We do not guarantee the absolute academic accuracy of all translations and provide this dictionary "as is" for cultural preservation and learning purposes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>4. User Accounts</h2>
            <p className="mb-6">
              To use certain features (such as saving words to your personal dictionary), you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password.
              We reserve the right to terminate accounts that violate our terms, specifically regarding the unauthorized extraction of cultural data.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>5. Modifications to Service</h2>
            <p className="mb-6">
              We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. 
              We shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
