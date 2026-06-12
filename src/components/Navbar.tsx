import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Dictionary', href: '/dictionary' },
  { label: 'Read More', href: '/read-more' },
  { label: 'About', href: '/about' },
];

function DharmachakraIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M337.8 205.7l48.6-42.5c13.8 19.3 23.4 41.9 27.4 66.2l-64.4 4.3c-2.4-10.1-6.4-19.5-11.6-28zm140.1 19.5c-5.3-38.8-20.6-74.5-43.2-104.3l.8-.7C449 108.4 449.7 87.6 437 75s-33.4-12-45.2 1.5l-.7 .8c-29.8-22.6-65.5-37.9-104.3-43.2l.1-1.1c1.2-17.9-13-33-30.9-33s-32.1 15.2-30.9 33l.1 1.1c-38.8 5.3-74.5 20.6-104.3 43.2l-.7-.8C108.4 63 87.6 62.3 75 75s-12 33.4 1.5 45.2l.8 .7c-22.6 29.8-37.9 65.5-43.2 104.3l-1.1-.1c-17.9-1.2-33 13-33 30.9s15.2 32.1 33 30.9l1.1-.1c5.3 38.8 20.6 74.5 43.2 104.3l-.8 .7C63 403.6 62.3 424.4 75 437s33.4 12 45.2-1.5l.7-.8c29.8 22.6 65.5 37.9 104.3 43.2l-.1 1.1c-1.2 17.9 13 33 30.9 33s32.1-15.2 30.9-33l-.1-1.1c38.8-5.3 74.5-20.6 104.3-43.2l.7 .8c11.8 13.5 32.5 14.2 45.2 1.5s12-33.4-1.5-45.2l-.8-.7c22.6-29.8 37.9-65.5 43.2-104.3l1.1 .1c17.9 1.2 33-13 33-30.9s-15.2-32.1-33-30.9l-1.1 .1zM163.2 125.6c19.3-13.8 41.9-23.4 66.2-27.5l4.3 64.4c-10 2.4-19.5 6.4-28 11.6l-42.5-48.6zm-65 103.8c4.1-24.4 13.7-46.9 27.5-66.2l48.6 42.5c-5.3 8.5-9.2 18-11.6 28l-64.4-4.3zm27.5 119.4c-13.8-19.3-23.4-41.9-27.5-66.2l64.4-4.3c2.4 10 6.4 19.5 11.6 28l-48.6 42.5zm103.8 65c-24.4-4.1-46.9-13.7-66.2-27.4l42.5-48.6c8.5 5.3 18 9.2 28 11.6l-4.3 64.4zm119.4-27.4c-19.3 13.8-41.9 23.4-66.2 27.4l-4.3-64.4c10-2.4 19.5-6.4 28-11.6l42.5 48.6zm65-103.8c-4.1 24.4-13.7 46.9-27.4 66.2l-48.6-42.5c5.3-8.5 9.2-18 11.6-28l64.4 4.3zm-65-156.9l-42.5 48.6c-8.5-5.3-18-9.2-28-11.6l4.3-64.4c24.4 4.1 46.9 13.7 66.2 27.5zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    </svg>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`group relative overflow-hidden flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:opacity-70 ${isActive ? 'opacity-100' : 'opacity-80'}`}
      style={{ color: 'var(--text-primary)' }}
    >
      {isActive && <DharmachakraIcon size={12} />}
      {label}
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { user } = useAuth();

  const isLight = theme === 'light';
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const currentLinks = [...NAV_LINKS];
  if (user) {
    currentLinks.push({ label: 'Profile', href: '/profile' });
  }

  return (
    <>
      <nav
        ref={navRef}
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-colors duration-500"
        style={{ height: 'var(--navbar-height)' }}
      >
        <div className="h-full w-full flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            <img 
              src="/logo.png" 
              alt="Tai Hub Logo" 
              className="w-10 h-10 object-contain bg-white rounded-full p-0.5"
            />
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <div
              className="relative flex items-center rounded-full p-[3px]"
              style={{
                backgroundColor: '#000', // Always black background
                width: '130px',
                height: '42px',
              }}
            >
              {/* Sliding Pill Background */}
              <div 
                className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full transition-transform duration-500 ease-out-cubic"
                style={{
                  backgroundColor: '#fff', // Always white pill
                  transform: isLight ? 'translateX(0)' : 'translateX(100%)',
                }}
              />

              {/* Light button */}
              <button
                onClick={() => setTheme('light')}
                className="relative z-10 flex-1 flex items-center justify-center h-full rounded-full text-[13px] font-medium transition-colors duration-300"
                style={{ color: isLight ? '#000' : '#fff' }}
              >
                Light
              </button>
              
              {/* Dark button */}
              <button
                onClick={() => setTheme('dark')}
                className="relative z-10 flex-1 flex items-center justify-center h-full rounded-full text-[13px] font-medium transition-colors duration-300"
                style={{ color: !isLight ? '#000' : '#fff' }}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Right: Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {currentLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Right: Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 z-50"
            style={{
              backgroundColor: isLight ? '#000' : '#fff',
            }}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <span 
              className="absolute w-[16px] h-[1.2px] rounded-full transition-all duration-300" 
              style={{ 
                backgroundColor: isLight ? '#fff' : '#000',
                transform: mobileMenuOpen ? 'rotate(45deg)' : 'translateY(-3px)'
              }} 
            />
            <span 
              className="absolute w-[16px] h-[1.2px] rounded-full transition-all duration-300" 
              style={{ 
                backgroundColor: isLight ? '#fff' : '#000',
                transform: mobileMenuOpen ? 'rotate(-45deg)' : 'translateY(3px)'
              }} 
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-40 flex flex-col transition-all duration-500 ease-out lg:hidden overflow-y-auto"
        style={{
          backgroundColor: isLight ? 'var(--bg-primary)' : '#000000',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        {/* Spacer for fixed navbar */}
        <div style={{ height: 'var(--navbar-height)' }} className="shrink-0 relative">
          <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${isLight ? 'bg-black/10' : 'bg-white/25'}`} />
        </div>
        
        {/* Links stretched vertically to distribute dividers evenly down the screen */}
        <div className="flex-1 flex flex-col mt-4 justify-stretch">
          {currentLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <div 
                key={link.href} 
                className={`border-b ${isLight ? 'border-black/10' : 'border-white/25'} px-6 md:px-12 flex-1 flex items-center justify-end`}
              >
                <Link
                  to={link.href}
                  onClick={handleMobileNavClick}
                  className="w-full flex justify-end items-center py-4 md:py-6 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {isActive && <DharmachakraIcon size={28} className="mr-4 shrink-0" />}
                  <span className="text-4xl md:text-5xl font-semibold uppercase tracking-tight font-heading text-right leading-[1.1]">
                    {link.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Auth Section */}
        {!user && (
          <div className="px-6 md:px-12 pt-8 flex gap-4 w-full shrink-0">
            <Link 
              to="/login"
              onClick={handleMobileNavClick}
              className={`flex-1 rounded-full py-4 flex items-center justify-center text-sm font-bold border transition-all hover:scale-105 ${
                isLight 
                  ? 'shadow-[0_0_20px_rgba(0,119,34,0.15)] hover:shadow-[0_0_30px_rgba(0,119,34,0.3)]' 
                  : 'shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]'
              }`}
              style={{ 
                color: isLight ? '#007722' : '#CCFF00', 
                borderColor: isLight ? '#007722' : '#CCFF00' 
              }}
            >
              LOGIN
            </Link>
            <Link 
              to="/signup"
              onClick={handleMobileNavClick}
              className="flex-1 rounded-full py-4 flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              SIGN UP
            </Link>
          </div>
        )}

        {/* Footer CTA */}
        <div className="px-6 md:px-12 py-10 mt-auto shrink-0">
          <a 
            href="tel:6901543900"
            onClick={handleMobileNavClick}
            className="flex items-center justify-between w-full rounded-full p-[8px] pl-8 group transition-transform active:scale-95 shadow-xl border"
            style={{
              backgroundColor: 'rgba(5, 20, 11, 0.95)',
              borderColor: 'rgba(204, 255, 0, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span 
              className="text-xl font-semibold font-body tracking-wide"
              style={{ color: '#ffffff' }}
            >
              Let's talk
            </span>
            <div className="w-12 h-12 rounded-full bg-[#CCFF00] flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
