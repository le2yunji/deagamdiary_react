// ChatGPT.jsx

import React, { useEffect, forwardRef, useImperativeHandle }  from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const ChatGPT = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/gpt3.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current);

  // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
  useEffect(() => {
    if (onLoaded && group.current) {
      // 애니메이션 반복 없이 설정
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ ref: group.current, mixer, actions });
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
        <group name="Empty_Center" position={[0, -0.038, 2.145]}>

          <group name="Empty"   position={[-1.255, 0.105, 1.693]} rotation={[Math.PI, 0, Math.PI]}>
            <group name="B_Gamza"    position={[0.322, 0.325, -0.439]} rotation={[0, 1.157, 0]} scale={1.106}>
            <primitive object={nodes.Root_1} />

            </group>
            <mesh name="GptBubble1" geometry={nodes.GptBubble1.geometry} material={materials.GptBubble} position={[-0.262, 3.445, -0.956]} rotation={[Math.PI / 2, 0, -0.209]} scale={0.014} />
            <mesh name="GptBubble2" geometry={nodes.GptBubble2.geometry} material={materials['GptBubble.001']} position={[-0.262, 3.445, -0.956]} rotation={[Math.PI / 2, 0, 0.531]} scale={0.014} />
            <mesh name="Chair_Gamza" geometry={nodes.Chair_Gamza.geometry} material={materials['PlasticBlack.001']} rotation={[-Math.PI, 0.414, -Math.PI]} scale={1.167} />
            <group name="Gamza">
              <skinnedMesh name="Cube002" geometry={nodes.Cube002.geometry} material={materials['Material.009']} skeleton={nodes.Cube002.skeleton} morphTargetDictionary={nodes.Cube002.morphTargetDictionary} morphTargetInfluences={nodes.Cube002.morphTargetInfluences} />
              <skinnedMesh name="Cube002_1" geometry={nodes.Cube002_1.geometry} material={materials['Material.011']} skeleton={nodes.Cube002_1.skeleton} morphTargetDictionary={nodes.Cube002_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_1.morphTargetInfluences} />
              <skinnedMesh name="Cube002_2" geometry={nodes.Cube002_2.geometry} material={materials['Material.015']} skeleton={nodes.Cube002_2.skeleton} morphTargetDictionary={nodes.Cube002_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_2.morphTargetInfluences} />
              <skinnedMesh name="Cube002_3" geometry={nodes.Cube002_3.geometry} material={materials['Material.018']} skeleton={nodes.Cube002_3.skeleton} morphTargetDictionary={nodes.Cube002_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_3.morphTargetInfluences} />
              <skinnedMesh name="Cube002_4" geometry={nodes.Cube002_4.geometry} material={materials['Material.021']} skeleton={nodes.Cube002_4.skeleton} morphTargetDictionary={nodes.Cube002_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_4.morphTargetInfluences} />
              <skinnedMesh name="Cube002_5" geometry={nodes.Cube002_5.geometry} material={materials['Material.044']} skeleton={nodes.Cube002_5.skeleton} morphTargetDictionary={nodes.Cube002_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_5.morphTargetInfluences} />
              <skinnedMesh name="Cube002_6" geometry={nodes.Cube002_6.geometry} material={materials['Material.045']} skeleton={nodes.Cube002_6.skeleton} morphTargetDictionary={nodes.Cube002_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_6.morphTargetInfluences} />
              <skinnedMesh name="Cube002_7" geometry={nodes.Cube002_7.geometry} material={materials['Material.060']} skeleton={nodes.Cube002_7.skeleton} morphTargetDictionary={nodes.Cube002_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_7.morphTargetInfluences} />
              <skinnedMesh name="Cube002_8" geometry={nodes.Cube002_8.geometry} material={materials['Material.029']} skeleton={nodes.Cube002_8.skeleton} morphTargetDictionary={nodes.Cube002_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_8.morphTargetInfluences} />
              <skinnedMesh name="Cube002_9" geometry={nodes.Cube002_9.geometry} material={materials['Material.035']} skeleton={nodes.Cube002_9.skeleton} morphTargetDictionary={nodes.Cube002_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_9.morphTargetInfluences} />
              <skinnedMesh name="Cube002_10" geometry={nodes.Cube002_10.geometry} material={materials['Material.036']} skeleton={nodes.Cube002_10.skeleton} morphTargetDictionary={nodes.Cube002_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_10.morphTargetInfluences} />
              <skinnedMesh name="Cube002_11" geometry={nodes.Cube002_11.geometry} material={materials['Material.037']} skeleton={nodes.Cube002_11.skeleton} morphTargetDictionary={nodes.Cube002_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_11.morphTargetInfluences} />
            </group>
          </group>
          <group name="Empty_paper" position={[1.492, 0.105, -2.468]} />
          <group name="Empty_GptChair"   position={[0, 0.038, -2.145]}   >
            <group name="B_GPT" position={[-0.755, 0.779, 0]}  >
              <primitive object={nodes.Root} />
              <primitive object={nodes.HandIKL} />
              <primitive object={nodes.HandIKR} />
              <primitive object={nodes.shinL_1} />
              <primitive object={nodes.shinR_1} />
              <primitive object={nodes.thighL_1} />
              <primitive object={nodes.thighR_1} />
              <primitive object={nodes.ArmpoleL} />
              <primitive object={nodes.ArmpoleR} />
            </group>
            <mesh name="Chair_GPT" geometry={nodes.Chair_GPT.geometry} material={materials['PlasticBlack.001']} position={[-0.745, 0.068, 0.041]} scale={1.167} />
          </group>
          <mesh name="Cube015" geometry={nodes.Cube015.geometry} material={materials['Material.073']} position={[-2.083, 1.24, -0.31]} scale={[1, 0.791, 1]} />
          <mesh name="Cube016" geometry={nodes.Cube016.geometry} material={materials['Material.073']} position={[-2.083, 1.329, -0.31]} rotation={[0, 0.101, 0]} scale={[1, 0.623, 1]} />
          <mesh name="Cube017" geometry={nodes.Cube017.geometry} material={materials['Material.073']} position={[-2.083, 1.27, -0.31]} rotation={[0, -0.174, 0]} scale={[1, 0.623, 1]} />
          <mesh name="Cube018" geometry={nodes.Cube018.geometry} material={materials['Material.073']} position={[-2.083, 1.177, -0.256]} rotation={[0, 0.24, 0]} scale={[1, 0.623, 1]} />
          <mesh name="Cube019" geometry={nodes.Cube019.geometry} material={materials['Material.063']} position={[-2.083, 1.385, 0.19]} rotation={[0, 0.313, 0]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Cube020" geometry={nodes.Cube020.geometry} material={materials['Material.064']} position={[-2.456, 1.24, -0.228]} rotation={[Math.PI, -0.19, Math.PI]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Cube021" geometry={nodes.Cube021.geometry} material={materials['Material.013']} position={[-2.441, 1.332, 0]} rotation={[0, -1.306, 0]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Cube022" geometry={nodes.Cube022.geometry} material={materials['Material.073']} position={[1.439, 1.251, -0.308]} rotation={[0, 0.812, 0]} scale={[1, 0.791, 1]} />
          <mesh name="Cube023" geometry={nodes.Cube023.geometry} material={materials['Material.073']} position={[1.439, 1.349, -0.308]} rotation={[0, 1.089, 0]} scale={[1, 0.623, 1]} />
          <mesh name="Cube024" geometry={nodes.Cube024.geometry} material={materials['Material.073']} position={[1.439, 1.287, -0.308]} rotation={[0, 0.868, 0]} scale={[1, 0.623, 1]} />
          <mesh name="Cube025" geometry={nodes.Cube025.geometry} material={materials['Material.064']} position={[1.828, 1.402, 0.006]} rotation={[0, 1.006, 0]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Cube026" geometry={nodes.Cube026.geometry} material={materials['Material.013']} position={[1.268, 1.25, 0.033]} rotation={[Math.PI, -1.076, Math.PI]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Cube027" geometry={nodes.Cube027.geometry} material={materials['Material.063']} position={[1.455, 1.351, 0.165]} rotation={[0, -0.165, 0]} scale={[0.672, 1.455, 0.645]} />
          <mesh name="Monitor_Window" geometry={nodes.Monitor_Window.geometry} material={materials['Material.062']} position={[2.453, 2.042, -0.515]} rotation={[-Math.PI, 1.181, -Math.PI]} scale={[0.235, 0, 0.116]} />
          <group name="Mouse" position={[-1.797, 1.208, -1.069]} rotation={[0, -0.371, 0]}>
            <mesh name="Cube011" geometry={nodes.Cube011.geometry} material={materials['Material.012']} />
            <mesh name="Cube011_1" geometry={nodes.Cube011_1.geometry} material={materials['Material.017']} />
          </group>
          <group name="WindowGray" position={[1.461, 3.437, -1.946]} rotation={[0, -0.873, 0]} scale={[0.005, 0.005, 0.009]}>
            <mesh name="Cube013" geometry={nodes.Cube013.geometry} material={materials['Material.065']} />
            <mesh name="Cube013_1" geometry={nodes.Cube013_1.geometry} material={materials['Material.066']} />
          </group>
          <group name="WindowGreen" position={[0.775, 3.224, -2.393]} rotation={[0, -0.873, 0]} scale={[0.019, 0.027, 0.038]}>
            <mesh name="Cube016_1" geometry={nodes.Cube016_1.geometry} material={materials['Material.067']} />
            <mesh name="Cube016_2" geometry={nodes.Cube016_2.geometry} material={materials['Material.066']} />
          </group>
          <group name="Desk" position={[3.265, 0.54, -0.477]} scale={[1.399, 1, 1.172]}>
            <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.007']} />
            <mesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.005']} />
            <mesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.010']} />
          </group>
          <group name="Keyboard" position={[-0.748, 1.213, -1.255]} scale={1.298}>
            <mesh name="Cube006_1" geometry={nodes.Cube006_1.geometry} material={materials['Material.012']} />
            <mesh name="Cube006_2" geometry={nodes.Cube006_2.geometry} material={materials['Material.013']} />
          </group>
          <group name="Minitor_Gamza" position={[2.641, 1.291, -0.672]} rotation={[-Math.PI, 0.873, -Math.PI]} scale={[0.235, 0.12, 0.116]}>
            <mesh name="Cube014" geometry={nodes.Cube014.geometry} material={materials['Material.008']} />
            <mesh name="Cube014_1" geometry={nodes.Cube014_1.geometry} material={materials['Material.016']} />
            <group name="Cube028_1" position={[-4.32, 9.278, -2.344]} rotation={[-3.092, -0.806, -3.083]} scale={[7.788, 10.442, 7.253]}>
              <mesh name="Cube029_1" geometry={nodes.Cube029_1.geometry} material={materials['Material.068']} />
              <mesh name="Cube029_2" geometry={nodes.Cube029_2.geometry} material={materials['Material.013']} />
            </group>
            <group name="Cube029" position={[-4.32, 7.69, -2.344]} rotation={[-3.098, -0.805, -3.089]} scale={[7.781, 10.443, 7.259]}>
              <mesh name="Cube030" geometry={nodes.Cube030.geometry} material={materials['Material.068']} />
              <mesh name="Cube030_1" geometry={nodes.Cube030_1.geometry} material={materials['Material.069']} />
            </group>
          </group>
          <mesh name="Minitor_GPT" geometry={nodes.Minitor_GPT.geometry} material={materials['Material.008']} position={[-0.358, 1.941, -0.259]} scale={[0.228, 0.122, 0.112]} />


          <group name="GPT">
            <skinnedMesh name="Cube006" geometry={nodes.Cube006.geometry} material={materials['Material.004']} skeleton={nodes.Cube006.skeleton} />
            <skinnedMesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['Material.004']} skeleton={nodes.Cube008.skeleton} />
            <skinnedMesh name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={materials['Material.003']} skeleton={nodes.Cylinder001.skeleton} />
            <skinnedMesh name="Cylinder001_1" geometry={nodes.Cylinder001_1.geometry} material={materials.Material} skeleton={nodes.Cylinder001_1.skeleton} />
            <skinnedMesh name="Cylinder001_2" geometry={nodes.Cylinder001_2.geometry} material={materials['Material.004']} skeleton={nodes.Cylinder001_2.skeleton} />
            <skinnedMesh name="Cylinder001_3" geometry={nodes.Cylinder001_3.geometry} material={materials['Material.006']} skeleton={nodes.Cylinder001_3.skeleton} />
            <skinnedMesh name="Cylinder001_4" geometry={nodes.Cylinder001_4.geometry} material={materials['Material.002']} skeleton={nodes.Cylinder001_4.skeleton} />
            <skinnedMesh name="Cylinder001_5" geometry={nodes.Cylinder001_5.geometry} material={materials['Material.001']} skeleton={nodes.Cylinder001_5.skeleton} />
            <skinnedMesh name="Cube007" geometry={nodes.Cube007.geometry} material={materials.Material} skeleton={nodes.Cube007.skeleton} morphTargetDictionary={nodes.Cube007.morphTargetDictionary} morphTargetInfluences={nodes.Cube007.morphTargetInfluences} />
          </group>

        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/gpt3.glb')
