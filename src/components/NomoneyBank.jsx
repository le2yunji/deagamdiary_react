// NomoneyBank.jsx

import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export function NomoneyBank({ onLoaded, ...props }) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/NomoneyBank.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

    // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
    useEffect(() => {
      if (onLoaded && group.current) {
        // 애니메이션 반복 없이 설정
        Object.values(actions).forEach((action) => {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
        });
        onLoaded({ ref: group.current, mixer, actions });
        // console.log('노머니💵💸 통장 animations:', Object.keys(actions));

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
        <group name="BankBone" position={[0.067, 0, 0]}>
          <primitive object={nodes.bank_back} />
          <primitive object={nodes.bank_side} />
          <skinnedMesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials.Material} skeleton={nodes.Cube003.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/NomoneyBank.glb')
