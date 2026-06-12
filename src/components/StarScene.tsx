import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ProceduralStar({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const modelRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 2;
    const innerRadius = 0.5;
    const points = 4;
    
    for (let i = 0; i <= points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 3,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame(() => {
    if (modelRef.current) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY.current / maxScroll : 0;
      const targetY = scrollProgress * Math.PI * 6;
      modelRef.current.rotation.y += (targetY - modelRef.current.rotation.y) * 0.1;
      modelRef.current.rotation.x += (mouseRef.current.y * 0.5 - modelRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <group ref={modelRef} scale={1.2} position={[0, -0.5, -1]}>
      <mesh geometry={starGeometry}>
        <meshPhysicalMaterial 
          color={0xCCFF00} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function StarScene() {
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-[5]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <Suspense fallback={null}>
          <ProceduralStar scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
