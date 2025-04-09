// MailBox.jsx
import React, { useRef, useEffect, forwardRef, useImperativeHandle }  from 'react'
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei'

export const MailBox = forwardRef(({ onLoaded, ...props }, ref) => {
  const { nodes, materials } = useGLTF('/assets/models/MailBox.glb')
  const mailboxRef = useRef();

  useEffect(() => {
    if (mailboxRef.current) {
      mailboxRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

        }
      });
    }
  }, []);
  return (
    <group {...props} dispose={null} scale={[1.7, 1.7, 1.7]}>
      <mesh geometry={nodes.Cube020.geometry} material={materials['Material.049']} />
      <mesh geometry={nodes.Cube020_1.geometry} material={materials['Material.048']} />
      <mesh geometry={nodes.Cube020_2.geometry} material={materials['Material.050']} />
      <mesh geometry={nodes.Cube020_3.geometry} material={materials['Material.051']} />
      <mesh geometry={nodes.Cube020_4.geometry} material={materials['Material.052']} />
      <mesh geometry={nodes.Cube020_5.geometry} material={materials['Material.053']} />
    </group>
  )
})

useGLTF.preload('/assets/models/MailBox.glb')
