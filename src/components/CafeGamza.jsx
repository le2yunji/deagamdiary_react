// components/CafeGamza.jsx
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

export const CafeGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Coffee.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group);

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
        <group name="Empty002" position={[0.526, 2.313, 0]} scale={0.004}>
          <group name="Bone001" position={[-0.641, 0, 0]} rotation={[0, -1.571, 0]}>
            <primitive object={nodes.Root} />
            <primitive object={nodes.HandIKL} />
            <primitive object={nodes.HandIKR} />
            <primitive object={nodes.shinL_1} />
            <primitive object={nodes.shinR_1} />
            <primitive object={nodes.thighL_1} />
            <primitive object={nodes.thighR_1} />
            <primitive object={nodes.ArmpoleL} />
            <primitive object={nodes.ArmpoleR} />
            <group name="Cube001" />
            <group name="Cube002" />
            <group name="Cube003">
              <skinnedMesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.016']} skeleton={nodes.Cube001_1.skeleton} morphTargetDictionary={nodes.Cube001_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_1.morphTargetInfluences} />
              <skinnedMesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.017']} skeleton={nodes.Cube001_2.skeleton} morphTargetDictionary={nodes.Cube001_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_2.morphTargetInfluences} />
              <skinnedMesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.019']} skeleton={nodes.Cube001_3.skeleton} morphTargetDictionary={nodes.Cube001_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_3.morphTargetInfluences} />
              <skinnedMesh name="Cube001_4" geometry={nodes.Cube001_4.geometry} material={materials['Material.021']} skeleton={nodes.Cube001_4.skeleton} morphTargetDictionary={nodes.Cube001_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_4.morphTargetInfluences} />
              <skinnedMesh name="Cube001_5" geometry={nodes.Cube001_5.geometry} material={materials['Material.032']} skeleton={nodes.Cube001_5.skeleton} morphTargetDictionary={nodes.Cube001_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_5.morphTargetInfluences} />
              <skinnedMesh name="Cube001_6" geometry={nodes.Cube001_6.geometry} material={materials['Material.055']} skeleton={nodes.Cube001_6.skeleton} morphTargetDictionary={nodes.Cube001_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_6.morphTargetInfluences} />
              <skinnedMesh name="Cube001_7" geometry={nodes.Cube001_7.geometry} material={materials['Material.056']} skeleton={nodes.Cube001_7.skeleton} morphTargetDictionary={nodes.Cube001_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_7.morphTargetInfluences} />
              <skinnedMesh name="Cube001_8" geometry={nodes.Cube001_8.geometry} material={materials['Material.058']} skeleton={nodes.Cube001_8.skeleton} morphTargetDictionary={nodes.Cube001_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_8.morphTargetInfluences} />
              <skinnedMesh name="Cube001_9" geometry={nodes.Cube001_9.geometry} material={materials['Material.061']} skeleton={nodes.Cube001_9.skeleton} morphTargetDictionary={nodes.Cube001_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_9.morphTargetInfluences} />
              <skinnedMesh name="Cube001_10" geometry={nodes.Cube001_10.geometry} material={materials['Material.062']} skeleton={nodes.Cube001_10.skeleton} morphTargetDictionary={nodes.Cube001_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_10.morphTargetInfluences} />
              <skinnedMesh name="Cube001_11" geometry={nodes.Cube001_11.geometry} material={materials['Material.063']} skeleton={nodes.Cube001_11.skeleton} morphTargetDictionary={nodes.Cube001_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_11.morphTargetInfluences} />
              <skinnedMesh name="Cube001_12" geometry={nodes.Cube001_12.geometry} material={materials['Material.014']} skeleton={nodes.Cube001_12.skeleton} morphTargetDictionary={nodes.Cube001_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_12.morphTargetInfluences} />
              <skinnedMesh name="Cube001_13" geometry={nodes.Cube001_13.geometry} material={materials['Material.013']} skeleton={nodes.Cube001_13.skeleton} morphTargetDictionary={nodes.Cube001_13.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_13.morphTargetInfluences} />
              <skinnedMesh name="Cube001_14" geometry={nodes.Cube001_14.geometry} material={materials['Material.015']} skeleton={nodes.Cube001_14.skeleton} morphTargetDictionary={nodes.Cube001_14.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_14.morphTargetInfluences} />
              <skinnedMesh name="Cube001_15" geometry={nodes.Cube001_15.geometry} material={materials.Material} skeleton={nodes.Cube001_15.skeleton} morphTargetDictionary={nodes.Cube001_15.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_15.morphTargetInfluences} />
            </group>
          </group>
          <group name="Gamza002" />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_Coffee.glb')
