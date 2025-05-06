// components/BakeryGamza.jsx
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { useGraph } from '@react-three/fiber'

export const BakeryGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/BakeryGamza-draco.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
  useEffect(() => {
    if (onLoaded && group.current) {
      // 애니메이션 반복 없이 설정
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ ref: group.current, mixer, actions });
    }
  }, [onLoaded, mixer, actions]);

  // 모든 mesh에 castShadow 적용
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
        // if (child.isMesh) child.receiveShadow = true;
      }); 
    }
  }, []); 


  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Empty001" position={[2.356, 3.85, -2.197]} rotation={[0, -0.414, 0]} scale={0.027}>
          <group name="Gamza001">
            <group position={[2.336, 3.848, -2.224]} scale={[1, 1, 1]}>
              <skinnedMesh name="mesh_0" geometry={nodes.mesh_0.geometry} material={materials['Material.058']} skeleton={nodes.mesh_0.skeleton} morphTargetDictionary={nodes.mesh_0.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_1" geometry={nodes.mesh_0_1.geometry} material={materials['Material.059']} skeleton={nodes.mesh_0_1.skeleton} morphTargetDictionary={nodes.mesh_0_1.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_1.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_2" geometry={nodes.mesh_0_2.geometry} material={materials['Material.060']} skeleton={nodes.mesh_0_2.skeleton} morphTargetDictionary={nodes.mesh_0_2.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_2.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_3" geometry={nodes.mesh_0_3.geometry} material={materials['Material.061']} skeleton={nodes.mesh_0_3.skeleton} morphTargetDictionary={nodes.mesh_0_3.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_3.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_4" geometry={nodes.mesh_0_4.geometry} material={materials['Material.063']} skeleton={nodes.mesh_0_4.skeleton} morphTargetDictionary={nodes.mesh_0_4.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_4.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_5" geometry={nodes.mesh_0_5.geometry} material={materials['Material.064']} skeleton={nodes.mesh_0_5.skeleton} morphTargetDictionary={nodes.mesh_0_5.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_5.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_6" geometry={nodes.mesh_0_6.geometry} material={materials['Material.067']} skeleton={nodes.mesh_0_6.skeleton} morphTargetDictionary={nodes.mesh_0_6.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_6.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_7" geometry={nodes.mesh_0_7.geometry} material={materials['Material.070']} skeleton={nodes.mesh_0_7.skeleton} morphTargetDictionary={nodes.mesh_0_7.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_7.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_8" geometry={nodes.mesh_0_8.geometry} material={materials['Material.071']} skeleton={nodes.mesh_0_8.skeleton} morphTargetDictionary={nodes.mesh_0_8.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_8.morphTargetInfluences} />
              <skinnedMesh name="mesh_0_9" geometry={nodes.mesh_0_9.geometry} material={materials['Material.041']} skeleton={nodes.mesh_0_9.skeleton} morphTargetDictionary={nodes.mesh_0_9.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0_9.morphTargetInfluences} />
            </group>
          </group>
          <group name="GamzaBone">
            <primitive object={nodes.HandIKL} />
            <primitive object={nodes.HandIKR} />
            <primitive object={nodes.shinL_1} />
            <primitive object={nodes.shinR_1} />
            <primitive object={nodes.thighL_1} />
            <primitive object={nodes.thighR_1} />
            <primitive object={nodes.ArmpoleL} />
            <primitive object={nodes.ArmpoleR} />
            <primitive object={nodes.Root} />
            <primitive object={nodes.neutral_bone} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/BakeryGamza-draco.glb')
