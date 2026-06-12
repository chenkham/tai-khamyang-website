import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useTheme } from '@/hooks/useTheme';
import { account } from '@/lib/appwrite';
import AuthLayout from './AuthLayout';

export default function VerifyEmailPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyUser = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      const userId = searchParams.get('userId');
      const secret = searchParams.get('secret');

      if (!userId || !secret) {
        setStatus('error');
        setMessage('Invalid or missing verification link.');
        return;
      }

      try {
        await account.updateVerification(userId, secret);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now access all features.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have expired.');
      }
    };

    verifyUser();
  }, [searchParams]);

  return (
    <AuthLayout title="Email Verification">
      <div className="flex flex-col items-center text-center mt-4 gap-6">
        
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-2xl"
             style={{ 
               backgroundColor: isLight ? 'rgba(0,119,34,0.1)' : 'rgba(204,255,0,0.1)',
               border: `1px solid ${isLight ? '#007722' : '#CCFF00'}`
             }}>
          {status === 'verifying' && (
            <svg className="w-8 h-8 animate-spin" style={{ color: isLight ? '#007722' : '#CCFF00' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {status === 'success' && (
            <svg className="w-10 h-10" style={{ color: isLight ? '#007722' : '#CCFF00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === 'error' && (
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h3 className="text-xl font-bold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {status === 'verifying' && 'Verifying your email...'}
          {status === 'success' && 'Verification Complete'}
          {status === 'error' && 'Verification Failed'}
        </h3>

        <p className="text-[15px] leading-relaxed" style={{ color: status === 'error' ? 'rgb(239, 68, 68)' : 'var(--text-secondary)' }}>
          {message}
        </p>

        <div className="flex flex-col w-full gap-4 mt-4">
          <Link 
            to={status === 'success' ? '/' : '/login'}
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
            {status === 'success' ? 'GO TO DICTIONARY' : 'RETURN TO LOGIN'}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
