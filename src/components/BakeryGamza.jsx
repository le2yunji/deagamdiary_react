// BakeryGamza.jsx
import React, { useEffect, forwardRef } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const BakeryGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/CafeGamza1.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  // ✅ 외부 전달용 mixer, actions 등록
  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ ref: group.current, mixer, actions });
    }
  }, [onLoaded, mixer, actions]);
    // ✅ 외부 ref 연결
    useEffect(() => {
      if (ref && group.current) {
        if (typeof ref === 'function') {
          ref(group.current);
        } else {
          ref.current = group.current;
        }
      }
    }, [ref]);
        
      // 그림자 설정
      useEffect(() => {
        if (ref?.current) {
          ref.current.traverse((child) => {
            if (child.isMesh) child.castShadow = true;
          });
        }
      }, [ref])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="GamzaBone" position={[2.318, 1.758, 6.949]} rotation={[0, -0.473, 0]}>
          <primitive object={nodes.Root} />
          <primitive object={nodes.HandIKL} />
          <primitive object={nodes.HandIKR} />
          <primitive object={nodes.shinL_1} />
          <primitive object={nodes.shinR_1} />
          <primitive object={nodes.thighL_1} />
          <primitive object={nodes.thighR_1} />
          <primitive object={nodes.ArmpoleL} />
          <primitive object={nodes.ArmpoleR} />
          <primitive object={nodes.neutral_bone} />
          <group name="Gamza003">
            <skinnedMesh name="Cube059" geometry={nodes.Cube059.geometry} material={materials['Material.058']} skeleton={nodes.Cube059.skeleton} morphTargetDictionary={nodes.Cube059.morphTargetDictionary} morphTargetInfluences={nodes.Cube059.morphTargetInfluences} />
            <skinnedMesh name="Cube059_1" geometry={nodes.Cube059_1.geometry} material={materials['Material.059']} skeleton={nodes.Cube059_1.skeleton} morphTargetDictionary={nodes.Cube059_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_1.morphTargetInfluences} />
            <skinnedMesh name="Cube059_2" geometry={nodes.Cube059_2.geometry} material={materials['Material.060']} skeleton={nodes.Cube059_2.skeleton} morphTargetDictionary={nodes.Cube059_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_2.morphTargetInfluences} />
            <skinnedMesh name="Cube059_3" geometry={nodes.Cube059_3.geometry} material={materials['Material.061']} skeleton={nodes.Cube059_3.skeleton} morphTargetDictionary={nodes.Cube059_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_3.morphTargetInfluences} />
            <skinnedMesh name="Cube059_4" geometry={nodes.Cube059_4.geometry} material={materials['Material.063']} skeleton={nodes.Cube059_4.skeleton} morphTargetDictionary={nodes.Cube059_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_4.morphTargetInfluences} />
            <skinnedMesh name="Cube059_5" geometry={nodes.Cube059_5.geometry} material={materials['Material.064']} skeleton={nodes.Cube059_5.skeleton} morphTargetDictionary={nodes.Cube059_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_5.morphTargetInfluences} />
            <skinnedMesh name="Cube059_6" geometry={nodes.Cube059_6.geometry} material={materials['Material.067']} skeleton={nodes.Cube059_6.skeleton} morphTargetDictionary={nodes.Cube059_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_6.morphTargetInfluences} />
            <skinnedMesh name="Cube059_7" geometry={nodes.Cube059_7.geometry} material={materials['Material.070']} skeleton={nodes.Cube059_7.skeleton} morphTargetDictionary={nodes.Cube059_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_7.morphTargetInfluences} />
            <skinnedMesh name="Cube059_8" geometry={nodes.Cube059_8.geometry} material={materials['Material.071']} skeleton={nodes.Cube059_8.skeleton} morphTargetDictionary={nodes.Cube059_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube059_8.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/CafeGamza1.glb')
