import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function AlbaBoard({ onLoaded, ...props }) {
  const { nodes, materials } = useGLTF('/assets/models/JustBoard.glb')
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
    <group {...props} dispose={null}>
      <group scale={0.467}>
        <mesh geometry={nodes.Cube002_1.geometry} material={materials['Material.003']} />
        <mesh geometry={nodes.Cube002_2.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cube002_3.geometry} material={materials['Material.009']} />
        <mesh geometry={nodes.Cube002_4.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Cube002_5.geometry} material={materials['Material.002']} />
      </group>
      <group rotation={[0, 0, 0.077]} scale={0.412}>
        <mesh geometry={nodes.Cube004_1.geometry} material={materials['Material.014']} />
        <mesh geometry={nodes.Cube004_2.geometry} material={materials['Material.016']} />
        <mesh geometry={nodes.Cube004_3.geometry} material={materials['Material.007']} />
      </group>
      <group position={[0, 3.074, -1.806]} rotation={[0.787, 0, 0]} scale={[0.563, 0.505, 0.417]}>
        <mesh geometry={nodes.Text001_1.geometry} material={materials['Material.038']} />
        <mesh geometry={nodes.Text001_2.geometry} material={materials.Material} />
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/JustBoard.glb')
