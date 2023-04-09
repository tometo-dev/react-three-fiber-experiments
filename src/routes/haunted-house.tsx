import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, MeshProps } from "@react-three/fiber";
import { folder, useControls } from "leva";

import * as wallAssets from "@/assets/haunted-house/textures/bricks";
import * as doorAssets from "@/assets/haunted-house/textures/door";

function Bush(props: MeshProps) {
  return (
    <mesh {...props}>
      <sphereBufferGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#89c854" />
    </mesh>
  );
}

function Door() {
  const textureProps = {
    ...useTexture({
      map: doorAssets.color,
      alphaMap: doorAssets.alpha,
      aoMap: doorAssets.ao,
      displacementMap: doorAssets.height,
      normalMap: doorAssets.normal,
      metalnessMap: doorAssets.metalness,
      roughnessMap: doorAssets.roughness,
    }),
    displacementScale: 0.1,
  };

  return (
    <>
      <pointLight position={[0, 2.2, 2.7]} intensity={1} decay={7} castShadow />
      <mesh name="door" position={[0, 1, 2.001]} receiveShadow>
        <planeBufferGeometry args={[2, 2, 100, 100]} />
        <meshStandardMaterial transparent {...textureProps} />
      </mesh>
    </>
  );
}

function Walls() {
  const textureProps = {
    ...useTexture({
      map: wallAssets.color,
      aoMap: wallAssets.ao,
      normalMap: wallAssets.normal,
      roughnessMap: wallAssets.roughness,
    }),
  };
  return (
    <mesh name="walls" position={[0, 1.25, 0]}>
      <boxBufferGeometry args={[4, 2.5, 4]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

export function HauntedHouse() {
  const ambientLight = useControls("Ambient Light", {
    intensity: { value: 0.5, min: 0, max: 1, step: 0.001 },
  });

  const directionalLight = useControls("Directional Light", {
    intensity: { value: 0.5, min: 0, max: 1, step: 0.001 },
    position: folder({
      x: { value: 4, min: -5, max: 5, step: 0.001 },
      y: { value: 5, min: -5, max: 5, step: 0.001 },
      z: { value: -2, min: -5, max: 5, step: 0.001 },
    }),
  });

  return (
    <Canvas className="h-full w-full" dpr={[1, 2]} camera={{ position: [0, 5, 15] }}>
      <ambientLight intensity={ambientLight.intensity} color="#ffffff" />
      <directionalLight
        intensity={directionalLight.intensity}
        color="#ffffff"
        position={[directionalLight.x, directionalLight.y, directionalLight.z]}
      />
      <OrbitControls enableDamping />
      <group>
        <Walls />

        <mesh name="roof" rotation={[0, Math.PI * 0.25, 0]} position={[0, 2.5 + 0.5, 0]}>
          <coneBufferGeometry args={[3.5, 1, 4]} />
          <meshStandardMaterial color="#b35f45" />
        </mesh>

        <Door />

        <Bush name="bush-1" scale={[0.5, 0.5, 0.5]} position={[0.8, 0.2, 2.2]} />
        <Bush name="bush-2" scale={[0.25, 0.25, 0.25]} position={[1.4, 0.1, 2.1]} />
        <Bush name="bush-3" scale={[0.4, 0.4, 0.4]} position={[-0.8, 0.1, 2.2]} />
        <Bush name="bush-4" scale={[0.15, 0.15, 0.15]} position={[-0.1, 0.05, 2.6]} />
      </group>
      <mesh name="floor" rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[20, 20]} />
        <meshStandardMaterial color="#a9c388" />
      </mesh>
    </Canvas>
  );
}
