"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------
// 1. EDUCATION CARD COMPONENT
// ---------------------------------------------------------
const EducationCard = ({ title, radius, speed, angleOffset }) => {
  const groupRef = useRef();
  const htmlRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const angle = (t * speed) + angleOffset;
    
    // Mathematical orbit path
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    // Subtle organic floating on Y axis
    const y = Math.sin(t * 1.5 + angleOffset) * 0.3;

    groupRef.current.position.set(x, y, z);

    // Calculate Z-Depth (0 = furthest back, 1 = front-most)
    const depth = (z + radius) / (radius * 2);

    if (htmlRef.current) {
      // 3D Depth Scaling & Opacity
      const scale = 0.75 + (depth * 0.4); 
      htmlRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
      htmlRef.current.style.opacity = 0.3 + (depth * 0.7);
      htmlRef.current.style.zIndex = Math.round(depth * 100);

      // Active State Highlighting (When closest to camera)
      if (depth > 0.85) {
        htmlRef.current.classList.add('border-indigo-400', 'shadow-indigo-500/30', 'bg-white/95');
        htmlRef.current.classList.remove('border-white/40', 'bg-white/70');
      } else {
        htmlRef.current.classList.remove('border-indigo-400', 'shadow-indigo-500/30', 'bg-white/95');
        htmlRef.current.classList.add('border-white/40', 'bg-white/70');
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Light pulse following the card */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#4F46E5" transparent opacity={0.6} />
      </mesh>
      
      {/* Standard DOM rendering for perfect text sharpness */}
      <Html center sprite zIndexRange={[100, 0]}>
        <div
          ref={htmlRef}
          className="px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/40 bg-white/70 shadow-xl shadow-indigo-500/5 text-[#0F172A] font-semibold tracking-tight whitespace-nowrap transition-colors duration-500 will-change-transform"
        >
          {title}
        </div>
      </Html>
    </group>
  );
};

// ---------------------------------------------------------
// 2. ORBIT RINGS COMPONENT
// ---------------------------------------------------------
const OrbitRing = ({ radius }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6366F1" transparent opacity={0.15} linewidth={1} />
    </line>
  );
};

// ---------------------------------------------------------
// 3. MAIN SCENE COMPOSITION
// ---------------------------------------------------------
const Scene = () => {
  const { viewport } = useThree();
  const sceneRef = useRef();

  // Scale down beautifully on mobile devices
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.6 : 1;

  // Premium subtle mouse parallax
  useFrame((state) => {
    const targetX = (state.pointer.y * 0.1) + 0.15; // Base tilt
    const targetY = state.pointer.x * 0.1;
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, targetX, 0.02);
    sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, targetY, 0.02);
  });

  return (
    <group ref={sceneRef} scale={scale}>
      {/* Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#DBEAFE" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#4F46E5" distance={10} />

      {/* DNS Knowledge Core (Center) */}
      <group>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial 
            transmission={0.9} 
            opacity={1} 
            transparent 
            roughness={0.1} 
            thickness={2} 
            ior={1.5} 
            color="#DBEAFE" 
          />
        </mesh>
        <Html center className="pointer-events-none">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold tracking-widest text-[#3730A3] opacity-80">DNS</span>
            <span className="text-[8px] font-bold tracking-wider text-[#4F46E5] opacity-60">CORE</span>
          </div>
        </Html>
      </group>

      {/* The 6 Exact Education Levels */}
      <group>
        {/* Inner Orbit */}
        <OrbitRing radius={2.2} />
        <EducationCard title="10th" radius={2.2} speed={0.25} angleOffset={0} />
        <EducationCard title="12th" radius={2.2} speed={0.25} angleOffset={Math.PI} />

        {/* Middle Orbit */}
        <OrbitRing radius={3.6} />
        <EducationCard title="Diploma" radius={3.6} speed={0.18} angleOffset={Math.PI / 2} />
        <EducationCard title="Graduation" radius={3.6} speed={0.18} angleOffset={(3 * Math.PI) / 2} />

        {/* Outer Orbit */}
        <OrbitRing radius={5.0} />
        <EducationCard title="Post Graduation" radius={5.0} speed={0.12} angleOffset={Math.PI / 4} />
        <EducationCard title="Professional Courses" radius={5.0} speed={0.12} angleOffset={(5 * Math.PI) / 4} />
      </group>

      {/* Background Knowledge Particles */}
      <Sparkles count={isMobile ? 150 : 400} scale={12} size={1.5} speed={0.2} opacity={0.3} color="#6366F1" />
      <Sparkles count={isMobile ? 50 : 100} scale={10} size={2.5} speed={0.1} opacity={0.15} color="#7C3AED" />
    </group>
  );
};

export default function EducationOrbit() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]} // Cap pixel ratio for performance
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0 z-0 pointer-events-auto"
    >
      <Scene />
    </Canvas>
  );
}