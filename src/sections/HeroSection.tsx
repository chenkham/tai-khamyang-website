import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-between pt-[calc(var(--navbar-height)+2rem)] pb-10">

      {/* Background Glows (Green Spray Paint Effect - Light Mode Only) */}
      <div className={`absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#CCFF00] blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 ${isLight ? 'opacity-[0.3]' : 'opacity-0'}`} style={{ zIndex: 2 }} />
      <div className={`absolute top-[30%] left-[-15%] w-[40vw] h-[80vh] max-w-[600px] bg-[#CCFF00] blur-[120px] rounded-[100%] pointer-events-none transition-opacity duration-700 ${isLight ? 'opacity-[0.3]' : 'opacity-0'}`} style={{ zIndex: 2 }} />



      {/* Content */}
      <div 
        className={`relative z-10 flex-1 flex flex-col items-center justify-center w-full pointer-events-none transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 
          className="text-center font-bold uppercase leading-[0.85] tracking-tight text-[clamp(2rem,5.5vw,5.5rem)]"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)'
          }}
        >
          <span className="block mb-2">PRESERVING HERITAGE</span>
          <span className="block">TAI KHAMYANG</span>
        </h1>
      </div>

      {/* Bottom Content */}
      <div className={`relative z-10 w-full px-5 flex flex-col items-center justify-end pb-4 transition-all duration-1000 delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <p 
          className="text-sm md:text-base text-center max-w-[70ch] mx-auto mb-10"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          An ancient culture, a critically endangered language, and a resilient community rooted in Theravada Buddhism, residing in the heart of Assam. Discover the heritage of the Tai Khamyang.
        </p>

        {/* Scroll Indicator */}
        <a 
          href="#work" 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto animate-scroll-pulse"
          style={{ backgroundColor: '#CCFF00', color: '#000000' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

    </section>
  );
}
