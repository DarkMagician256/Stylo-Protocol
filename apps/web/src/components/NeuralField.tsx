"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0005;
      mesh.current.rotation.y += 0.0003;
      
      const time = state.clock.getElapsedTime();
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.001;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#CCFF00"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function NeuralField() {
  return (
    <div className="neural-bg" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.5} />
        <Particles count={3000} />
      </Canvas>
      <div className="neural-grid" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
    </div>
  );
}
