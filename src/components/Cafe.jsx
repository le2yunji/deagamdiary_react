// Cafe.jsx
import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export const Cafe = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/CafeScene.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current);
  
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.FrontSide;
        }
      });

      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      onLoaded?.({ ref: group.current, mixer, actions });
    }
  }, [actions, mixer, onLoaded]);   

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Empty" position={[1.123, 4.045, 5.167]} scale={0.006}>
          <group name="metarig" rotation={[0, 1.532, 0]} scale={0.646}>
            <group name="Cube001" />
            <primitive object={nodes.spine} />
            <group name="Sphere">
              <skinnedMesh name="Sphere_1" geometry={nodes.Sphere_1.geometry} material={materials.Material} skeleton={nodes.Sphere_1.skeleton} />
              <skinnedMesh name="Sphere_2" geometry={nodes.Sphere_2.geometry} material={materials['Material.048']} skeleton={nodes.Sphere_2.skeleton} />
            </group>
            <group name="Cube023">
              <skinnedMesh name="Cube023_1" geometry={nodes.Cube023_1.geometry} material={materials['Material.001']} skeleton={nodes.Cube023_1.skeleton} morphTargetDictionary={nodes.Cube023_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_1.morphTargetInfluences} />
              <skinnedMesh name="Cube023_2" geometry={nodes.Cube023_2.geometry} material={materials['Material.007']} skeleton={nodes.Cube023_2.skeleton} morphTargetDictionary={nodes.Cube023_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_2.morphTargetInfluences} />
              <skinnedMesh name="Cube023_3" geometry={nodes.Cube023_3.geometry} material={materials['Material.011']} skeleton={nodes.Cube023_3.skeleton} morphTargetDictionary={nodes.Cube023_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_3.morphTargetInfluences} />
              <skinnedMesh name="Cube023_4" geometry={nodes.Cube023_4.geometry} material={materials['Material.012']} skeleton={nodes.Cube023_4.skeleton} morphTargetDictionary={nodes.Cube023_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_4.morphTargetInfluences} />
              <skinnedMesh name="Cube023_5" geometry={nodes.Cube023_5.geometry} material={materials['Material.026']} skeleton={nodes.Cube023_5.skeleton} morphTargetDictionary={nodes.Cube023_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_5.morphTargetInfluences} />
              <skinnedMesh name="Cube023_6" geometry={nodes.Cube023_6.geometry} material={materials['Material.036']} skeleton={nodes.Cube023_6.skeleton} morphTargetDictionary={nodes.Cube023_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_6.morphTargetInfluences} />
              <skinnedMesh name="Cube023_7" geometry={nodes.Cube023_7.geometry} material={materials['Material.037']} skeleton={nodes.Cube023_7.skeleton} morphTargetDictionary={nodes.Cube023_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_7.morphTargetInfluences} />
              <skinnedMesh name="Cube023_8" geometry={nodes.Cube023_8.geometry} material={materials['Material.038']} skeleton={nodes.Cube023_8.skeleton} morphTargetDictionary={nodes.Cube023_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube023_8.morphTargetInfluences} />
            </group>
          </group>
        </group>
        <group name="Empty003" position={[-1.571, 3.852, 0]} scale={0.328}>
          <group name="Bone" position={[1.89, 0, 0]}>
            <primitive object={nodes.Root} />
            <primitive object={nodes.HandIKL} />
            <primitive object={nodes.HandIKR} />
            <primitive object={nodes.shinL_2} />
            <primitive object={nodes.shinR_2} />
            <primitive object={nodes.thighL_2} />
            <primitive object={nodes.thighR_2} />
            <primitive object={nodes.ArmpoleL} />
            <primitive object={nodes.ArmpoleR} />
            <primitive object={nodes.neutral_bone} />
            <group name="Cube044">
              <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.008']} skeleton={nodes.Cube044_1.skeleton} morphTargetDictionary={nodes.Cube044_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_1.morphTargetInfluences} />
              <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.010']} skeleton={nodes.Cube044_2.skeleton} morphTargetDictionary={nodes.Cube044_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_2.morphTargetInfluences} />
              <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.006']} skeleton={nodes.Cube044_3.skeleton} morphTargetDictionary={nodes.Cube044_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_3.morphTargetInfluences} />
              <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.009']} skeleton={nodes.Cube044_4.skeleton} morphTargetDictionary={nodes.Cube044_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_4.morphTargetInfluences} />
              <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_5.skeleton} morphTargetDictionary={nodes.Cube044_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_5.morphTargetInfluences} />
              <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_6.skeleton} morphTargetDictionary={nodes.Cube044_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_6.morphTargetInfluences} />
              <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.046']} skeleton={nodes.Cube044_7.skeleton} morphTargetDictionary={nodes.Cube044_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_7.morphTargetInfluences} />
              <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.047']} skeleton={nodes.Cube044_8.skeleton} morphTargetDictionary={nodes.Cube044_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_8.morphTargetInfluences} />
              <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.048']} skeleton={nodes.Cube044_9.skeleton} morphTargetDictionary={nodes.Cube044_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_9.morphTargetInfluences} />
              <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.014']} skeleton={nodes.Cube044_10.skeleton} morphTargetDictionary={nodes.Cube044_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_10.morphTargetInfluences} />
              <skinnedMesh name="Cube044_11" geometry={nodes.Cube044_11.geometry} material={materials['Material.051']} skeleton={nodes.Cube044_11.skeleton} morphTargetDictionary={nodes.Cube044_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_11.morphTargetInfluences} />
              <skinnedMesh name="Cube044_12" geometry={nodes.Cube044_12.geometry} material={materials['Material.002']} skeleton={nodes.Cube044_12.skeleton} morphTargetDictionary={nodes.Cube044_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_12.morphTargetInfluences} />
              <skinnedMesh name="Cube044_13" geometry={nodes.Cube044_13.geometry} material={materials['Material.025']} skeleton={nodes.Cube044_13.skeleton} morphTargetDictionary={nodes.Cube044_13.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_13.morphTargetInfluences} />
              <skinnedMesh name="Cube044_14" geometry={nodes.Cube044_14.geometry} material={materials['Material.030']} skeleton={nodes.Cube044_14.skeleton} morphTargetDictionary={nodes.Cube044_14.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_14.morphTargetInfluences} />
              <skinnedMesh name="Cube044_15" geometry={nodes.Cube044_15.geometry} material={materials['Material.034']} skeleton={nodes.Cube044_15.skeleton} morphTargetDictionary={nodes.Cube044_15.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_15.morphTargetInfluences} />
              <skinnedMesh name="Cube044_16" geometry={nodes.Cube044_16.geometry} material={materials['Material.035']} skeleton={nodes.Cube044_16.skeleton} morphTargetDictionary={nodes.Cube044_16.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_16.morphTargetInfluences} />
            </group>
          </group>
          <group name="Gamza001" />
          <mesh name="Gamza003" geometry={nodes.Gamza003.geometry} material={materials['Material.027']} position={[0.583, 3.726, -0.139]} scale={[1, 1.463, 1]} />
        </group>


        
        <group name="Coffee" position={[-0.882, 3.451, 0]}>
          <mesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials['Material.014']} />
          <mesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={materials['Material.013']} />
          <mesh name="Cylinder004_2" geometry={nodes.Cylinder004_2.geometry} material={materials['Material.015']} />
        </group>
        <group name="Cube002" position={[-0.375, 3.212, -4.123]} rotation={[0, -0.851, 0]} scale={[0.346, 0.309, 0.346]}>
          <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.035']} />
          <mesh name="Cube003_1" geometry={nodes.Cube003_1.geometry} material={materials['Material.014']} />
        </group>
        <group name="Cube043" position={[-1.324, 2.313, 2.903]} rotation={[0, -0.894, 0]} scale={0.004}>
          <mesh name="Cube051" geometry={nodes.Cube051.geometry} material={materials['Material.024']} />
          <mesh name="Cube051_1" geometry={nodes.Cube051_1.geometry} material={materials['Material.003']} />
          <mesh name="Cube051_2" geometry={nodes.Cube051_2.geometry} material={materials['Material.039']} />
        </group>
        <group name="Cylinder" position={[-0.344, 3.698, -3.982]} rotation={[Math.PI, -1.068, Math.PI]} scale={[0.001, 0.013, 0.001]}>
          <mesh name="Cylinder_1" geometry={nodes.Cylinder_1.geometry} material={materials['Material.014']} />
          <mesh name="Cylinder_2" geometry={nodes.Cylinder_2.geometry} material={materials.Material} />
          <mesh name="Cylinder_3" geometry={nodes.Cylinder_3.geometry} material={materials['Material.004']} />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/CafeScene.glb')
