import { useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '@/hooks/useTheme';
import { account } from '@/lib/appwrite';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b outline-none py-2 text-[15px] transition-colors";
  
  return (
    <AuthLayout 
      title="Reset Password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'rgba(204,255,0,0.05)', borderColor: 'var(--border-color)' }}>
            <p className="text-[#CCFF00] font-semibold mb-2">Check your inbox!</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Email */}
            <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Email
          </label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} pl-7`}
              style={{ 
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className={`w-full rounded-full py-3.5 mt-6 flex items-center justify-center text-[15px] font-bold border transition-all hover:scale-[1.02] ${
            isLight 
              ? 'shadow-[0_0_15px_rgba(0,119,34,0.15)] hover:shadow-[0_0_25px_rgba(0,119,34,0.3)]' 
              : 'shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)]'
          }`}
          style={{ 
            color: isLight ? '#007722' : '#CCFF00', 
            borderColor: isLight ? '#007722' : '#CCFF00',
            backgroundColor: isLight ? 'transparent' : 'rgba(204,255,0,0.03)'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
        </button>
        </>
        )}

        {/* Back to Login */}
        <div className="flex flex-col items-center mt-6">
          <Link 
            to="/login" 
            className="text-[14px] font-medium hover:underline transition-opacity flex items-center gap-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Login
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
