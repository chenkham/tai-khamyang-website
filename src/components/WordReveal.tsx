import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WordRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  scrollOffset?: string;
  duration?: number;
}

export default function WordReveal({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.06,
  triggerOnScroll = true,
  scrollOffset = '85%',
  duration = 1.0,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word-reveal-inner');

    gsap.set(words, { y: '110%' });

    const tween = gsap.to(words, {
      y: '0%',
      duration,
      delay,
      stagger,
      ease: 'expo.out',
      ...(triggerOnScroll
        ? {
            scrollTrigger: {
              trigger: el,
              start: `top ${scrollOffset}`,
              once: true,
            },
          }
        : {}),
    });

    return () => {
      tween.kill();
      if (triggerOnScroll) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
      }
    };
  }, [text, delay, stagger, triggerOnScroll, scrollOffset, duration]);

  const lines = text.split('\n');

  return (
    <Tag ref={containerRef as any} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split(' ').map((word, i) => (
            <span key={`${lineIndex}-${i}`} className="inline-block overflow-hidden mr-[0.25em]">
              <span className="word-reveal-inner inline-block">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
