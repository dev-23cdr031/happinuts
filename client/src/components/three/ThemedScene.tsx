import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export type SceneVariant =
  | 'nuts'      // mixed nut shapes — Shop
  | 'hearts'    // heart-like knots + spheres — Wishlist, Login, About
  | 'leaves'    // leaf-like ellipsoids — Signup
  | 'stars'     // crystal/star octahedrons — Categories, Terms
  | 'gifts'     // tiny gift boxes — Gifting extras
  | 'boxes'     // package boxes — Cart, Shipping
  | 'rings'     // circular rings — Returns
  | 'shields'   // dodecahedron shields — Why Happi Nuts, Privacy
  | 'bubbles'   // chat bubbles with halos — Contact
  | 'sparkles'; // sparkle points — FAQ

interface ThemedSceneProps {
  className?: string;
  variant?: SceneVariant;
  color?: string;
  count?: number;
}

const VARIANT_COLORS: Record<SceneVariant, string[]> = {
  nuts: ['#E8C98A', '#C9975B', '#A8C686', '#8B5A2B'],
  hearts: ['#E91E73', '#D94F5C', '#FF8FB3', '#D9A441'],
  leaves: ['#69A84F', '#8BC34A', '#A5D6A7', '#4A7C3F'],
  stars: ['#D9A441', '#FFC107', '#E91E73', '#19A9E5'],
  gifts: ['#E91E73', '#D9A441', '#D6457A', '#FF8FB3'],
  boxes: ['#19A9E5', '#5BC0EB', '#C9975B', '#E8C98A'],
  rings: ['#69A84F', '#4CAF50', '#19A9E5', '#D9A441'],
  shields: ['#19A9E5', '#5BC0EB', '#E91E73', '#D9A441'],
  bubbles: ['#19A9E5', '#5BC0EB', '#7FD4F3', '#E91E73'],
  sparkles: ['#E91E73', '#D9A441', '#19A9E5', '#FF8FB3'],
};

interface ParticleProps {
  variant: SceneVariant;
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}

const HEART_SHAPE = new THREE.Shape();
HEART_SHAPE.moveTo(0, -0.42);
HEART_SHAPE.bezierCurveTo(-0.62, -0.06, -0.54, 0.42, -0.2, 0.46);
HEART_SHAPE.bezierCurveTo(-0.06, 0.48, 0, 0.32, 0, 0.22);
HEART_SHAPE.bezierCurveTo(0, 0.32, 0.06, 0.48, 0.2, 0.46);
HEART_SHAPE.bezierCurveTo(0.54, 0.42, 0.62, -0.06, 0, -0.42);

function HeartShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      <mesh rotation={[0.08, -0.25, 0.08]}>
        <extrudeGeometry args={[HEART_SHAPE, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 3, curveSegments: 16 }]} />
        <meshStandardMaterial color={color} roughness={0.24} metalness={0.28} />
      </mesh>
    </group>
  );
}

function LeafShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale} rotation={[0.6, 0, 0.4]}>
      <mesh scale={[1, 0.35, 0.6]}>
        <sphereGeometry args={[0.4, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} flatShading />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.42, 0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.28, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} />
      </mesh>
    </group>
  );
}

function StarShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      <mesh rotation={[0.4, 0.6, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0.22, 0.22, 0.1]} scale={0.45}>
        <tetrahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#FFF9F5" roughness={0.3} metalness={0.4} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function GiftShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      {/* Box body */}
      <mesh>
        <boxGeometry args={[0.42, 0.3, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.48]} />
        <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.34, 0.44]} />
        <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

function BoxShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale} rotation={[0.3, 0.5, 0.1]}>
      <mesh>
        <boxGeometry args={[0.5, 0.36, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} flatShading />
      </mesh>
      {/* Tape */}
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.42]} />
        <meshStandardMaterial color="#FFF9F5" roughness={0.5} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

function RingShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      <mesh rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[0.32, 0.08, 16, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Arrow nub to suggest return */}
      <mesh position={[0.34, 0.06, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.09, 0.16, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
}

function ShieldShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      <mesh rotation={[0.5, 0.8, 0.2]}>
        <dodecahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.45} flatShading />
      </mesh>
      {/* Core spark */}
      <mesh scale={0.4}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#FFF9F5" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

