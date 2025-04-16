// Cafe.jsx
import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'


export const Cafe = forwardRef(function Cafe({ onLoaded, ...props }, ref) {
    const group = useRef()
    const gamzaRef = useRef(); // ✅ 감자002 ref 추가
  const { scene, animations } = useGLTF('/assets/models/Gamza_CoffeeSence.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)


  useImperativeHandle(ref, () => ({
    model: group.current,
    gamza: gamzaRef.current, // ✅ 외부에 접근 허용
  }));

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
          </group>

          {/* 감자 */}

          <group
          name="Gamza002"
          ref={gamzaRef}
          position={[0, 0, 0]}
          scale={[1.8, 1.8, 1.8]} // 처음엔 숨겨놓기
          >           
            <skinnedMesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.016']} skeleton={nodes.Cube001.skeleton} morphTargetDictionary={nodes.Cube001.morphTargetDictionary} morphTargetInfluences={nodes.Cube001.morphTargetInfluences} />
            <skinnedMesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.017']} skeleton={nodes.Cube001_1.skeleton} morphTargetDictionary={nodes.Cube001_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_1.morphTargetInfluences} />
            <skinnedMesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.019']} skeleton={nodes.Cube001_2.skeleton} morphTargetDictionary={nodes.Cube001_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_2.morphTargetInfluences} />
            <skinnedMesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.021']} skeleton={nodes.Cube001_3.skeleton} morphTargetDictionary={nodes.Cube001_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_3.morphTargetInfluences} />
            <skinnedMesh name="Cube001_4" geometry={nodes.Cube001_4.geometry} material={materials['Material.032']} skeleton={nodes.Cube001_4.skeleton} morphTargetDictionary={nodes.Cube001_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_4.morphTargetInfluences} />
            <skinnedMesh name="Cube001_5" geometry={nodes.Cube001_5.geometry} material={materials['Material.055']} skeleton={nodes.Cube001_5.skeleton} morphTargetDictionary={nodes.Cube001_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_5.morphTargetInfluences} />
            <skinnedMesh name="Cube001_6" geometry={nodes.Cube001_6.geometry} material={materials['Material.056']} skeleton={nodes.Cube001_6.skeleton} morphTargetDictionary={nodes.Cube001_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_6.morphTargetInfluences} />
            <skinnedMesh name="Cube001_7" geometry={nodes.Cube001_7.geometry} material={materials['Material.058']} skeleton={nodes.Cube001_7.skeleton} morphTargetDictionary={nodes.Cube001_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_7.morphTargetInfluences} />
            <skinnedMesh name="Cube001_8" geometry={nodes.Cube001_8.geometry} material={materials['Material.061']} skeleton={nodes.Cube001_8.skeleton} morphTargetDictionary={nodes.Cube001_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_8.morphTargetInfluences} />
            <skinnedMesh name="Cube001_9" geometry={nodes.Cube001_9.geometry} material={materials['Material.062']} skeleton={nodes.Cube001_9.skeleton} morphTargetDictionary={nodes.Cube001_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_9.morphTargetInfluences} />
            <skinnedMesh name="Cube001_10" geometry={nodes.Cube001_10.geometry} material={materials['Material.063']} skeleton={nodes.Cube001_10.skeleton} morphTargetDictionary={nodes.Cube001_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_10.morphTargetInfluences} />
            <skinnedMesh name="Cube001_11" geometry={nodes.Cube001_11.geometry} material={materials['Material.014']} skeleton={nodes.Cube001_11.skeleton} morphTargetDictionary={nodes.Cube001_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_11.morphTargetInfluences} />
            <skinnedMesh name="Cube001_12" geometry={nodes.Cube001_12.geometry} material={materials['Material.013']} skeleton={nodes.Cube001_12.skeleton} morphTargetDictionary={nodes.Cube001_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_12.morphTargetInfluences} />
            <skinnedMesh name="Cube001_13" geometry={nodes.Cube001_13.geometry} material={materials['Material.015']} skeleton={nodes.Cube001_13.skeleton} morphTargetDictionary={nodes.Cube001_13.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_13.morphTargetInfluences} />
          </group>
          
        </group>
        <group name="Empty003" position={[-1.571, 3.852, 0]} scale={0.328}>
          <group name="Bone" position={[1.89, 0, 0]}>
            <primitive object={nodes.Root_1} />
            <primitive object={nodes.HandIKL_1} />
            <primitive object={nodes.HandIKR_1} />
            <primitive object={nodes.shinL_3} />
            <primitive object={nodes.shinR_3} />
            <primitive object={nodes.thighL_3} />
            <primitive object={nodes.thighR_3} />
            <primitive object={nodes.ArmpoleL_1} />
            <primitive object={nodes.ArmpoleR_1} />
            <primitive object={nodes.neutral_bone} />
          </group>
          <mesh name="Gamza003" geometry={nodes.Gamza003.geometry} material={materials['Material.027']} position={[0.583, 3.726, -0.139]} scale={[1, 1.463, 1]} />
          <group name="Gamza001">
            <skinnedMesh name="Cube044" geometry={nodes.Cube044.geometry} material={materials['Material.008']} skeleton={nodes.Cube044.skeleton} morphTargetDictionary={nodes.Cube044.morphTargetDictionary} morphTargetInfluences={nodes.Cube044.morphTargetInfluences} />
            <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube044_1.skeleton} morphTargetDictionary={nodes.Cube044_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_1.morphTargetInfluences} />
            <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.006']} skeleton={nodes.Cube044_2.skeleton} morphTargetDictionary={nodes.Cube044_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_2.morphTargetInfluences} />
            <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.009']} skeleton={nodes.Cube044_3.skeleton} morphTargetDictionary={nodes.Cube044_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_3.morphTargetInfluences} />
            <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_4.skeleton} morphTargetDictionary={nodes.Cube044_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_4.morphTargetInfluences} />
            <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_5.skeleton} morphTargetDictionary={nodes.Cube044_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_5.morphTargetInfluences} />
            <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.046']} skeleton={nodes.Cube044_6.skeleton} morphTargetDictionary={nodes.Cube044_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_6.morphTargetInfluences} />
            <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.047']} skeleton={nodes.Cube044_7.skeleton} morphTargetDictionary={nodes.Cube044_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_7.morphTargetInfluences} />
            <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.048']} skeleton={nodes.Cube044_8.skeleton} morphTargetDictionary={nodes.Cube044_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_8.morphTargetInfluences} />
            <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.014']} skeleton={nodes.Cube044_9.skeleton} morphTargetDictionary={nodes.Cube044_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_9.morphTargetInfluences} />
            <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.051']} skeleton={nodes.Cube044_10.skeleton} morphTargetDictionary={nodes.Cube044_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_10.morphTargetInfluences} />
            <skinnedMesh name="Cube044_11" geometry={nodes.Cube044_11.geometry} material={materials['Material.002']} skeleton={nodes.Cube044_11.skeleton} morphTargetDictionary={nodes.Cube044_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_11.morphTargetInfluences} />
            <skinnedMesh name="Cube044_12" geometry={nodes.Cube044_12.geometry} material={materials['Material.025']} skeleton={nodes.Cube044_12.skeleton} morphTargetDictionary={nodes.Cube044_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_12.morphTargetInfluences} />
            <skinnedMesh name="Cube044_13" geometry={nodes.Cube044_13.geometry} material={materials['Material.030']} skeleton={nodes.Cube044_13.skeleton} morphTargetDictionary={nodes.Cube044_13.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_13.morphTargetInfluences} />
            <skinnedMesh name="Cube044_14" geometry={nodes.Cube044_14.geometry} material={materials['Material.034']} skeleton={nodes.Cube044_14.skeleton} morphTargetDictionary={nodes.Cube044_14.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_14.morphTargetInfluences} />
            <skinnedMesh name="Cube044_15" geometry={nodes.Cube044_15.geometry} material={materials['Material.035']} skeleton={nodes.Cube044_15.skeleton} morphTargetDictionary={nodes.Cube044_15.morphTargetDictionary} morphTargetInfluences={nodes.Cube044_15.morphTargetInfluences} />
          </group>
        </group>
        <group name="Coffee" position={[-0.882, 3.451, 0]}>
          <mesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials['Material.014']} />
          <mesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={materials['Material.013']} />
          <mesh name="Cylinder004_2" geometry={nodes.Cylinder004_2.geometry} material={materials['Material.015']} />
        </group>
        <group name="Cube002" position={[0.62, 1.296, -5.065]} rotation={[0, -0.851, 0]} scale={0.894}>
          <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.035']} />
          <mesh name="Cube003_1" geometry={nodes.Cube003_1.geometry} material={materials['Material.014']} />
        </group>
        <group name="Cube008" position={[-1.349, -0.015, -3.098]} rotation={[-Math.PI, 0.739, -Math.PI]} scale={0.933}>
          <mesh name="Cube008_1" geometry={nodes.Cube008_1.geometry} material={materials['Material.035']} />
          <mesh name="Cube008_2" geometry={nodes.Cube008_2.geometry} material={materials['Material.014']} />
        </group>
        <group name="Cube043" position={[-1.324, 2.313, 2.903]} rotation={[0, -0.357, 0]} scale={0.004}>
          <mesh name="Cube051" geometry={nodes.Cube051.geometry} material={materials['Material.024']} />
          <mesh name="Cube051_1" geometry={nodes.Cube051_1.geometry} material={materials['Material.003']} />
        </group>
        <group name="Cylinder" position={[-0.344, 3.698, -3.982]} rotation={[Math.PI, -1.068, Math.PI]} scale={[0.001, 0.013, 0.001]}>
          <mesh name="Cylinder_1" geometry={nodes.Cylinder_1.geometry} material={materials['Material.014']} />
          <mesh name="Cylinder_2" geometry={nodes.Cylinder_2.geometry} material={materials.Material} />
          <mesh name="Cylinder_3" geometry={nodes.Cylinder_3.geometry} material={materials['Material.012']} />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_CoffeeSence.glb')
