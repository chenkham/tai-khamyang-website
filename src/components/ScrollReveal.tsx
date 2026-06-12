import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
  duration = 1.0,
  y = 40,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const childElements = el.children.length > 1 ? Array.from(el.children) : [el];

    gsap.set(childElements, { opacity: 0, y });

    const tween = gsap.to(childElements, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: `top ${(1 - threshold) * 100}%`,
        once,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, stagger, duration, y, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
