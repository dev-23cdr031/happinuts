import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function GiftBox() {
  const group = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.25;

    if (lidRef.current) {
      lidRef.current.position.y = 0.72 + Math.sin(t * 1.4) * 0.06;
    }
  });

  return (
    <group ref={group}>
      {/* Gift box body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
        <meshStandardMaterial color="#E91E73" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Decorative band */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.62, 0.12, 1.62]} />
        <meshStandardMaterial color="#D9A441" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Gift box lid */}
      <group ref={lidRef} position={[0, 0.72, 0]}>
        <mesh>
          <boxGeometry args={[1.72, 0.28, 1.72]} />
          <meshStandardMaterial color="#D6457A" roughness={0.3} metalness={0.25} />
        </mesh>
        {/* Gold trim on lid */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[1.74, 0.06, 1.74]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Ribbon vertical */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.18, 0.62, 1.75]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[1.75, 0.62, 0.18]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Bow */}
        <mesh position={[-0.22, 0.18, 0]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.2, 0.06, 16, 24, Math.PI]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, -0.5]}>
          <torusGeometry args={[0.2, 0.06, 16, 24, Math.PI]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFF9F5" roughness={0.2} metalness={0.3} />
        </mesh>
      </group>

      {/* Golden coins / nuts spilling out */}
      {[
        [-0.45, 0.18, -0.45],
        [0.45, 0.18, 0.45],
        [-0.5, 0.12, 0.4],
        [0.5, 0.12, -0.4],
        [0, 0.16, -0.58],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0.3, 0.6, 0.2]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#E8C98A" roughness={0.35} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingHearts() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={group}>
      {[
        [-1.8, 0.8, -0.5],
        [1.9, -0.3, -0.3],
        [-0.4, 1.8, -0.8],
        [1.2, 1.5, -0.6],
        [-1.3, -1.3, -0.2],
      ].map((pos, i) => (
        <Float key={i} speed={1.8 + i * 0.3} rotationIntensity={0.8} floatIntensity={1.2}>
          <mesh position={pos as [number, number, number]} scale={0.4 + (i % 3) * 0.15}>
            <torusGeometry args={[0.24, 0.09, 16, 24]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#E91E73' : '#D9A441'} roughness={0.3} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface GiftSceneProps {
  className?: string;
}

export default function GiftScene({ className = '' }: GiftSceneProps) {
  const cameraPos = useMemo(() => [0, 0.7, 6] as [number, number, number], []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 6, 4]} intensity={1.3} color="#FFE0B2" />
          <pointLight position={[-3, -2, 3]} intensity={0.9} color="#E91E73" />
          <pointLight position={[0, 3, -2]} intensity={0.7} color="#19A9E5" />
          <pointLight position={[2, -3, -2]} intensity={0.5} color="#D9A441" />

          <GiftBox />
          <FloatingHearts />

          <Sparkles count={100} scale={9} size={2.5} speed={0.5} opacity={0.6} color="#D9A441" />
          <Sparkles count={70} scale={7} size={2} speed={0.4} opacity={0.5} color="#E91E73" />

          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.35}
            scale={8}
            blur={2.4}
            far={4}
            color="#2C2C2C"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}