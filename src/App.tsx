import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { useLenis } from '@/hooks/useLenis';
import BackgroundEffects from '@/components/BackgroundEffects';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { AuthProvider } from '@/context/AuthContext';

import HomePage from '@/pages/HomePage';
import DictionaryPage from '@/pages/DictionaryPage';
import ReadMorePage from '@/pages/ReadMorePage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import EmailConfirmationPage from '@/pages/auth/EmailConfirmationPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ProfilePage from '@/pages/auth/ProfilePage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import TermsPage from '@/pages/legal/TermsPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  // Initialize Lenis smooth scrolling
  useLenis();

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Animated Background Graphics */}
      <BackgroundEffects />
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative flex flex-col gap-0 overflow-x-clip min-h-[100dvh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/read-more" element={<ReadMorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
