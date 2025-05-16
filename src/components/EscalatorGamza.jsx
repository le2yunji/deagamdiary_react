// Escalator.jsx
import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei';

export const EscalatorGamza = forwardRef(({ onLoaded, onGamzaRef, ...props }, ref) => {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF('/assets/models/escalator.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const gamzaRef = useRef();

  useImperativeHandle(ref, () => group.current);


  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.FrontSide;
        }
        if (child.material) {
          child.material.side = THREE.FrontSide;
        }
      });
      
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      onLoaded?.({ ref: group.current, mixer, actions });
      if (onGamzaRef && gamzaRef.current) {
        onGamzaRef(gamzaRef.current);
      }    
    
    }
  }, [actions, mixer, onLoaded, onGamzaRef]);  

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Plane002" rotation={[0, 0, -Math.PI / 2]} />
        <mesh name="Plane" >

          {/* 감자 */}
          <group ref={gamzaRef}  name="Head" position={[-0.29, 0.161, -0.837]}>
            <mesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['Material.008']} />
            <mesh name="Cube008_1" geometry={nodes.Cube008_1.geometry} material={materials['Material.010']} />
            <mesh name="Cube008_2" geometry={nodes.Cube008_2.geometry} material={materials['Material.005']} />
            <mesh name="Cube008_3" geometry={nodes.Cube008_3.geometry} material={materials['Material.004']} />
            <mesh name="Cube008_4" geometry={nodes.Cube008_4.geometry} material={materials['Material.006']} />
            <mesh name="Cube008_5" geometry={nodes.Cube008_5.geometry} material={materials['Material.007']} />
            <mesh name="Cube008_6" geometry={nodes.Cube008_6.geometry} material={materials['Material.011']} />
            <mesh name="Cube008_7" geometry={nodes.Cube008_7.geometry} material={materials['Material.014']} />
            <mesh name="Cube008_8" geometry={nodes.Cube008_8.geometry} material={materials['Material.015']} />
            <mesh name="Cube008_9" geometry={nodes.Cube008_9.geometry} material={materials['Material.009']} />
            <mesh name="Cube008_10" geometry={nodes.Cube008_10.geometry} material={materials['Material.016']} />
          </group>

        </mesh>

        </group>
       
      </group>
  )
})

useGLTF.preload('/assets/models/escalator.glb')
