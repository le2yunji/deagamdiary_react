// Classmate.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three';

export const Classmate = forwardRef(function Classmate({ onLoaded, ...props }, ref) {
  const group = React.useRef();

  const { nodes, materials, animations } = useGLTF('/assets/models/classmate3.glb')
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current); // ✅ 외부에서 ref 접근 허용

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
    <group ref={group} {...props} dispose={null} >
      <group position={[-4.658, 1.609, -13.627]} rotation={[0, -0.058, 0]} scale={0.45}>
        <mesh geometry={nodes.Mesh003.geometry} material={materials['Material.047']} />
        <mesh geometry={nodes.Mesh003_1.geometry} material={materials['Legs.001']} />
        <mesh geometry={nodes.Mesh003_2.geometry} material={materials['Cushion.001']} />
        <mesh geometry={nodes.Mesh003_3.geometry} material={materials['Caps.001']} />
        <mesh geometry={nodes.Mesh003_4.geometry} material={materials['Material.053']} />
        <mesh geometry={nodes.Mesh003_5.geometry} material={materials['Desk.002']} />
        <mesh geometry={nodes.Mesh003_6.geometry} material={materials['Hook.001']} />
        <mesh geometry={nodes.Mesh003_7.geometry} material={materials['Bolt.002']} />
        <mesh geometry={nodes.Mesh003_8.geometry} material={materials['Material.054']} />
        <mesh geometry={nodes.Mesh003_9.geometry} material={materials['Material.055']} />
        <mesh geometry={nodes.Mesh003_10.geometry} material={materials['Legs.002']} />
        <mesh geometry={nodes.Mesh003_11.geometry} material={materials['Desk.003']} />
        <mesh geometry={nodes.Mesh003_12.geometry} material={materials['Hook.002']} />
        <mesh geometry={nodes.Mesh003_13.geometry} material={materials['Caps.002']} />
        <mesh geometry={nodes.Mesh003_14.geometry} material={materials['Bolt.003']} />
        <mesh geometry={nodes.Mesh003_15.geometry} material={materials['Cushion.002']} />
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/classmate3.glb')
