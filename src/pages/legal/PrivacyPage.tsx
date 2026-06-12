import ScrollReveal from '@/components/ScrollReveal';

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen pt-[calc(var(--navbar-height)+4rem)] pb-20 relative z-10">
      <div className="wm-container max-w-4xl px-6 md:px-12 mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Last Updated: October 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-secondary)' }}>
            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>1. Introduction</h2>
            <p className="mb-6">
              Tai Hub respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>2. Data We Collect (And What We Don't)</h2>
            <p className="mb-4">
              We believe in minimizing data collection, especially concerning educational tools. 
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Account Data:</strong> If you create an account, we collect your username, email address, and an encrypted version of your password.</li>
              <li><strong>No Voice Tracking:</strong> Although our platform includes audio pronunciation guides for the Tai Khamyang language, we do <strong>not</strong> request microphone access, nor do we record, collect, or store any audio data of you practicing the language.</li>
              <li><strong>No Third-Party Analytics Trackers:</strong> We do not sell your personal data to advertisers.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>3. Local Storage & Saved Words</h2>
            <p className="mb-6">
              To provide a fast and secure learning experience, features such as your <strong>"Saved Words"</strong> list, your preferred Theme (Light/Dark mode), and your UI preferences are stored locally on your device (via LocalStorage) rather than being constantly synced to our servers.
              This means your learning progress and vocabulary focus remains completely private to you.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>4. Data Security</h2>
            <p className="mb-6">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. 
              In addition, we limit access to your personal data to those administrators who have a business need to know.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--text-primary)' }}>5. Your Rights</h2>
            <p className="mb-6">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or restriction of processing.
              If you wish to delete your account and remove your email from our system, please contact us via the "Let's Talk" feature.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
