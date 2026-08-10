import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type NutType = 'almond' | 'cashew' | 'pistachio' | 'walnut' | 'cherry';

interface NutProps {
  type: NutType;
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  color?: string;
}

type SubNutProps = Omit<NutProps, 'type'>;

const NUT_COLORS: Record<NutType, string> = {
  almond: '#C9975B',
  cashew: '#E8C98A',
  pistachio: '#A8C686',
  walnut: '#8B5A2B',
  cherry: '#D94F5C',
};

function Almond({ position, scale = 1, rotationSpeed = 0.5, color = NUT_COLORS.almond }: SubNutProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * rotationSpeed * 0.4;
    mesh.current.rotation.y = t * rotationSpeed;
    mesh.current.rotation.z = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        flatShading
      />
      <mesh position={[0, 0.55, 0]} scale={[0.35, 0.5, 0.35]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
    </mesh>
  );
}

function Cashew({ position, scale = 1, rotationSpeed = 0.5, color = NUT_COLORS.cashew }: SubNutProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    group.current.rotation.y = t * rotationSpeed * 0.8;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Cashew body - crescent shape via scaled torus */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.42, 0.24, 24, 32, Math.PI * 0.75]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Cashew "nipple" */}
      <mesh position={[0.15, -0.15, 0]} scale={[0.3, 0.2, 0.3]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Pistachio({ position, scale = 1, rotationSpeed = 0.5, color = NUT_COLORS.pistachio }: SubNutProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * rotationSpeed;
    group.current.rotation.x = Math.sin(t * 0.6) * 0.2;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.3, 0.75, 24, 1, false, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} flatShading />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#4A6B33" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Walnut({ position, scale = 1, rotationSpeed = 0.5, color = NUT_COLORS.walnut }: SubNutProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * rotationSpeed * 0.6;
    group.current.rotation.z = Math.sin(t * 0.7) * 0.25;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh scale={[1.4, 1, 1.2]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} flatShading />
      </mesh>
      {/* Walnut ridges */}
      <mesh position={[0.1, 0.15, 0.25]} rotation={[0.3, 0.5, 0]}>
        <torusGeometry args={[0.28, 0.08, 16, 32, Math.PI * 0.6]} />
        <meshStandardMaterial color="#6D4A21" roughness={0.6} />
      </mesh>
      <mesh position={[-0.15, -0.12, -0.2]} rotation={[0, -0.3, 0.2]}>
        <torusGeometry args={[0.24, 0.07, 16, 32, Math.PI * 0.5]} />
        <meshStandardMaterial color="#6D4A21" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Cherry({ position, scale = 1, rotationSpeed = 0.5, color = NUT_COLORS.cherry }: SubNutProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * rotationSpeed * 0.5;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    group.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshStandardMaterial color="#4A6B33" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.55, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#4A6B33" roughness={0.5} />
      </mesh>
    </group>
  );
}

function NutMesh({ type, ...props }: NutProps) {
  switch (type) {
    case 'almond':
      return <Almond {...(props as SubNutProps)} />;
    case 'cashew':
      return <Cashew {...(props as SubNutProps)} />;
    case 'pistachio':
      return <Pistachio {...(props as SubNutProps)} />;
    case 'walnut':
      return <Walnut {...(props as SubNutProps)} />;
    case 'cherry':
      return <Cherry {...(props as SubNutProps)} />;
  }
}

interface NutsSceneProps {
  className?: string;
  loading?: 'eager' | 'lazy';
}

const NUTS_CONFIG: {
  type: NutType;
  position: [number, number, number];
  scale: number;
  speed: number;
  floatSpeed: number;
  floatIntensity: number;
}[] = [
  { type: 'almond', position: [-2.4, 1.5, 0], scale: 1.15, speed: 0.45, floatSpeed: 1.8, floatIntensity: 0.7 },
  { type: 'cashew', position: [0, 1.9, -0.8], scale: 1.25, speed: 0.6, floatSpeed: 2.2, floatIntensity: 0.9 },
  { type: 'pistachio', position: [2.4, 1.2, 0.4], scale: 1.0, speed: 0.5, floatSpeed: 1.6, floatIntensity: 0.6 },
  { type: 'walnut', position: [-1.4, -1.4, 0.3], scale: 1.0, speed: 0.4, floatSpeed: 2.0, floatIntensity: 0.8 },
  { type: 'cherry', position: [1.6, -1.6, 0.2], scale: 0.9, speed: 0.55, floatSpeed: 1.9, floatIntensity: 0.7 },
  { type: 'almond', position: [3.1, -0.3, -1], scale: 0.7, speed: 0.6, floatSpeed: 2.4, floatIntensity: 0.9 },
  { type: 'cashew', position: [-3.2, -0.5, -0.6], scale: 0.65, speed: 0.7, floatSpeed: 1.7, floatIntensity: 1.0 },
  { type: 'cherry', position: [0.7, -0.8, -1.4], scale: 0.6, speed: 0.8, floatSpeed: 2.1, floatIntensity: 0.7 },
];

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#FFE0B2" />
      <pointLight position={[-4, -2, 3]} intensity={1.0} color="#E91E73" />
      <pointLight position={[2, -3, -2]} intensity={0.6} color="#19A9E5" />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#D9A441" />

      <group ref={groupRef}>
        {NUTS_CONFIG.map((config, index) => (
          <Float
            key={index}
            speed={config.floatSpeed}
            rotationIntensity={0.6}
            floatIntensity={config.floatIntensity}
          >
            <NutMesh
              type={config.type}
              position={config.position}
              scale={config.scale}
              rotationSpeed={config.speed}
            />
          </Float>
        ))}
      </group>

      <Sparkles
        count={80}
        scale={10}
        size={2.5}
        speed={0.4}
        opacity={0.55}
        color="#E91E73"
      />
      <Sparkles
        count={50}
        scale={7}
        size={3}
        speed={0.3}
        opacity={0.4}
        color="#19A9E5"
      />

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.35}
        scale={12}
        blur={2.6}
        far={4}
        color="#2C2C2C"
      />
    </>
  );
}

export default function NutsScene({ className = '' }: NutsSceneProps) {
  const cameraPos = useMemo(() => [0, 0, 7.2] as [number, number, number], []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}