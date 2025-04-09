
// Cafe.jsx

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const Cafe = forwardRef(function Cafe({ onLoaded, ...props }, ref) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/CoffeeShop.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current); // ✅ 외부에서 ref 접근 허용

  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ mixer, actions });
    }
  }, [onLoaded, mixer, actions]);

  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
    }
  }, []);

  return (
    <group ref={group} {...props} dispose={null} >
      <group name="Scene">
        <group name="Bone">
          <primitive object={nodes.Root} />
          <primitive object={nodes.HandIKL} />
          <primitive object={nodes.HandIKR} />
          <primitive object={nodes.shinL} />
          <primitive object={nodes.shinR} />
          <primitive object={nodes.thighL_1} />
          <primitive object={nodes.thighR_1} />
          <primitive object={nodes.ArmpoleL} />
          <primitive object={nodes.ArmpoleR} />
          <primitive object={nodes.neutral_bone} />
          <group name="Gamza001">
            <skinnedMesh name="Cube044" geometry={nodes.Cube044.geometry} material={materials['Material.008']} skeleton={nodes.Cube044.skeleton} morphTargetDictionary={nodes.Cube044.morphTargetDictionary} morphTargetInfluences={nodes.Cube044.morphTargetInfluences} />
            <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube044_1.skeleton} morphTargetDictionary={nodes.Cube044_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_1.morphTargetInfluences} />
            <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.009']} skeleton={nodes.Cube044_2.skeleton} morphTargetDictionary={nodes.Cube044_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_2.morphTargetInfluences} />
            <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_3.skeleton} morphTargetDictionary={nodes.Cube044_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_3.morphTargetInfluences} />
            <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_4.skeleton} morphTargetDictionary={nodes.Cube044_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_4.morphTargetInfluences} />
            <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.046']} skeleton={nodes.Cube044_5.skeleton} morphTargetDictionary={nodes.Cube044_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_5.morphTargetInfluences} />
            <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.047']} skeleton={nodes.Cube044_6.skeleton} morphTargetDictionary={nodes.Cube044_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_6.morphTargetInfluences} />
            <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.048']} skeleton={nodes.Cube044_7.skeleton} morphTargetDictionary={nodes.Cube044_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_7.morphTargetInfluences} />
            <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.050']} skeleton={nodes.Cube044_8.skeleton} morphTargetDictionary={nodes.Cube044_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_8.morphTargetInfluences} />
            <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.051']} skeleton={nodes.Cube044_9.skeleton} morphTargetDictionary={nodes.Cube044_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_9.morphTargetInfluences} />
            <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.053']} skeleton={nodes.Cube044_10.skeleton} morphTargetDictionary={nodes.Cube044_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_10.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/CoffeeShop.glb')
