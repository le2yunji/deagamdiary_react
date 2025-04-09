// File.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three';

export const File = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF('/assets/models/File.glb')
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current);

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
        }
      }, [onLoaded, mixer, actions, ref]);
        
      // 그림자 설정
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
        <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.055']} position={[0.236, 0.61, -0.153]} rotation={[1.087, -1.139, 1.047]} scale={0.308} />
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/File.glb')
