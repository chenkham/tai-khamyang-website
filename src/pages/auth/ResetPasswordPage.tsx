import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { account } from '@/lib/appwrite';
import { useTheme } from '@/hooks/useTheme';
import AuthLayout from './AuthLayout';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUserId(params.get('userId'));
    setSecret(params.get('secret'));
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!userId || !secret) {
      setError('Invalid or missing recovery token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await account.updateRecovery(userId, secret, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b outline-none py-2 text-[15px] transition-colors";

  if (!userId || !secret) {
    return (
      <AuthLayout title="Invalid Link">
        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-secondary)' }}>
            This password reset link is invalid or has expired.
          </p>
          <button onClick={() => navigate('/forgot-password')} className="mt-4 hover:underline" style={{ color: 'var(--text-primary)' }}>
            Request a new link
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="New Password" subtitle="Choose a strong new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>New Password</label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Enter new password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pl-7 pr-10`}
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 w-8 h-8 flex items-center justify-center opacity-50 hover:opacity-100"
              style={{ color: 'var(--text-primary)' }}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} pl-7 pr-10`}
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className={`w-full rounded-full py-3.5 mt-2 flex items-center justify-center text-[15px] font-bold border transition-all hover:scale-[1.02] ${
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
          {isLoading ? 'SAVING...' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </AuthLayout>
  );
}
