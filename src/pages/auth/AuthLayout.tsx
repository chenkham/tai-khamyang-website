import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ title, children, subtitle }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-var(--navbar-height))] pt-[calc(var(--navbar-height)+2rem)] pb-20 relative z-10 flex flex-col items-center justify-center">
      <div className="wm-container w-full max-w-[500px] px-5 flex flex-col items-center">
        <ScrollReveal className="w-full">
          <div 
            className="w-full bg-[var(--bg-card)] rounded-3xl border p-8 md:p-10 shadow-2xl relative overflow-hidden"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />
            
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className="w-full">
              {children}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
