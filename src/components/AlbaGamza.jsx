// AlbaGamza.gsx
import React, { useEffect, forwardRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const AlbaGamza = forwardRef(function AlbaGamza({ onLoaded, ...props }, ref) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Board.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
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

      // ✅ 애니메이션 이름 출력
      // console.log('알바 감자🥔 animations:', Object.keys(actions));
    }
  }, [onLoaded, mixer, actions, ref]);

  // 모든 mesh에 castShadow 적용
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
            <skinnedMesh name="Cube044" geometry={nodes.Cube044.geometry} material={materials['Material.029']} skeleton={nodes.Cube044.skeleton} />
            <skinnedMesh name="Cube044_1" geometry={nodes.Cube044_1.geometry} material={materials['Material.027']} skeleton={nodes.Cube044_1.skeleton} />
            <skinnedMesh name="Cube044_2" geometry={nodes.Cube044_2.geometry} material={materials['Material.035']} skeleton={nodes.Cube044_2.skeleton} />
            <skinnedMesh name="Cube044_3" geometry={nodes.Cube044_3.geometry} material={materials['Material.036']} skeleton={nodes.Cube044_3.skeleton} />
            <skinnedMesh name="Cube044_4" geometry={nodes.Cube044_4.geometry} material={materials['Material.028']} skeleton={nodes.Cube044_4.skeleton} />
            <skinnedMesh name="Cube044_5" geometry={nodes.Cube044_5.geometry} material={materials['Material.044']} skeleton={nodes.Cube044_5.skeleton} />
            <skinnedMesh name="Cube044_6" geometry={nodes.Cube044_6.geometry} material={materials['Material.045']} skeleton={nodes.Cube044_6.skeleton} />
            <skinnedMesh name="Cube044_7" geometry={nodes.Cube044_7.geometry} material={materials['Material.025']} skeleton={nodes.Cube044_7.skeleton} />
            <skinnedMesh name="Cube044_8" geometry={nodes.Cube044_8.geometry} material={materials['Material.017']} skeleton={nodes.Cube044_8.skeleton} />
            <skinnedMesh name="Cube044_9" geometry={nodes.Cube044_9.geometry} material={materials['Material.018']} skeleton={nodes.Cube044_9.skeleton} />
            <skinnedMesh name="Cube044_10" geometry={nodes.Cube044_10.geometry} material={materials['Material.019']} skeleton={nodes.Cube044_10.skeleton} />
            <skinnedMesh name="Cube044_11" geometry={nodes.Cube044_11.geometry} material={materials['Material.032']} skeleton={nodes.Cube044_11.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_Board.glb')
