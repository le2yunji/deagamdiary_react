// NomoneyGamza.jsx
import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export function NomoneyGamza({ onLoaded, ...props }) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Nomoney.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    if (onLoaded && group.current) {
      // 애니메이션 반복 없이 설정
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ ref: group.current, mixer, actions });
      // console.log('노머니💵💸 감자🥔 animations:', Object.keys(actions));

    }
  }, [onLoaded, mixer, actions]);

  // 모든 mesh에 castShadow 적용
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
        <group name="Empty">
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
          </group>
          <group name="Gamza001">
            <skinnedMesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.008']} skeleton={nodes.Cube001.skeleton} morphTargetDictionary={nodes.Cube001.morphTargetDictionary} morphTargetInfluences={nodes.Cube001.morphTargetInfluences} />
            <skinnedMesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.010']} skeleton={nodes.Cube001_1.skeleton} morphTargetDictionary={nodes.Cube001_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_1.morphTargetInfluences} />
            <skinnedMesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.005']} skeleton={nodes.Cube001_2.skeleton} morphTargetDictionary={nodes.Cube001_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_2.morphTargetInfluences} />
            <skinnedMesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.004']} skeleton={nodes.Cube001_3.skeleton} morphTargetDictionary={nodes.Cube001_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_3.morphTargetInfluences} />
            <skinnedMesh name="Cube001_4" geometry={nodes.Cube001_4.geometry} material={materials['Material.009']} skeleton={nodes.Cube001_4.skeleton} morphTargetDictionary={nodes.Cube001_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_4.morphTargetInfluences} />
            <skinnedMesh name="Cube001_5" geometry={nodes.Cube001_5.geometry} material={materials['Material.044']} skeleton={nodes.Cube001_5.skeleton} morphTargetDictionary={nodes.Cube001_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_5.morphTargetInfluences} />
            <skinnedMesh name="Cube001_6" geometry={nodes.Cube001_6.geometry} material={materials['Material.045']} skeleton={nodes.Cube001_6.skeleton} morphTargetDictionary={nodes.Cube001_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_6.morphTargetInfluences} />
            <skinnedMesh name="Cube001_7" geometry={nodes.Cube001_7.geometry} material={materials['Material.013']} skeleton={nodes.Cube001_7.skeleton} morphTargetDictionary={nodes.Cube001_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_7.morphTargetInfluences} />
            <skinnedMesh name="Cube001_8" geometry={nodes.Cube001_8.geometry} material={materials['Material.014']} skeleton={nodes.Cube001_8.skeleton} morphTargetDictionary={nodes.Cube001_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_8.morphTargetInfluences} />
            <skinnedMesh name="Cube001_9" geometry={nodes.Cube001_9.geometry} material={materials['Material.017']} skeleton={nodes.Cube001_9.skeleton} morphTargetDictionary={nodes.Cube001_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_9.morphTargetInfluences} />
            <skinnedMesh name="Cube001_10" geometry={nodes.Cube001_10.geometry} material={materials['Material.018']} skeleton={nodes.Cube001_10.skeleton} morphTargetDictionary={nodes.Cube001_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_10.morphTargetInfluences} />
            <skinnedMesh name="Cube001_11" geometry={nodes.Cube001_11.geometry} material={materials['Material.019']} skeleton={nodes.Cube001_11.skeleton} morphTargetDictionary={nodes.Cube001_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_11.morphTargetInfluences} />
            <skinnedMesh name="Cube001_12" geometry={nodes.Cube001_12.geometry} material={materials['Material.032']} skeleton={nodes.Cube001_12.skeleton} morphTargetDictionary={nodes.Cube001_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_12.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/Gamza_Nomoney.glb')
