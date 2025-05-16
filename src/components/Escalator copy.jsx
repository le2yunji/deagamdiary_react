// Escalator.jsx
import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei';

export const Escalator = forwardRef(({ onLoaded, onGamzaRef, innerWallMaterial, ...props }, ref) => {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF('/assets/models/escalator.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const gamzaRef = useRef();
  // const customTexture = useTexture('/assets/images/innerWall.png'); // 이미지 경로

  useImperativeHandle(ref, () => group.current);
  useEffect(() => {
    const mesh = group.current.getObjectByName("Cube007_2");
    if (mesh) {
      mesh.material.color = new THREE.Color('#111111'); // 예시
    }
  }, []);
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
      
  //  // ✅ 이미지 텍스처 적용
  //  const mesh = group.current.getObjectByName("Cube007_2");
  //  if (mesh) {
  //    mesh.material.map = customTexture;
  //    mesh.material.needsUpdate = true;
  //  }

  
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
        <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials.Material} position={[-0.035, 0.035, -0.07]}>

          {/* 감자 */}
          {/* <group ref={gamzaRef}  name="Head" position={[-0.29, 0.161, -0.837]}>
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
          </group> */}



        </mesh>
        <mesh name="Plane003" geometry={nodes.Plane003.geometry} material={materials['Material.002']} position={[0.007, 0.278, -0.098]} rotation={[0, 0, -Math.PI / 2]} />
        <mesh name="Plane004" geometry={nodes.Plane004.geometry} material={materials['Material.003']} position={[-0.298, -0.367, -0.161]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.972, 1]} />
        <mesh name="Plane005" geometry={nodes.Plane005.geometry} material={materials['Material.002']} position={[0.007, 0.03, -0.061]} rotation={[0, 0, -Math.PI / 2]} />
        {/* 유리 */}
        <group name="Cube" position={[0.084, -0.359, -0.086]} scale={[1.079, 1, 1]}>
          <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.013']} />
          <mesh name="Cube003_1" geometry={nodes.Cube003_1.geometry} material={materials['Material.012']} />
        </group>
        {/* 오른쪽 계단 */}
        <mesh name="Plane007" geometry={nodes.Plane007.geometry} material={materials.Material} position={[0.748, 0.052, -0.098]} rotation={[0, 0, -Math.PI / 2]} />
        <mesh name="Plane008" geometry={nodes.Plane008.geometry} material={materials['Material.002']} position={[0.748, 0.278, -0.098]} rotation={[0, 0, -Math.PI / 2]} />
        <mesh name="Plane009" geometry={nodes.Plane009.geometry} material={materials['Material.003']} position={[0.443, -0.367, -0.161]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.972, 1]} />
        <mesh name="Plane010" geometry={nodes.Plane010.geometry} material={materials['Material.002']} position={[0.748, 0.03, -0.061]} rotation={[0, 0, -Math.PI / 2]} />
        {/* 메로나 */}
        <group name="Cube004" position={[-1.656, -0.758, -1.282]} scale={0.124}>
          <mesh name="Cube005_1" geometry={nodes.Cube005_1.geometry} material={materials['Material.026']} />
          <mesh name="Cube005_2" geometry={nodes.Cube005_2.geometry} material={materials['Material.044']} />
        </group>
        <group name="Cylinder006" position={[1.804, -0.385, -0.51]} rotation={[Math.PI, -1.458, Math.PI]} scale={0.355}>
          <mesh name="Cylinder011" geometry={nodes.Cylinder011.geometry} material={materials['Material.020']} />
          <mesh name="Cylinder011_1" geometry={nodes.Cylinder011_1.geometry} material={materials['Material.021']} />
          <mesh name="Cylinder011_2" geometry={nodes.Cylinder011_2.geometry} material={materials['Material.022']} />
          <group name="Cylinder001" position={[5.352, 0, 9.169]} rotation={[Math.PI, -0.287, Math.PI]}>
            <mesh name="Cylinder007" geometry={nodes.Cylinder007.geometry} material={materials['Material.020']} />
            <mesh name="Cylinder007_1" geometry={nodes.Cylinder007_1.geometry} material={materials['Material.021']} />
            <mesh name="Cylinder007_2" geometry={nodes.Cylinder007_2.geometry} material={materials['Material.022']} />
          </group>
          <group name="Cylinder003" position={[-3.589, 0, 1.301]} rotation={[0, 0.85, 0]}>
            <mesh name="Cylinder008" geometry={nodes.Cylinder008.geometry} material={materials['Material.020']} />
            <mesh name="Cylinder008_1" geometry={nodes.Cylinder008_1.geometry} material={materials['Material.021']} />
            <mesh name="Cylinder008_2" geometry={nodes.Cylinder008_2.geometry} material={materials['Material.022']} />
          </group>
          <group name="Cylinder004" position={[-2.231, 0, 0.029]} rotation={[0, 0.808, 0]}>
            <mesh name="Cylinder009" geometry={nodes.Cylinder009.geometry} material={materials['Material.020']} />
            <mesh name="Cylinder009_1" geometry={nodes.Cylinder009_1.geometry} material={materials['Material.021']} />
            <mesh name="Cylinder009_2" geometry={nodes.Cylinder009_2.geometry} material={materials['Material.022']} />
          </group>
          <group name="Cylinder005" position={[7.04, 0, 7.267]} rotation={[-Math.PI, 0.319, -Math.PI]}>
            <mesh name="Cylinder010" geometry={nodes.Cylinder010.geometry} material={materials['Material.020']} />
            <mesh name="Cylinder010_1" geometry={nodes.Cylinder010_1.geometry} material={materials['Material.021']} />
            <mesh name="Cylinder010_2" geometry={nodes.Cylinder010_2.geometry} material={materials['Material.022']} />
          </group>
        </group>
        <group name="Cube005" position={[0.084, -0.387, -0.236]} scale={[0.919, 1.015, 1.015]}>
          <mesh name="Cube007_1" geometry={nodes.Cube007_1.geometry} material={materials['Material.012']} />
          {/* 안쪽 벽 */}
            <mesh
              name="Cube007_2"
              geometry={nodes.Cube007_2.geometry}
              material={innerWallMaterial}
            />
    {/* {innerWallMaterial && (
            <mesh
              name="Cube007_2"
              geometry={nodes.Cube007_2.geometry}
              material={innerWallMaterial}
            />
          )} */}

        </group>
        <mesh name="NurbsPath" geometry={nodes.NurbsPath.geometry} material={materials['Material.025']} position={[0.084, 0.252, -2.138]} rotation={[0, 1.571, 0]} scale={0.332} />
        <mesh name="Cube006" geometry={nodes.Cube006.geometry} material={materials['Material.026']} position={[0.084, -0.515, -0.646]} scale={[0.875, 0.083, 1.94]} />
        <mesh name="Cube007" geometry={nodes.Cube007.geometry} material={materials['Material.024']} position={[0.084, -0.387, -0.765]} scale={[0.919, 1.015, 1.015]} />
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/escalator.glb')
