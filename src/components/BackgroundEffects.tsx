import { useTheme } from '@/hooks/useTheme';

/**
 * BackgroundEffects — Pure CSS animated background graphics.
 * Replaces the 3D WebGL star with lightweight, GPU-accelerated CSS effects.
 * 
 * Layers (bottom to top):
 * 1. Subtle dot grid pattern
 * 2. Floating gradient orbs (neon green + accent blurs)
 * 3. Noise grain texture overlay
 */
export default function BackgroundEffects() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-0 overflow-hidden">
      
      {/* Layer 1: Dot Grid */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isLight ? 0.4 : 0.15,
          backgroundImage: `radial-gradient(circle, ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Layer 2: Floating gradient orbs */}
      {/* Orb 1 — Large neon green, top-right */}
      <div
        className="absolute rounded-full blur-[120px] md:blur-[160px] animate-float-1"
        style={{
          width: 'clamp(300px, 40vw, 600px)',
          height: 'clamp(300px, 40vw, 600px)',
          top: '-5%',
          right: '-8%',
          background: isLight
            ? 'radial-gradient(circle, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0) 70%)'
            : 'radial-gradient(circle, rgba(204,255,0,0.08) 0%, rgba(204,255,0,0) 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Orb 2 — Soft purple/blue, bottom-left */}
      <div
        className="absolute rounded-full blur-[100px] md:blur-[140px] animate-float-2"
        style={{
          width: 'clamp(250px, 35vw, 500px)',
          height: 'clamp(250px, 35vw, 500px)',
          bottom: '10%',
          left: '-5%',
          background: isLight
            ? 'radial-gradient(circle, rgba(120,80,255,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(120,80,255,0.06) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Orb 3 — Small neon accent, center-left, mobile visible */}
      <div
        className="absolute rounded-full blur-[80px] md:blur-[120px] animate-float-3"
        style={{
          width: 'clamp(150px, 25vw, 350px)',
          height: 'clamp(150px, 25vw, 350px)',
          top: '40%',
          left: '20%',
          background: isLight
            ? 'radial-gradient(circle, rgba(204,255,0,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(204,255,0,0.05) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Orb 4 — Warm amber glow, bottom-right */}
      <div
        className="absolute rounded-full blur-[100px] md:blur-[140px] animate-float-4"
        style={{
          width: 'clamp(200px, 30vw, 450px)',
          height: 'clamp(200px, 30vw, 450px)',
          bottom: '-5%',
          right: '15%',
          background: isLight
            ? 'radial-gradient(circle, rgba(255,180,50,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,180,50,0.04) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Layer 3: Noise grain overlay */}
      <div
        className="absolute inset-0 animate-grain"
        style={{
          opacity: isLight ? 0.03 : 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Layer 4: Vignette (subtle dark edges) */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.04) 100%)'
            : 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
}
