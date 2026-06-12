import { Link } from 'react-router';
import { useTheme } from '@/hooks/useTheme';
import AuthLayout from './AuthLayout';

export default function EmailConfirmationPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <AuthLayout title="Check Your Inbox">
      <div className="flex flex-col items-center text-center mt-4 gap-6">
        
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-2xl"
             style={{ 
               backgroundColor: isLight ? 'rgba(0,119,34,0.1)' : 'rgba(204,255,0,0.1)',
               border: `1px solid ${isLight ? '#007722' : '#CCFF00'}`
             }}>
          <svg className="w-10 h-10" style={{ color: isLight ? '#007722' : '#CCFF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          We've sent an email with a link to confirm your account. 
          Please check your inbox (and your spam folder, just in case).
        </p>

        <div className="flex flex-col w-full gap-4 mt-4">
          <Link 
            to="/login"
            className={`w-full rounded-full py-3.5 flex items-center justify-center text-[15px] font-bold border transition-all hover:scale-[1.02] ${
              isLight 
                ? 'shadow-[0_0_15px_rgba(0,119,34,0.15)] hover:shadow-[0_0_25px_rgba(0,119,34,0.3)]' 
                : 'shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)]'
            }`}
            style={{ 
              color: isLight ? '#007722' : '#CCFF00', 
              borderColor: isLight ? '#007722' : '#CCFF00',
              backgroundColor: isLight ? 'transparent' : 'rgba(204,255,0,0.03)'
            }}
          >
            RETURN TO LOGIN
          </Link>

          <button 
            type="button"
            className="text-[13px] font-medium hover:underline opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            Didn't receive the email? Resend.
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
