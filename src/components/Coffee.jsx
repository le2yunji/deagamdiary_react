
// Coffee.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export const Coffee = forwardRef(function Coffee({ onLoaded, ...props }, ref) {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF('/assets/models/Coffee.glb')
  const { actions, mixer } = useAnimations(animations, group)

  // ✅ 외부에서 ref 사용 가능하게
  useImperativeHandle(ref, () => group.current);

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
        <group name="Coffee" position={[-0.882, -0.049, 0]}>
          <mesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials['Material.014']} />
          <mesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={materials['Material.013']} />
          <mesh name="Cylinder004_2" geometry={nodes.Cylinder004_2.geometry} material={materials['Material.015']} />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Coffee.glb')
