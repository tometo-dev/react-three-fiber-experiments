import { Instance, Instances, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, MeshProps } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useMemo } from "react";
import * as THREE from "three";

import * as wallAssets from "@/assets/haunted-house/textures/bricks";
import * as doorAssets from "@/assets/haunted-house/textures/door";
import * as floorAssets from "@/assets/haunted-house/textures/grass";
import * as graveAssets from "@/assets/haunted-house/textures/grave";

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
  const textureProps = useTexture({
    map: wallAssets.color,
    aoMap: wallAssets.ao,
    normalMap: wallAssets.normal,
    roughnessMap: wallAssets.roughness,
  });

  return (
    <mesh name="walls" position={[0, 1.25, 0]}>
      <boxBufferGeometry args={[4, 2.5, 4]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

function Floor() {
  const textures = useTexture({
    map: floorAssets.color,
    aoMap: floorAssets.ao,
    normalMap: floorAssets.normal,
    roughnessMap: floorAssets.roughness,
  });

  const textureProps = useMemo(() => {
    textures.map.repeat.set(8, 8);
    textures.aoMap.repeat.set(8, 8);
    textures.normalMap.repeat.set(8, 8);
    textures.roughnessMap.repeat.set(8, 8);

    textures.map.wrapS = THREE.RepeatWrapping;
    textures.aoMap.wrapS = THREE.RepeatWrapping;
    textures.normalMap.wrapS = THREE.RepeatWrapping;
    textures.roughnessMap.wrapS = THREE.RepeatWrapping;

    textures.map.wrapT = THREE.RepeatWrapping;
    textures.aoMap.wrapT = THREE.RepeatWrapping;
    textures.normalMap.wrapT = THREE.RepeatWrapping;
    textures.roughnessMap.wrapT = THREE.RepeatWrapping;

    return textures;
  }, [textures]);

  return (
    <mesh name="floor" rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeBufferGeometry args={[20, 20]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

function Grave({ minRadius }: { minRadius: number }) {
  const { rotation: rotationDelta, radius: radiusDelta } = useControls("Grave", {
    radius: { value: 3, min: 0, max: 10 },
    rotation: { value: 0.5, min: -1, max: 1 },
  });

  const { x, z, yRotation, zRotation } = useMemo(() => {
    const angle = Math.random() * Math.PI * 2;
    const radius = minRadius + Math.random() * radiusDelta;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const yRotation = (Math.random() - 0.5) * rotationDelta;
    const zRotation = (Math.random() - 0.5) * rotationDelta;
    return { x, z, yRotation, zRotation };
  }, [minRadius, radiusDelta, rotationDelta]);

  return <Instance position={[x, 0.3, z]} rotation={[0, yRotation, zRotation]} />;
}

function Graves() {
  const { number, minRadius } = useControls("Graves", {
    number: { value: 50, min: 30, max: 100, step: 1 },
    minRadius: { value: 3, min: 3, max: 7, step: 0.01 },
  });

  const textureProps = useTexture({
    map: graveAssets.color,
    roughnessMap: graveAssets.roughness,
  });

  return (
    <Instances>
      <boxGeometry args={[0.6, 0.8, 0.2]} />
      <meshStandardMaterial {...textureProps} />
      {Array.from({ length: number }, (_, i) => (
        <Grave key={i} minRadius={minRadius} />
      ))}
    </Instances>
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

      <Graves />

      <Floor />
    </Canvas>
  );
}
