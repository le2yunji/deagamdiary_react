import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const CafeGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Coffee.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group);
  
  // 1. CoffeeGam 그룹의 visibility 상태 관리
  const [coffeeGamVisible, setCoffeeGamVisible] = useState(false);
  
  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      onLoaded({ ref: group.current, mixer, actions });
    }
  }, [onLoaded, mixer, actions]);

  useEffect(() => {
    // 2. group 내부 객체에 대해 그림자 설정
    group.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        if (child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0);
        }
      }
    });

    // 3. CafeGamza 등장 후 일정 시간 뒤 CoffeeGam 나타나게 설정
    const timer = setTimeout(() => {
      setCoffeeGamVisible(true); // 일정 시간 뒤 CoffeeGamVisible을 true로 설정
    }, 7000); // 3초 뒤에 나타나게 설정 (시간 조정 가능)

    return () => clearTimeout(timer); // cleanup
  }, []);  

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Bone001" position={[-0.115, 0, 0]} rotation={[0, -1.571, 0]}>
          <primitive object={nodes.Root} />
          <primitive object={nodes.HandIKL} />
          <primitive object={nodes.HandIKR} />
          <primitive object={nodes.shinL_1} />
          <primitive object={nodes.shinR_1} />
          <primitive object={nodes.thighL_1} />
          <primitive object={nodes.thighR_1} />
          <primitive object={nodes.ArmpoleL} />
          <primitive object={nodes.ArmpoleR} />

          <group name="CoffeeGam" visible={coffeeGamVisible}>
            <skinnedMesh 
              name="Cylinder001" 
              geometry={nodes.Cylinder001.geometry} 
              material={materials['Material.014']} 
              skeleton={nodes.Cylinder001.skeleton} 
            />
            <skinnedMesh 
              name="Cylinder001_1" 
              geometry={nodes.Cylinder001_1.geometry} 
              material={materials['Material.013']} 
              skeleton={nodes.Cylinder001_1.skeleton} 
            />
            <skinnedMesh 
              name="Cylinder001_2" 
              geometry={nodes.Cylinder001_2.geometry} 
              material={materials['Material.015']} 
              skeleton={nodes.Cylinder001_2.skeleton} 
            />
          </group>

          <group name="Cube001">
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
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_Coffee.glb');
