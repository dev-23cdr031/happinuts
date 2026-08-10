import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface MiniNutFieldProps {
  className?: string;
  color?: string;
  count?: number;
}

function NutSphere({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed;
    mesh.current.rotation.x = t * 0.5;
    mesh.current.rotation.y = t;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[0.4, 24, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} flatShading />
    </mesh>
  );
}

function SceneContent({ color, count }: { color: string; count: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.04;
  });

  const nuts = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number; speed: number }[] = [];
    const positions = [
      [-2.2, 1.6, 0], [2.3, 0.9, -0.5], [-0.8, 2.1, -0.8], [1.7, -1.4, 0.3],
      [-1.9, -1.1, 0.2], [0.5, -1.2, -1], [2.8, -0.2, -0.7], [-2.7, 0.2, -0.4],
      [0.1, 0.4, -1.2], [1.1, 0.2, -1.3], [-1.3, 0.9, -1], [0, -0.5, -1.4],
      [2.9, 0.8, -1], [-2.9, -0.8, -0.9], [0.9, 2.2, -0.5], [-0.7, -2, -0.3],
    ];
    for (let i = 0; i < Math.min(count, positions.length); i++) {
      items.push({
        pos: positions[i] as [number, number, number],
        scale: 0.5 + Math.random() * 0.8,
        speed: 0.4 + Math.random() * 0.6,
      });
    }
    return items;
  }, [count]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 3]} intensity={1} color="#FFE0B2" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color={color} />

      <group ref={group}>
        {nuts.map((nut, i) => (
          <Float key={i} speed={1.5 + (i % 3) * 0.4} rotationIntensity={0.5} floatIntensity={0.8}>
            <NutSphere
              position={nut.pos}
              scale={nut.scale}
              color={i % 3 === 0 ? '#E8C98A' : i % 3 === 1 ? '#C9975B' : color}
              speed={nut.speed}
            />
          </Float>
        ))}
      </group>

      <Sparkles count={40} scale={8} size={2} speed={0.3} opacity={0.4} color={color} />
    </>
  );
}

export default function MiniNutField({ className = '', color = '#E91E73', count = 12 }: MiniNutFieldProps) {
  const cameraPos = useMemo(() => [0, 0, 6.5] as [number, number, number], []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent color={color} count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
}