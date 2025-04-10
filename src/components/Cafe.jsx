// Cafe.jsx
import React, { forwardRef, useImperativeHandle, useEffect} from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

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
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Bone" position={[0.319, 0, 0]}>
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
          <group name="Cube" position={[-2.834, 3.691, 2.666]} scale={0.775}>
            <mesh name="Cube012" geometry={nodes.Cube012.geometry} material={materials['Material.034']} />
            <mesh name="Cube012_1" geometry={nodes.Cube012_1.geometry} material={materials['Material.035']} />
          </group>
          <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.014']} position={[-3.646, -0.041, 3.766]} rotation={[0, 1.235, 0]} scale={0.611} />
          <mesh name="Cube002" geometry={nodes.Cube002.geometry} material={materials['Material.035']} position={[-3.632, 1.284, 3.771]} rotation={[0, 1.235, 0]} scale={0.801} />
          <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.014']} position={[-0.572, -0.041, 3.653]} rotation={[0, -1.157, 0]} scale={0.611} />
          <mesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['Material.035']} position={[-0.586, 1.284, 3.659]} rotation={[0, -1.157, 0]} scale={0.811} />
          <mesh name="Cube010" geometry={nodes.Cube010.geometry} material={materials['Material.006']} position={[-2.879, 3.691, 1.834]} scale={[0.078, 0.078, 0.223]} />
          <group name="Cube043" position={[-0.549, 1.001, -2.539]} rotation={[0, -1.274, 0]}>
            <mesh name="Cube051" geometry={nodes.Cube051.geometry} material={materials['Material.024']} />
            <mesh name="Cube051_1" geometry={nodes.Cube051_1.geometry} material={materials['Material.002']} />
          </group>
          <mesh name="Cylinder" geometry={nodes.Cylinder.geometry} material={materials['Material.014']} position={[-2.172, 0.666, 4.259]} rotation={[0, 0.65, 0]} scale={[0.056, 0.618, 0.056]} />
          <mesh name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={materials['Material.002']} position={[-2.172, 1.235, 4.259]} rotation={[0, 0.65, 0]} />
          <mesh name="Cylinder002" geometry={nodes.Cylinder002.geometry} material={materials['Material.014']} position={[-2.172, 1.805, 4.259]} rotation={[0, 0.65, 0]} scale={[0.056, 0.618, 0.056]} />
          <mesh name="Cylinder007" geometry={nodes.Cylinder007.geometry} material={materials['Material.012']} position={[-2.172, 2.838, 4.259]} rotation={[0, 0.65, 0]} scale={[0.784, 8.592, 0.784]} />
          <mesh name="Gamza003" geometry={nodes.Gamza003.geometry} material={materials['Material.027']} position={[-1.308, 3.726, -0.139]} scale={[1, 1.463, 1]} />
          <group name="Gamza001">
            <skinnedMesh name="Cube044" geometry={nodes.Cube044.geometry} material={materials['Material.008']} skeleton={nodes.Cube044.skeleton} morphTargetDictionary={nodes.Cube044.morphTargetDictionary} morphTargetInfluences={nodes.Cube044.morphTargetInfluences} />
            <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube044_1.skeleton} morphTargetDictionary={nodes.Cube044_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_1.morphTargetInfluences} />
            <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.009']} skeleton={nodes.Cube044_2.skeleton} morphTargetDictionary={nodes.Cube044_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_2.morphTargetInfluences} />
            <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_3.skeleton} morphTargetDictionary={nodes.Cube044_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_3.morphTargetInfluences} />
            <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_4.skeleton} morphTargetDictionary={nodes.Cube044_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_4.morphTargetInfluences} />
            <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.046']} skeleton={nodes.Cube044_5.skeleton} morphTargetDictionary={nodes.Cube044_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_5.morphTargetInfluences} />
            <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.047']} skeleton={nodes.Cube044_6.skeleton} morphTargetDictionary={nodes.Cube044_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_6.morphTargetInfluences} />
            <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.048']} skeleton={nodes.Cube044_7.skeleton} morphTargetDictionary={nodes.Cube044_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_7.morphTargetInfluences} />
            <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.014']} skeleton={nodes.Cube044_8.skeleton} morphTargetDictionary={nodes.Cube044_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_8.morphTargetInfluences} />
            <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.051']} skeleton={nodes.Cube044_9.skeleton} morphTargetDictionary={nodes.Cube044_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_9.morphTargetInfluences} />
            <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.011']} skeleton={nodes.Cube044_10.skeleton} morphTargetDictionary={nodes.Cube044_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_10.morphTargetInfluences} />
            <skinnedMesh name="Cube044_11" geometry={nodes.Cube044_11.geometry} material={materials['Material.025']} skeleton={nodes.Cube044_11.skeleton} morphTargetDictionary={nodes.Cube044_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_11.morphTargetInfluences} />
            <skinnedMesh name="Cube044_12" geometry={nodes.Cube044_12.geometry} material={materials['Material.030']} skeleton={nodes.Cube044_12.skeleton} morphTargetDictionary={nodes.Cube044_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_12.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/CoffeeShop.glb')
