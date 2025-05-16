// ChatGPT.jsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useGLTF, useAnimations,  } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { useGraph } from '@react-three/fiber'


export const ChatGPT = forwardRef(({ onLoaded, onGamzaRef, ...props }, ref) => {
  const group = useRef()
  const gamzaRef = useRef();
  const { scene, animations } = useGLTF('/assets/models/gpt3.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
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
        <group name="Empty_Center" position={[0, -0.038, 2.145]}>
          <group name="Empty" position={[-1.255, 0.105, 1.693]} rotation={[Math.PI, 0, Math.PI]}>


            <group ref={gamzaRef} name="B_Gamza" position={[0.322, 0.325, -0.539]} rotation={[0, 1.157, 0]} scale={1.106}>
              <primitive object={nodes.Root} />
              <primitive object={nodes.HandIKL} />
              <primitive object={nodes.HandIKR} />
              <primitive object={nodes.shinL_1} />
              <primitive object={nodes.shinR_1} />
              <primitive object={nodes.thighL_1} />
              <primitive object={nodes.thighR_1} />
              <primitive object={nodes.ArmpoleL} />
              <primitive object={nodes.ArmpoleR} />
              <group name="Cube002" />
              <group name="Cube001">
                <skinnedMesh name="Cube002_1" geometry={nodes.Cube002_1.geometry} material={materials['Material.009']} skeleton={nodes.Cube002_1.skeleton} morphTargetDictionary={nodes.Cube002_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_1.morphTargetInfluences} />
                <skinnedMesh name="Cube002_2" geometry={nodes.Cube002_2.geometry} material={materials['Material.011']} skeleton={nodes.Cube002_2.skeleton} morphTargetDictionary={nodes.Cube002_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_2.morphTargetInfluences} />
                <skinnedMesh name="Cube002_3" geometry={nodes.Cube002_3.geometry} material={materials['Material.015']} skeleton={nodes.Cube002_3.skeleton} morphTargetDictionary={nodes.Cube002_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_3.morphTargetInfluences} />
                <skinnedMesh name="Cube002_4" geometry={nodes.Cube002_4.geometry} material={materials['Material.018']} skeleton={nodes.Cube002_4.skeleton} morphTargetDictionary={nodes.Cube002_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_4.morphTargetInfluences} />
                <skinnedMesh name="Cube002_5" geometry={nodes.Cube002_5.geometry} material={materials['Material.021']} skeleton={nodes.Cube002_5.skeleton} morphTargetDictionary={nodes.Cube002_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_5.morphTargetInfluences} />
                <skinnedMesh name="Cube002_6" geometry={nodes.Cube002_6.geometry} material={materials['Material.044']} skeleton={nodes.Cube002_6.skeleton} morphTargetDictionary={nodes.Cube002_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_6.morphTargetInfluences} />
                <skinnedMesh name="Cube002_7" geometry={nodes.Cube002_7.geometry} material={materials['Material.045']} skeleton={nodes.Cube002_7.skeleton} morphTargetDictionary={nodes.Cube002_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_7.morphTargetInfluences} />
                <skinnedMesh name="Cube002_8" geometry={nodes.Cube002_8.geometry} material={materials['Material.029']} skeleton={nodes.Cube002_8.skeleton} morphTargetDictionary={nodes.Cube002_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_8.morphTargetInfluences} />
                <skinnedMesh name="Cube002_9" geometry={nodes.Cube002_9.geometry} material={materials['Material.035']} skeleton={nodes.Cube002_9.skeleton} morphTargetDictionary={nodes.Cube002_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_9.morphTargetInfluences} />
                <skinnedMesh name="Cube002_10" geometry={nodes.Cube002_10.geometry} material={materials['Material.036']} skeleton={nodes.Cube002_10.skeleton} morphTargetDictionary={nodes.Cube002_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_10.morphTargetInfluences} />
                <skinnedMesh name="Cube002_11" geometry={nodes.Cube002_11.geometry} material={materials['Material.037']} skeleton={nodes.Cube002_11.skeleton} morphTargetDictionary={nodes.Cube002_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_11.morphTargetInfluences} />
                <skinnedMesh name="Cube002_12" geometry={nodes.Cube002_12.geometry} material={materials['Material.020']} skeleton={nodes.Cube002_12.skeleton} morphTargetDictionary={nodes.Cube002_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube002_12.morphTargetInfluences} />
              </group>
            </group>


            <group name="Gamza" />
            <mesh name="GptBubble1" geometry={nodes.GptBubble1.geometry} material={materials.GptBubble} position={[-0.262, 3.445, -0.956]} rotation={[Math.PI / 2, 0, -0.209]} scale={0.014} />
            <mesh name="GptBubble2" geometry={nodes.GptBubble2.geometry} material={materials['GptBubble.001']} position={[-0.262, 3.445, -0.956]} rotation={[Math.PI / 2, 0, 0.531]} scale={0.014} />
            <mesh name="Chair_Gamza" geometry={nodes.Chair_Gamza.geometry} material={materials['PlasticBlack.001']} rotation={[-Math.PI, 0.414, -Math.PI]} scale={1.167} />
          </group>
          <group name="Empty_paper" position={[1.492, 0.105, -2.468]} />
          <group name="Cube007" />
          <group name="Empty_GptChair" position={[0, 0.038, -2.145]}>
            <group name="B_GPT" position={[-0.755, 0.779, 0]}>
              <primitive object={nodes.Root_1} />
              <group name="Cube009" />
              <skinnedMesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials.Material} skeleton={nodes.Cube003.skeleton} morphTargetDictionary={nodes.Cube003.morphTargetDictionary} morphTargetInfluences={nodes.Cube003.morphTargetInfluences} />
              <skinnedMesh name="Cube006" geometry={nodes.Cube006.geometry} material={materials['Material.004']} skeleton={nodes.Cube006.skeleton} />
              <skinnedMesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['Material.004']} skeleton={nodes.Cube008.skeleton} />
              <group name="GPT">
                <skinnedMesh name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={materials['Material.003']} skeleton={nodes.Cylinder001.skeleton} />
                <skinnedMesh name="Cylinder001_1" geometry={nodes.Cylinder001_1.geometry} material={materials['Material.001']} skeleton={nodes.Cylinder001_1.skeleton} />
                <skinnedMesh name="Cylinder001_2" geometry={nodes.Cylinder001_2.geometry} material={materials['Material.002']} skeleton={nodes.Cylinder001_2.skeleton} />
                <skinnedMesh name="Cylinder001_3" geometry={nodes.Cylinder001_3.geometry} material={materials['Material.006']} skeleton={nodes.Cylinder001_3.skeleton} />
                <skinnedMesh name="Cylinder001_4" geometry={nodes.Cylinder001_4.geometry} material={materials['Material.008']} skeleton={nodes.Cylinder001_4.skeleton} />
                <skinnedMesh name="Cylinder001_5" geometry={nodes.Cylinder001_5.geometry} material={materials['Material.012']} skeleton={nodes.Cylinder001_5.skeleton} />
              </group>
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
          <mesh name="Monitor_Window" geometry={nodes.Monitor_Window.geometry} material={materials['Material.023']} position={[2.453, 2.042, -0.515]} rotation={[-Math.PI, 1.007, -Math.PI]} scale={[0.235, 0, 0.116]} />
          <group name="Mouse" position={[-1.797, 1.208, -1.069]} rotation={[0, -0.371, 0]}>
            <mesh name="Cube011" geometry={nodes.Cube011.geometry} material={materials['Material.014']} />
            <mesh name="Cube011_1" geometry={nodes.Cube011_1.geometry} material={materials['Material.019']} />
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
            <mesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.007']} />
            <mesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.005']} />
            <mesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.010']} />
          </group>
          <group name="Keyboard" position={[-0.748, 1.213, -1.255]} scale={1.298}>
            <mesh name="Cube006_1" geometry={nodes.Cube006_1.geometry} material={materials['Material.014']} />
            <mesh name="Cube006_2" geometry={nodes.Cube006_2.geometry} material={materials['Material.013']} />
          </group>
          <group name="Minitor_Gamza" position={[2.641, 1.291, -0.672]} rotation={[-Math.PI, 0.873, -Math.PI]} scale={[0.235, 0.12, 0.116]}>
            <mesh name="Cube014" geometry={nodes.Cube014.geometry} material={materials['Material.016']} />
            <mesh name="Cube014_1" geometry={nodes.Cube014_1.geometry} material={materials['Material.017']} />
            <group name="Cube028_1" position={[-4.32, 9.278, -2.344]} rotation={[-3.092, -0.806, -3.083]} scale={[7.788, 10.442, 7.253]}>
              <mesh name="Cube029_1" geometry={nodes.Cube029_1.geometry} material={materials['Material.068']} />
              <mesh name="Cube029_2" geometry={nodes.Cube029_2.geometry} material={materials['Material.013']} />
            </group>
            <group name="Cube029" position={[-4.32, 7.69, -2.344]} rotation={[-3.098, -0.805, -3.089]} scale={[7.781, 10.443, 7.259]}>
              <mesh name="Cube030" geometry={nodes.Cube030.geometry} material={materials['Material.068']} />
              <mesh name="Cube030_1" geometry={nodes.Cube030_1.geometry} material={materials['Material.069']} />
            </group>
          </group>
          <mesh name="Minitor_GPT" geometry={nodes.Minitor_GPT.geometry} material={materials['Material.016']} position={[-0.358, 1.941, -0.259]} scale={[0.228, 0.122, 0.112]} />
        </group>
        <group name="Empty_Center001" position={[0, -0.038, 2.145]}>
          <mesh name="Monitor_Window001" geometry={nodes.Monitor_Window001.geometry} material={materials['Material.022']} position={[2.453, 2.042, -0.515]} rotation={[-Math.PI, 1.007, -Math.PI]} scale={[0.235, 0, 0.116]} />
        </group>
        <group name="Empty_Center002" position={[0, -0.038, 2.145]}>
          <mesh name="Monitor_Window002" geometry={nodes.Monitor_Window002.geometry} material={materials['Material.025']} position={[2.453, 2.042, -0.515]} rotation={[-Math.PI, 1.007, -Math.PI]} scale={[0.235, 0, 0.116]} />
        </group>
        <mesh name="Icosphere" geometry={nodes.Icosphere.geometry} material={nodes.Icosphere.material} />
        <mesh name="Icosphere001" geometry={nodes.Icosphere001.geometry} material={nodes.Icosphere001.material} />
        <mesh name="Icosphere002" geometry={nodes.Icosphere002.geometry} material={nodes.Icosphere002.material} />
        <mesh name="Icosphere003" geometry={nodes.Icosphere003.geometry} material={nodes.Icosphere003.material} />
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/gpt3.glb');
