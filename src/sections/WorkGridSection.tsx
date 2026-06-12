import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WordReveal from '@/components/WordReveal';

gsap.registerPlugin(ScrollTrigger);

export default function WorkGridSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for cards
      gsap.fromTo(
        '.work-card',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="py-24 md:py-32 lg:py-40 relative z-10">
      <div className="wm-container" ref={containerRef}>
        
        {/* Massive Header */}
        <div className="flex flex-col items-center justify-center mb-16 md:mb-24 text-center">
          <WordReveal 
            text="CULTURE" 
            className="text-[clamp(4rem,12vw,14rem)] font-bold uppercase leading-[0.8] tracking-tighter mb-8"
            as="h2"
          />
          <h3 className="text-xl md:text-2xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
            A living heritage, deeply rooted in tradition.
          </h3>
          <p className="text-base md:text-lg max-w-[60ch] mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover the vibrant festivals, traditional practices, and ancient scripts that define the beautiful Tai Khamyang culture.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="flex flex-col gap-4 md:gap-6">
          
          {/* Top Full Width Card */}
          <div className="work-card relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer bg-[#0c0c0c]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src="/images/language-script.jpg" 
                alt="Avax iPad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            
            {/* Dark Gradient Overlay for Text */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent z-0 pointer-events-none" />

            {/* Content Area */}
            <div className="absolute bottom-0 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between z-10 gap-4">
              <h3 className="text-4xl md:text-6xl font-medium text-white leading-[0.9] tracking-tight">
                ANCIENT<br/>MANUSCRIPTS
              </h3>
              <div className="inline-flex px-6 py-2.5 rounded-full border border-white/30 text-white text-sm md:text-base mb-2 font-medium">
                Pali Scripts
              </div>
            </div>
          </div>

          {/* Bottom Split Cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
            
            {/* Left Card */}
            <div className="work-card relative w-full md:w-1/2 aspect-[4/5] md:aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer bg-[#0A3032]">
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src="/images/faith-viharas.jpg" 
                  alt="Vihara"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#0A3032] via-[#0A3032]/80 to-transparent z-0 pointer-events-none" />

              <div className="absolute bottom-0 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between z-10 gap-4">
                <h3 className="text-3xl md:text-5xl font-medium text-white leading-[0.9] tracking-tight">
                  THE<br/>VIHARA
                </h3>
                <div className="inline-flex px-6 py-2.5 rounded-full border border-white/30 text-white text-sm md:text-base mb-1 font-medium">
                  Monastery Life
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="work-card relative w-full md:w-1/2 aspect-[4/5] md:aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer bg-[#0A1128]">
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src="/images/festivals.jpg" 
                  alt="Festivals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#0A1128] via-[#0A1128]/80 to-transparent z-0 pointer-events-none" />

              <div className="absolute bottom-0 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between z-10 gap-4">
                <h3 className="text-3xl md:text-5xl font-medium text-white leading-[0.9] tracking-tight">
                  FESTIVALS
                </h3>
                <div className="inline-flex px-6 py-2.5 rounded-full border border-white/30 text-white text-sm md:text-base mb-1 font-medium">
                  Community Spirit
                </div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
