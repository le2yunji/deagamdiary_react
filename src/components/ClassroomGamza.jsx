// ClassroomGamza.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const ClassroomGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Gamza_Classroom.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current); // ✅ 외부에서 ref 접근 허용

    // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
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
  
        // ✅ 애니메이션 이름 출력
        // console.log('카페 감자🥔 animations:', Object.keys(actions));
      }
    }, [onLoaded, mixer, actions, ref])
      
    // 그림자 설정
    useEffect(() => {
      if (ref?.current) {
        ref.current.traverse((child) => {
          if (child.isMesh) child.castShadow = true;
        });
      }
    }, [ref])


  return (
    <group ref={group} {...props} dispose={null} onClick={props.onClick} >
      <group name="Scene">
        <group name="Bone">
          <primitive object={nodes.spine} />
          <primitive object={nodes.spine003} />
          <primitive object={nodes.neutral_bone} />
          <group name="Cube008">
            <skinnedMesh name="Cube011" geometry={nodes.Cube011.geometry} material={materials['Material.012']} skeleton={nodes.Cube011.skeleton} />
            <skinnedMesh name="Cube011_1" geometry={nodes.Cube011_1.geometry} material={materials['Material.013']} skeleton={nodes.Cube011_1.skeleton} />
          </group>
          <group name="Head">
            <skinnedMesh name="Cube008_1" geometry={nodes.Cube008_1.geometry} material={materials['Material.008']} skeleton={nodes.Cube008_1.skeleton} morphTargetDictionary={nodes.Cube008_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_1.morphTargetInfluences} />
            <skinnedMesh name="Cube008_2" geometry={nodes.Cube008_2.geometry} material={materials['Material.010']} skeleton={nodes.Cube008_2.skeleton} morphTargetDictionary={nodes.Cube008_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_2.morphTargetInfluences} />
            <skinnedMesh name="Cube008_3" geometry={nodes.Cube008_3.geometry} material={materials['Material.005']} skeleton={nodes.Cube008_3.skeleton} morphTargetDictionary={nodes.Cube008_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_3.morphTargetInfluences} />
            <skinnedMesh name="Cube008_4" geometry={nodes.Cube008_4.geometry} material={materials['Material.004']} skeleton={nodes.Cube008_4.skeleton} morphTargetDictionary={nodes.Cube008_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_4.morphTargetInfluences} />
            <skinnedMesh name="Cube008_5" geometry={nodes.Cube008_5.geometry} material={materials['Material.002']} skeleton={nodes.Cube008_5.skeleton} morphTargetDictionary={nodes.Cube008_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_5.morphTargetInfluences} />
            <skinnedMesh name="Cube008_6" geometry={nodes.Cube008_6.geometry} material={materials['Material.003']} skeleton={nodes.Cube008_6.skeleton} morphTargetDictionary={nodes.Cube008_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_6.morphTargetInfluences} />
            <skinnedMesh name="Cube008_7" geometry={nodes.Cube008_7.geometry} material={materials['Material.011']} skeleton={nodes.Cube008_7.skeleton} morphTargetDictionary={nodes.Cube008_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_7.morphTargetInfluences} />
            <skinnedMesh name="Cube008_8" geometry={nodes.Cube008_8.geometry} material={materials['Material.009']} skeleton={nodes.Cube008_8.skeleton} morphTargetDictionary={nodes.Cube008_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_8.morphTargetInfluences} />
            <skinnedMesh name="Cube008_9" geometry={nodes.Cube008_9.geometry} material={materials['Material.014']} skeleton={nodes.Cube008_9.skeleton} morphTargetDictionary={nodes.Cube008_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_9.morphTargetInfluences} />
            <skinnedMesh name="Cube008_10" geometry={nodes.Cube008_10.geometry} material={materials['Material.015']} skeleton={nodes.Cube008_10.skeleton} morphTargetDictionary={nodes.Cube008_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_10.morphTargetInfluences} />
            <skinnedMesh name="Cube008_11" geometry={nodes.Cube008_11.geometry} material={materials.Material} skeleton={nodes.Cube008_11.skeleton} morphTargetDictionary={nodes.Cube008_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube008_11.morphTargetInfluences} />
          </group>
          <group name="Pad">
            <skinnedMesh name="Cube010" geometry={nodes.Cube010.geometry} material={materials['Material.006']} skeleton={nodes.Cube010.skeleton} morphTargetDictionary={nodes.Cube010.morphTargetDictionary} morphTargetInfluences={nodes.Cube010.morphTargetInfluences} />
            <skinnedMesh name="Cube010_1" geometry={nodes.Cube010_1.geometry} material={materials['Material.007']} skeleton={nodes.Cube010_1.skeleton} morphTargetDictionary={nodes.Cube010_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube010_1.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Gamza_Classroom.glb')
