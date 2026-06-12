import { useRef, useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

// Preload only greeting + walking
useGLTF.preload('/models/boy_walk.glb');
useGLTF.preload('/models/boy_greet.glb');
useGLTF.preload('/models/girl_walk.glb');
useGLTF.preload('/models/girl_greet.glb');

// ─────────────────────────────────────────────────────────
// Boy Character
// ─────────────────────────────────────────────────────────
function BoyCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  const currentAnimRef = useRef('Greeting');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scene: walkScene, animations: walkAnims } = useGLTF('/models/boy_walk.glb');
  const { animations: greetAnims } = useGLTF('/models/boy_greet.glb');

  const animations = [
    { ...walkAnims[0], name: 'Walk' },
    { ...greetAnims[0], name: 'Greeting' },
  ] as THREE.AnimationClip[];

  // Clone to avoid disappearing on remount while keeping animations functional
  const clonedScene = useMemo(() => SkeletonUtils.clone(walkScene), [walkScene]);

  const { actions } = useAnimations(animations, groupRef);

  const switchAnim = useCallback((name: string) => {
    if (currentAnimRef.current === name || !actions) return;
    const prev = actions[currentAnimRef.current];
    const next = actions[name];
    if (prev) prev.fadeOut(0.4);
    if (next) next.reset().fadeIn(0.4).play();
    currentAnimRef.current = name;
  }, [actions]);

  const moveCharacter = useCallback((
    targetX: number, targetRotY: number, endAnim: string, duration = 1.5
  ) => {
    if (!groupRef.current) return;
    switchAnim('Walk');
    gsap.to(groupRef.current.position, {
      x: targetX, duration, ease: 'power2.inOut', overwrite: true,
      onComplete: () => switchAnim(endAnim),
    });
    gsap.to(groupRef.current.rotation, {
      y: targetRotY, duration: Math.min(duration, 0.8), ease: 'power2.inOut', overwrite: true,
    });
  }, [switchAnim]);

  useEffect(() => {
    if (!actions) return;
    actions['Greeting']?.reset().fadeIn(0).play();
  }, [actions]);

  useEffect(() => {
    if (!groupRef.current) return;

    const centerX    = isMobile ? -0.5 : -1.0;
    const offscreenX = isMobile ? -6   : -8;

    groupRef.current.position.x = centerX;
    groupRef.current.rotation.y = 0;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom 60%',
        onEnter:     () => moveCharacter(offscreenX, -(Math.PI / 2), 'Walk', 1.5),
        onLeaveBack: () => moveCharacter(centerX, 0, 'Greeting', 1.0),
      });

      // Force initial state based on current scroll
      if (window.scrollY > 200) {
        moveCharacter(offscreenX, -(Math.PI / 2), 'Walk', 0);
      } else {
        moveCharacter(centerX, 0, 'Greeting', 0);
      }
    });

    return () => ctx.revert();
  }, [isMobile, moveCharacter]);

  const scale = isMobile ? 1.2 : 1.6;

  return (
    <group ref={groupRef} position={[0, isMobile ? -1.5 : -2, 0]} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// Girl Character
// ─────────────────────────────────────────────────────────
function GirlCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  const currentAnimRef = useRef('Greeting');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scene: walkScene, animations: walkAnims } = useGLTF('/models/girl_walk.glb');
  const { animations: greetAnims } = useGLTF('/models/girl_greet.glb');

  const animations = [
    { ...walkAnims[0], name: 'Walk' },
    { ...greetAnims[0], name: 'Greeting' },
  ] as THREE.AnimationClip[];

  // Clone to avoid disappearing on remount while keeping animations functional
  const clonedScene = useMemo(() => SkeletonUtils.clone(walkScene), [walkScene]);

  const { actions } = useAnimations(animations, groupRef);

  const switchAnim = useCallback((name: string) => {
    if (currentAnimRef.current === name || !actions) return;
    const prev = actions[currentAnimRef.current];
    const next = actions[name];
    if (prev) prev.fadeOut(0.4);
    if (next) next.reset().fadeIn(0.4).play();
    currentAnimRef.current = name;
  }, [actions]);

  const moveCharacter = useCallback((
    targetX: number, targetRotY: number, endAnim: string, duration = 1.5
  ) => {
    if (!groupRef.current) return;
    switchAnim('Walk');
    gsap.to(groupRef.current.position, {
      x: targetX, duration, ease: 'power2.inOut', overwrite: true,
      onComplete: () => switchAnim(endAnim),
    });
    gsap.to(groupRef.current.rotation, {
      y: targetRotY, duration: Math.min(duration, 0.8), ease: 'power2.inOut', overwrite: true,
    });
  }, [switchAnim]);

  useEffect(() => {
    if (!actions) return;
    actions['Greeting']?.reset().fadeIn(0).play();
  }, [actions]);

  useEffect(() => {
    if (!groupRef.current) return;

    const centerX    = isMobile ? 0.5 : 1.0;
    const offscreenX = isMobile ? 6   : 8;

    groupRef.current.position.x = centerX;
    groupRef.current.rotation.y = 0;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom 60%',
        onEnter:     () => moveCharacter(offscreenX, (Math.PI / 2), 'Walk', 1.5),
        onLeaveBack: () => moveCharacter(centerX, 0, 'Greeting', 1.0),
      });

      // Force initial state based on current scroll
      if (window.scrollY > 200) {
        moveCharacter(offscreenX, (Math.PI / 2), 'Walk', 0);
      } else {
        moveCharacter(centerX, 0, 'Greeting', 0);
      }
    });

    return () => ctx.revert();
  }, [isMobile, moveCharacter]);

  const scale = isMobile ? 1.2 : 1.6;

  return (
    <group ref={groupRef} position={[0, isMobile ? -1.5 : -2, 0]} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// Main Scene
// ─────────────────────────────────────────────────────────
export default function KhamyangScene() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-[5]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={isLight ? 2.5 : 1.2} />
        <directionalLight position={[10, 10, 5]} intensity={isLight ? 4.0 : 2.5} />
        <directionalLight position={[-10, -10, -5]} intensity={isLight ? 1.5 : 0.5} color={isLight ? "#ffffff" : "#4466ff"} />
        
        <Suspense fallback={null}>
          <BoyCharacter />
          <GirlCharacter />
        </Suspense>
      </Canvas>
    </div>
  );
}
