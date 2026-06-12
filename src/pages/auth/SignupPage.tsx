import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { account } from '@/lib/appwrite';
import { OAuthProvider, ID } from 'appwrite';
import AuthLayout from './AuthLayout';

export default function SignupPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const navigate = useNavigate();
  const { checkUserStatus } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!agree) {
      setError('You must agree to the Terms and Privacy Policy');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Create User
      await account.create(ID.unique(), email, password, username);
      
      // 2. Login to create session
      await account.createEmailPasswordSession(email, password);
      
      // 3. Trigger Email Verification
      // Create the URL that the user will click in the email
      const verifyUrl = `${window.location.origin}/verify`;
      await account.createVerification(verifyUrl);

      // 4. Update global auth state
      await checkUserStatus();
      
      // 5. Redirect to confirmation page to tell them to check email
      navigate('/email-confirmation');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/`,
        `${window.location.origin}/signup`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = "w-full bg-transparent border-b outline-none py-2 text-[15px] transition-colors";
  
  return (
    <AuthLayout title="Sign Up">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}
        
        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Username
          </label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input 
              type="text" 
              placeholder="Choose a username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${inputClass} pl-7`}
              style={{ 
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              required
            />
          </div>
        </div>

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
              placeholder="Enter your email" 
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

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Password
          </label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Choose a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pl-7 pr-10`}
              style={{ 
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 w-8 h-8 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <svg className="absolute left-0 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder="Repeat your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} pl-7 pr-10`}
              style={{ 
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 w-8 h-8 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              {showConfirmPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3 mt-2">
          <div className="flex items-center h-5">
            <input 
              type="checkbox" 
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-[#CCFF00] dark:focus:ring-[#CCFF00]"
              required
            />
          </div>
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            I accept the{' '}
            <Link to="/terms" className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>Terms and Conditions</Link>
            {' '}and{' '}
            <Link to="/privacy" className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>Privacy Policy</Link>.
          </p>
        </div>

        {/* Signup Button */}
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
          {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
        </button>

        {/* Social Login */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Or Sign Up Using
          </p>
          <div className="flex gap-4">
            {/* Google Modern */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm border"
              style={{ 
                backgroundColor: isLight ? '#ffffff' : '#222222',
                borderColor: isLight ? '#e5e5e5' : '#333333'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Switch to Login */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="text-[14px] font-bold tracking-wide hover:underline uppercase transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            LOGIN
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
