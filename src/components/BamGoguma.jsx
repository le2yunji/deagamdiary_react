// Bam.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const BamGoguma = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/BamGoguma.glb')
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
        }
        if (child.material) {
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
        <group name="Goguma" position={[-2.972, 0.821, -2.474]} rotation={[-Math.PI, 1.545, -Math.PI]} scale={0.556}>
          <primitive object={nodes.Root} />
          <group name="Cube004">
            <skinnedMesh name="Cube038" geometry={nodes.Cube038.geometry} material={materials['Material.029']} skeleton={nodes.Cube038.skeleton} morphTargetDictionary={nodes.Cube038.morphTargetDictionary} morphTargetInfluences={nodes.Cube038.morphTargetInfluences} />
            <skinnedMesh name="Cube038_1" geometry={nodes.Cube038_1.geometry} material={materials['Material.049']} skeleton={nodes.Cube038_1.skeleton} morphTargetDictionary={nodes.Cube038_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube038_1.morphTargetInfluences} />
            <skinnedMesh name="Cube038_2" geometry={nodes.Cube038_2.geometry} material={materials['Material.050']} skeleton={nodes.Cube038_2.skeleton} morphTargetDictionary={nodes.Cube038_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube038_2.morphTargetInfluences} />
            <skinnedMesh name="Cube038_3" geometry={nodes.Cube038_3.geometry} material={materials['Material.009']} skeleton={nodes.Cube038_3.skeleton} morphTargetDictionary={nodes.Cube038_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube038_3.morphTargetInfluences} />
            <skinnedMesh name="Cube038_4" geometry={nodes.Cube038_4.geometry} material={materials['Material.040']} skeleton={nodes.Cube038_4.skeleton} morphTargetDictionary={nodes.Cube038_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube038_4.morphTargetInfluences} />
            <skinnedMesh name="Cube038_5" geometry={nodes.Cube038_5.geometry} material={materials['Material.039']} skeleton={nodes.Cube038_5.skeleton} morphTargetDictionary={nodes.Cube038_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube038_5.morphTargetInfluences} />
          </group>
        </group>
        <group name="Bam" position={[-1.181, 0.843, -2.645]} rotation={[-Math.PI, 1.545, -Math.PI]} scale={0.6}>
          <primitive object={nodes.Root_1} />
          <group name="Cube011">
            <skinnedMesh name="Cube050" geometry={nodes.Cube050.geometry} material={materials['Material.028']} skeleton={nodes.Cube050.skeleton} morphTargetDictionary={nodes.Cube050.morphTargetDictionary} morphTargetInfluences={nodes.Cube050.morphTargetInfluences} />
            <skinnedMesh name="Cube050_1" geometry={nodes.Cube050_1.geometry} material={materials['Material.048']} skeleton={nodes.Cube050_1.skeleton} morphTargetDictionary={nodes.Cube050_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube050_1.morphTargetInfluences} />
            <skinnedMesh name="Cube050_2" geometry={nodes.Cube050_2.geometry} material={materials['Material.051']} skeleton={nodes.Cube050_2.skeleton} morphTargetDictionary={nodes.Cube050_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube050_2.morphTargetInfluences} />
            <skinnedMesh name="Cube050_3" geometry={nodes.Cube050_3.geometry} material={materials['Material.052']} skeleton={nodes.Cube050_3.skeleton} morphTargetDictionary={nodes.Cube050_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube050_3.morphTargetInfluences} />
            <skinnedMesh name="Cube050_4" geometry={nodes.Cube050_4.geometry} material={materials['Material.009']} skeleton={nodes.Cube050_4.skeleton} morphTargetDictionary={nodes.Cube050_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube050_4.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/BamGoguma.glb')