function BubbleShape({ color, scale }: { color: string; scale: number }) {
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.15}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Halo ring */}
      <mesh rotation={[0.4, 0.6, 0]}>
        <ringGeometry args={[0.32, 0.38, 24]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.2}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function NutShape({ color, scale, index }: { color: string; scale: number; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * (0.4 + (index % 3) * 0.2);
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t;
  });

  if (index % 4 === 0) {
    // Cashew-like crescent
    return (
      <group ref={ref} scale={scale} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <torusGeometry args={[0.35, 0.18, 16, 24, Math.PI * 0.72]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  if (index % 4 === 1) {
    // Pistachio-like cylinder
    return (
      <mesh ref={ref} scale={scale}>
        <cylinderGeometry args={[0.3, 0.24, 0.55, 20, 1, false, 0, Math.PI * 1.6]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} flatShading />
      </mesh>
    );
  }

  // Almond-like elongated sphere
  return (
    <mesh ref={ref} scale={[scale * 0.9, scale * 1.25, scale * 0.9]}>
      <sphereGeometry args={[0.38, 20, 20]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} flatShading />
    </mesh>
  );
}

function Particle({ variant, position, scale, color, speed }: ParticleProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.32;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.4;
    ref.current.rotation.y = t * 0.6;
    ref.current.rotation.z = Math.cos(t * 0.4) * 0.3;
  });

  const renderShape = () => {
    switch (variant) {
      case 'nuts':
        return <NutShape color={color} scale={scale} index={Math.floor(position[0] * 10 + position[1] * 10)} />;
      case 'hearts':
        return <HeartShape color={color} scale={scale} />;
      case 'leaves':
        return <LeafShape color={color} scale={scale} />;
      case 'stars':
        return <StarShape color={color} scale={scale} />;
      case 'gifts':
        return <GiftShape color={color} scale={scale} />;
      case 'boxes':
        return <BoxShape color={color} scale={scale} />;
      case 'rings':
        return <RingShape color={color} scale={scale} />;
      case 'shields':
        return <ShieldShape color={color} scale={scale} />;
      case 'bubbles':
        return <BubbleShape color={color} scale={scale} />;
      case 'sparkles':
        return <StarShape color={color} scale={scale * 0.6} />;
      default:
        return <StarShape color={color} scale={scale} />;
    }
  };

  return (
    <group ref={ref} position={position}>
      {renderShape()}
    </group>
  );
}

function SceneContent({
  variant,
  color,
  count,
}: {
  variant: SceneVariant;
  color: string;
  count: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.04;
  });

  const items = useMemo(() => {
    const colors = VARIANT_COLORS[variant] ?? [color];
    const positions: [number, number, number][] = [
      [-2.2, 1.6, 0], [2.3, 0.9, -0.5], [-0.8, 2.1, -0.8], [1.7, -1.4, 0.3],
      [-1.9, -1.1, 0.2], [0.5, -1.2, -1], [2.8, -0.2, -0.7], [-2.7, 0.2, -0.4],
      [0.1, 0.4, -1.2], [1.1, 0.2, -1.3], [-1.3, 0.9, -1], [0, -0.5, -1.4],
      [2.9, 0.8, -1], [-2.9, -0.8, -0.9], [0.9, 2.2, -0.5], [-0.7, -2, -0.3],
    ];
    const result: { pos: [number, number, number]; scale: number; speed: number; color: string }[] = [];
    for (let i = 0; i < Math.min(count, positions.length); i++) {
      result.push({
        pos: positions[i],
        scale: 0.5 + ((i * 37) % 10) / 8,
        speed: 0.4 + ((i * 13) % 7) / 10,
        color: colors[i % colors.length],
      });
    }
    return result;
  }, [count, variant, color]);

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} color="#FFE0B2" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color={color} />
      <pointLight position={[2, -3, -2]} intensity={0.5} color="#E91E73" />

      <group ref={groupRef}>
        {items.map((item, i) => (
          <Float key={i} speed={1.5 + (i % 3) * 0.4} rotationIntensity={0.6} floatIntensity={0.9}>
            <Particle
              variant={variant}
              position={item.pos}
              scale={item.scale}
              color={item.color}
              speed={item.speed}
            />
          </Float>
        ))}
      </group>

      <Sparkles count={45} scale={8} size={2} speed={0.35} opacity={0.45} color={color} />
    </>
  );
}

export default function ThemedScene({
  className = '',
  variant = 'nuts',
  color = '#E91E73',
  count = 12,
}: ThemedSceneProps) {
  const cameraPos = useMemo(() => [0, 0, 6.5] as [number, number, number], []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent variant={variant} color={color} count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
}
