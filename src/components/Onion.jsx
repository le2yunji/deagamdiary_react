// Onion.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const Onion = forwardRef(function Onion({ onLoaded, ...props }, ref) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/s4_onion.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)
  
  // 🔁 ref 연결
  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        // action.setLoop(THREE.LoopOnce, 30);
        action.clampWhenFinished = true;
      });

      // ref 전달
      if (ref) {
        if (typeof ref === 'function') {
          ref(group.current)
        } else {
          ref.current = group.current
        }
      }
      onLoaded({ ref: group.current, mixer, actions }); // ✅ ref 전달
    }
  }, [onLoaded, mixer, actions, ref]);

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
        <group name="OnionBone002" position={[0, 0.508, 0]}>
          <primitive object={nodes.Root} />
          <group name="BodyO002" />
          <group name="Cube002" />
          <group name="Cube004">
            <skinnedMesh name="Cube002_1" geometry={nodes.Cube002_1.geometry} material={materials['Material.011']} skeleton={nodes.Cube002_1.skeleton} morphTargetDictionary={nodes.Cube002_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_1.morphTargetInfluences} />
            <skinnedMesh name="Cube002_2" geometry={nodes.Cube002_2.geometry} material={materials['Material.014']} skeleton={nodes.Cube002_2.skeleton} morphTargetDictionary={nodes.Cube002_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_2.morphTargetInfluences} />
            <skinnedMesh name="Cube002_3" geometry={nodes.Cube002_3.geometry} material={materials['Material.015']} skeleton={nodes.Cube002_3.skeleton} morphTargetDictionary={nodes.Cube002_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_3.morphTargetInfluences} />
            <skinnedMesh name="Cube002_4" geometry={nodes.Cube002_4.geometry} material={materials['Material.016']} skeleton={nodes.Cube002_4.skeleton} morphTargetDictionary={nodes.Cube002_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_4.morphTargetInfluences} />
            <skinnedMesh name="Cube002_5" geometry={nodes.Cube002_5.geometry} material={materials['Material.018']} skeleton={nodes.Cube002_5.skeleton} morphTargetDictionary={nodes.Cube002_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_5.morphTargetInfluences} />
            <skinnedMesh name="Cube002_6" geometry={nodes.Cube002_6.geometry} material={materials['Material.019']} skeleton={nodes.Cube002_6.skeleton} morphTargetDictionary={nodes.Cube002_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_6.morphTargetInfluences} />
            <skinnedMesh name="Cube002_7" geometry={nodes.Cube002_7.geometry} material={materials['Material.020']} skeleton={nodes.Cube002_7.skeleton} morphTargetDictionary={nodes.Cube002_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_7.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/s4_onion.glb')
