import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

const SERVICES_CARDS = [
  {
    num: "01",
    title: "Origins & Migration",
    desc: "Tracing back to the Khamjang region of Myanmar, the Tai Khamyang people migrated to Assam over several centuries, bringing a rich heritage of Tai customs and beliefs.",
    tags: ['Migration', 'Myanmar Origins', 'Assam Settlement'],
    bgClass: "bg-[#111111]",
    titleClass: "text-white",
    numClass: "text-white/60",
    descClass: "text-neutral-400",
    tagBgClass: "bg-white",
    tagTextClass: "text-black",
  },
  {
    num: "02",
    title: "Theravada Buddhism",
    desc: "A devout community whose villages are centered around beautiful viharas (monasteries). Monks guide the spiritual and daily life of the community through ancient rituals.",
    tags: ['Viharas', 'Pagodas', 'Monastic Life', 'Spiritual Guidance'],
    bgClass: "bg-[#0a0a0a]",
    titleClass: "text-white",
    numClass: "text-white/60",
    descClass: "text-neutral-300",
    tagBgClass: "bg-white",
    tagTextClass: "text-black",
    glow: (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#004d16] via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#11772b] via-transparent to-transparent opacity-40"></div>
      </div>
    )
  },
  {
    num: "03",
    title: "Endangered Language",
    desc: "The Tai Khamyang language belongs to the Southwestern Tai branch. While critically endangered, active efforts in villages like Powaimukh seek to document and preserve it.",
    tags: ['Kra-Dai Family', 'Preservation', 'Oral History'],
    bgClass: "bg-[#e5e5e5]",
    titleClass: "text-black",
    numClass: "text-black/60",
    descClass: "text-neutral-600",
    tagBgClass: "bg-black",
    tagTextClass: "text-white",
  }
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [marqueeVisible, setMarqueeVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Proper Sticky Card Stacking Effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Animate the card shrinking backwards as the NEXT card scrolls up over it
        if (index < cardsRef.current.length - 1) {
          const nextCard = cardsRef.current[index + 1];
          if (!nextCard) return;

          // Each subsequent card sticks 160px lower than the previous one 
          // to perfectly clear the title and number padding area.
          const nextCardStickyTop = `calc(15vh + ${(index + 1) * 160}px)`;

          gsap.to(card, {
            scale: 0.94,
            // REMOVED opacity change so cards don't become transparent when scrolling up/down
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom', // Start animating when the next card enters the viewport
              end: `top ${nextCardStickyTop}`, // Finish when the next card reaches its sticky position
              scrub: true,
            }
          });
        }
      });

      // Scroll-away animation: translates Card 1 and Card 2 upwards at the exact scroll speed
      // once the bottom of the container reaches Card 3's bottom, preventing compression/overlapping.
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        if (index < cardsRef.current.length - 1) {
          const targetY = -(2 - index) * 160;

          gsap.to(card, {
            y: targetY,
            ease: 'none',
            scrollTrigger: {
              trigger: rightColumnRef.current,
              start: () => {
                const cardHeight = window.innerWidth >= 1024 ? 500 : 450;
                const vh = window.innerHeight / 100;
                const pixelValue = 25 * vh + 320 + cardHeight;
                return `bottom ${pixelValue}px`;
              },
              end: () => {
                const cardHeight = window.innerWidth >= 1024 ? 500 : 450;
                const vh = window.innerHeight / 100;
                const pixelValue = 25 * vh + index * 160 + cardHeight;
                return `bottom ${pixelValue}px`;
              },
              scrub: true,
              invalidateOnRefresh: true,
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Toggle marquee visibility when section is in viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => setMarqueeVisible(true),
      onLeave: () => setMarqueeVisible(false),
      onEnterBack: () => setMarqueeVisible(true),
      onLeaveBack: () => setMarqueeVisible(false),
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10"
    >
      {/* Marquee Banner — dedicated space above the columns */}
      <div className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div
          className="flex items-center transition-opacity duration-700"
          style={{ opacity: marqueeVisible ? 1 : 0 }}
        >
          <div
            className="flex shrink-0 animate-marquee-ltr text-[clamp(5rem,15vw,16rem)] font-black uppercase tracking-tighter font-heading whitespace-nowrap"
            style={{
              color: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
              transition: 'color 0.3s ease',
            }}
          >
            <span className="mr-[0.5em]">OUR TRADITIONS</span>
            <span className="mr-[0.5em]">✦</span>
            <span className="mr-[0.5em]">OUR TRADITIONS</span>
            <span className="mr-[0.5em]">✦</span>
            <span className="mr-[0.5em]">OUR TRADITIONS</span>
            <span className="mr-[0.5em]">✦</span>
            <span className="mr-[0.5em]">OUR TRADITIONS</span>
            <span className="mr-[0.5em]">✦</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="wm-container pb-16 md:pb-24 lg:pb-32" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column (Sticky) */}
          <div className="lg:w-[40%]">
            <div className="lg:sticky lg:top-[calc(var(--navbar-height)+4rem)]">
              <h2
                className="text-[clamp(2.5rem,6vw,4rem)] font-bold uppercase leading-[0.9] tracking-tighter mb-8"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                OUR<br/>
                TRADITIONS
              </h2>
              <p className="text-base md:text-lg leading-relaxed max-w-[400px]" style={{ color: 'var(--text-secondary)' }}>
                We focus on preserving the beautiful intersection of language, religion, and community — keeping the Tai Khamyang heritage alive for future generations.
              </p>
            </div>
          </div>

          {/* Right Column (Cards) */}
          <div 
            ref={rightColumnRef}
            className="lg:w-[60%] flex flex-col gap-6 md:gap-8 pt-[10vh] pb-[10vh]"
          >
            
            {SERVICES_CARDS.map((card, index) => (
              <div 
                key={card.num}
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`sticky w-full h-[450px] lg:h-[500px] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col justify-between p-8 md:p-12 shadow-2xl relative ${card.bgClass}`}
                style={{ top: `calc(15vh + ${index * 160}px)` }}
              >
                {card.glow}
                
                <div className="relative z-10 flex justify-between items-start">
                  <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-tight tracking-tight max-w-[60%] lg:max-w-[70%] ${card.titleClass}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {card.title}
                  </h3>
                  <span className={`text-4xl md:text-6xl font-light ${card.numClass}`}>{card.num}</span>
                </div>
                
                <div className="relative z-10 flex flex-col gap-6">
                  <p className={`text-sm md:text-base max-w-[500px] ${card.descClass}`}>
                    {card.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span key={tag} className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium ${card.tagBgClass} ${card.tagTextClass}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}
