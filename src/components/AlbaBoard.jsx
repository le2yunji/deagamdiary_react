import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function AlbaBoard({ onLoaded, ...props }) {
  const { nodes, materials } = useGLTF('/assets/models/JustBoard.glb');
  const group = useRef();

  // ✅ castShadow / receiveShadow 설정
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);

  return (
    <group {...props} ref={group} dispose={null} scale={[1.8, 1.8, 1.5]}>
      <group position={[-1.786, 0, -0.49]}>
        <mesh
          geometry={nodes.Cube002_1.geometry}
          material={materials['Material.003']}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube002_2.geometry}
          material={materials.Material}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube002_3.geometry}
          material={materials['Material.009']}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube002_4.geometry}
          material={materials['Material.001']}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube002_5.geometry}
          material={materials['Material.002']}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}

useGLTF.preload('/assets/models/JustBoard.glb');
