// components/MailGamza.jsx
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

export const MailGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Post.glb')
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
        <group name="Bone" position={[-0.115, 0, 0]}>
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
          <group name="Gamza001">
            <skinnedMesh name="Cube044" geometry={nodes.Cube044.geometry} material={materials['Material.008']} skeleton={nodes.Cube044.skeleton} />
            <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube044_1.skeleton} />
            <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.005']} skeleton={nodes.Cube044_2.skeleton} />
            <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.004']} skeleton={nodes.Cube044_3.skeleton} />
            <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.009']} skeleton={nodes.Cube044_4.skeleton} />
            <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_5.skeleton} />
            <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_6.skeleton} />
            <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.014']} skeleton={nodes.Cube044_7.skeleton} />
            <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.017']} skeleton={nodes.Cube044_8.skeleton} />
            <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.018']} skeleton={nodes.Cube044_9.skeleton} />
            <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.019']} skeleton={nodes.Cube044_10.skeleton} />
            <skinnedMesh name="Cube044_11" geometry={nodes.Cube044_11.geometry} material={materials.Material} skeleton={nodes.Cube044_11.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_Post.glb')
