// Player.jsx
import React, { forwardRef, useEffect, useState, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export const Player = forwardRef((props, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_cycle.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, ref)

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        if (obj.material && obj.material.isMeshStandardMaterial) {
          obj.material.emissive = obj.material.color.clone();     // 기존 색상과 같은 톤으로 발광
          obj.material.emissiveIntensity = 0.05;                   // 발광 정도 (0~1)
        }
      }
    });
  }, [scene]);
  

  useEffect(() => {
    if (ref.current) {
      ref.current.animations = actions; // ✅ 외부에서 제어할 수 있게 저장
    }
  }, [actions]);

  return (
    <group ref={ref} {...props} dispose={null} position={[8, 0, -162]}  scale={[1.2, 1.2, 1.2]} rotation={[0, Math.PI, 0]} > 
      <group name="Scene">
        <group name="Bone" position={[-0.115, 0, 0]}>
          <primitive object={nodes.spine} />
          <primitive object={nodes.spine003} />
          <group name="Head">
            <skinnedMesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['Material.008']} skeleton={nodes.Cube008.skeleton} />
            <skinnedMesh name="Cube008_1" geometry={nodes.Cube008_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube008_1.skeleton} />
            <skinnedMesh name="Cube008_2" geometry={nodes.Cube008_2.geometry} material={materials['Material.005']} skeleton={nodes.Cube008_2.skeleton} />
            <skinnedMesh name="Cube008_3" geometry={nodes.Cube008_3.geometry} material={materials['Material.004']} skeleton={nodes.Cube008_3.skeleton} />
            <skinnedMesh name="Cube008_4" geometry={nodes.Cube008_4.geometry} material={materials['Material.002']} skeleton={nodes.Cube008_4.skeleton} />
            <skinnedMesh name="Cube008_5" geometry={nodes.Cube008_5.geometry} material={materials['Material.003']} skeleton={nodes.Cube008_5.skeleton} />
            <skinnedMesh name="Cube008_6" geometry={nodes.Cube008_6.geometry} material={materials['Material.011']} skeleton={nodes.Cube008_6.skeleton} />
            <skinnedMesh name="Cube008_7" geometry={nodes.Cube008_7.geometry} material={materials['Material.014']} skeleton={nodes.Cube008_7.skeleton} />
            <skinnedMesh name="Cube008_8" geometry={nodes.Cube008_8.geometry} material={materials['Material.015']} skeleton={nodes.Cube008_8.skeleton} />
            <skinnedMesh name="Cube008_9" geometry={nodes.Cube008_9.geometry} material={materials['Material.001']} skeleton={nodes.Cube008_9.skeleton} />
            <skinnedMesh name="Cube008_10" geometry={nodes.Cube008_10.geometry} material={materials['Material.016']} skeleton={nodes.Cube008_10.skeleton} />
          </group>
          <skinnedMesh name="Head003" geometry={nodes.Head003.geometry} material={materials['Material.010']} skeleton={nodes.Head003.skeleton} morphTargetDictionary={nodes.Head003.morphTargetDictionary} morphTargetInfluences={nodes.Head003.morphTargetInfluences} />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_cycle.glb')
