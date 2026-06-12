import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CardData {
  id: string;
  label: string;
  icon: React.ReactNode;
}

/* ─── Placeholder SVG logos (clean, geometric, minimal) ─── */

function DictionaryIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 8V40C12 42.2091 13.7909 44 16 44H36C38.2091 44 40 42.2091 40 40V8C40 5.79086 38.2091 4 36 4H16C13.7909 4 12 5.79086 12 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12H8C6.89543 12 6 12.8954 6 14V38C6 41.3137 8.68629 44 12 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16H32M20 24H32M20 32H26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M34 42V38C34 35.8783 33.1571 33.8434 31.6569 32.3431C30.1566 30.8429 28.1217 30 26 30H14C11.8783 30 9.84344 30.8429 8.34315 32.3431C6.84285 33.8434 6 35.8783 6 38V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 22C24.4183 22 28 18.4183 28 14C28 9.58172 24.4183 6 20 6C15.5817 6 12 9.58172 12 14C12 18.4183 15.5817 22 20 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 42V38C41.996 36.2163 41.1738 34.536 39.771 33.398C38.3683 32.26 36.5273 31.7766 34.75 32.067M32 6.273C33.7228 6.55183 35.3117 7.42436 36.4265 8.7051C37.5414 9.98585 38.0894 11.5727 37.9525 13.109C37.8157 14.6453 37.0076 16.0028 35.733 16.8524C34.4583 17.702 32.8361 17.9692 31.25 17.587"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeritageIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 4L6 12V24C6 34 14 42 24 44C34 42 42 34 42 24V12L24 4Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M24 10V16M24 32V38M14 24H20M28 24H34"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

const cards: CardData[] = [
  {
    id: 'dictionary',
    label: '500+ Words Digitized',
    icon: <DictionaryIcon />,
  },
  {
    id: 'community',
    label: 'Community Driven',
    icon: <CommunityIcon />,
  },
  {
    id: 'heritage',
    label: 'Preserving Tai Voices',
    icon: <HeritageIcon />,
  },
];

export default function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tweens: gsap.core.Tween[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      gsap.set(card, { y: '100%', opacity: 0 });

      const baseDuration = 1.0;
      const extraDuration = 0.5 * index;

      const tween = gsap.to(card, {
        y: '0%',
        opacity: 1,
        duration: baseDuration + extraDuration,
        delay: index * 0.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        },
      });

      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-6 md:py-8 relative z-10">
      <div className="wm-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="
                bg-white dark:bg-neutral-800
                rounded-2xl
                aspect-[32/14] md:aspect-[35/16]
                flex flex-col items-center justify-end gap-4
                py-6
                transition-colors duration-200
              "
              style={{ color: 'var(--text-primary)' }}
            >
              {/* Brand icon */}
              <div className="flex items-center justify-center">
                {card.icon}
              </div>

              {/* Label */}
              <span
                className="text-sm font-medium tracking-wide"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-secondary)',
                }}
              >
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
