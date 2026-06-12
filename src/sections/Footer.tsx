import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import ScrollReveal from '@/components/ScrollReveal';

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer 
      id="footer" 
      className="relative z-10 border-t overflow-hidden" 
      style={{ 
        borderColor: 'rgba(204, 255, 0, 0.15)',
        background: 'linear-gradient(180deg, #05140b 0%, #020804 50%, #000000 100%)'
      }}
    >
      {/* Background Graphic Elements - Radial Emerald/Gold Glows */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[500px] bg-[#CCFF00]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[50vw] h-[50vw] max-w-[500px] bg-[#004d16]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* CTA Section */}
      <div id="contact" className="py-24 md:py-32 relative overflow-hidden">
        {/* Soft center glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#004d16]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-content container-pad text-center relative z-10">
          <ScrollReveal>
            <p className="section-label mb-4 tracking-[0.15em]" style={{ color: '#CCFF00' }}>
              WANT TO LEARN MORE?
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <h2 className="display-lg mb-10 text-white font-extrabold tracking-tight">
              LET'S CONNECT
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <a
              href="mailto:taihub20@gmail.com"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(204,255,0,0.25)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]"
              style={{ backgroundColor: '#CCFF00' }}
            >
              Contact Us
              <ArrowRight size={16} />
            </a>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer Info */}
      <div 
        className="py-12 border-t" 
        style={{ 
          backgroundColor: 'rgba(2, 8, 4, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="max-content container-pad">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Contact Info */}
            <div className="flex flex-col gap-2">
              <p className="section-label text-xs tracking-wider mb-2" style={{ color: '#8da897' }}>
                WANT TO KNOW MORE?
              </p>
              <a
                href="mailto:taihub20@gmail.com"
                className="text-lg font-bold text-white hover:text-[#CCFF00] transition-colors"
              >
                taihub20@gmail.com
              </a>
              <p className="text-sm font-medium" style={{ color: '#8da897' }}>
                +91 6901543900
              </p>
            </div>

            {/* Address Info */}
            <div className="flex flex-col gap-2">
              <p className="section-label text-xs tracking-wider mb-2" style={{ color: '#8da897' }}>
                WANT TO VISIT?
              </p>
              <p className="leading-relaxed text-sm font-medium" style={{ color: '#d1fae5' }}>
                Tai Khamyang Village
                <br />
                Tinsukia District, Assam
                <br />
                India
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-2">
              <p className="section-label text-xs tracking-wider mb-3" style={{ color: '#8da897' }}>
                STAY IN THE LOOP
              </p>
              <div className="flex gap-3">
                {['instagram', 'facebook'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 text-white bg-white/5 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] hover:scale-105 active:scale-95"
                    onClick={(e) => e.preventDefault()}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div 
            className="flex flex-col md:flex-row items-center justify-between pt-8 border-t" 
            style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <p className="text-xs font-medium" style={{ color: '#647d6e' }}>
              Tai Khamyang, Tinsukia, Assam, India
            </p>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-medium hover:text-[#CCFF00] transition-colors"
                style={{ color: '#647d6e' }}
              >
                Privacy Policy
              </Link>
              <span style={{ color: 'rgba(255, 255, 255, 0.05)' }}>|</span>
              <Link
                to="/terms"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-medium hover:text-[#CCFF00] transition-colors"
                style={{ color: '#647d6e' }}
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
