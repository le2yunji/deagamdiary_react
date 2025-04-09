// CafeGamza.jsx
import React, { useEffect, forwardRef, useImperativeHandle }  from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const CafeGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef();
  const { scene, animations } = useGLTF('/assets/models/Gamza_Coffee.glb');

  // 클론을 정상적으로 생성하고 구조를 유지
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      onLoaded({ ref: group.current, mixer, actions });
    }
  }, [onLoaded, mixer, actions]);

  useEffect(() => {
    group.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        if (child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0);
        }
      }
    });
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Bone001" position={[-0.115, 0, 0]} rotation={[0, -1.571, 0]}>
          <primitive object={nodes.Root} />
          <primitive object={nodes.HandIKL} />
          <primitive object={nodes.HandIKR} />
          <primitive object={nodes.thighL_1} />
          <primitive object={nodes.thighR_1} />
          <primitive object={nodes.ArmpoleL} />
          <primitive object={nodes.ArmpoleR} />
          {/* Gamza 본체 스키닝된 메시들만 렌더 */}
          <skinnedMesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.016']} skeleton={nodes.Cube001.skeleton} morphTargetDictionary={nodes.Cube001.morphTargetDictionary} morphTargetInfluences={nodes.Cube001.morphTargetInfluences} />
          <skinnedMesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.017']} skeleton={nodes.Cube001_1.skeleton} morphTargetDictionary={nodes.Cube001_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_1.morphTargetInfluences} />
          <skinnedMesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.019']} skeleton={nodes.Cube001_2.skeleton} morphTargetDictionary={nodes.Cube001_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_2.morphTargetInfluences} />
          <skinnedMesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.021']} skeleton={nodes.Cube001_3.skeleton} morphTargetDictionary={nodes.Cube001_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_3.morphTargetInfluences} />
          <skinnedMesh name="Cube001_4" geometry={nodes.Cube001_4.geometry} material={materials['Material.032']} skeleton={nodes.Cube001_4.skeleton} morphTargetDictionary={nodes.Cube001_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_4.morphTargetInfluences} />
          <skinnedMesh name="Cube001_5" geometry={nodes.Cube001_5.geometry} material={materials['Material.055']} skeleton={nodes.Cube001_5.skeleton} morphTargetDictionary={nodes.Cube001_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_5.morphTargetInfluences} />
          <skinnedMesh name="Cube001_6" geometry={nodes.Cube001_6.geometry} material={materials['Material.056']} skeleton={nodes.Cube001_6.skeleton} morphTargetDictionary={nodes.Cube001_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_6.morphTargetInfluences} />
          <skinnedMesh name="Cube001_7" geometry={nodes.Cube001_7.geometry} material={materials['Material.058']} skeleton={nodes.Cube001_7.skeleton} morphTargetDictionary={nodes.Cube001_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_7.morphTargetInfluences} />
          <skinnedMesh name="Cube001_8" geometry={nodes.Cube001_8.geometry} material={materials['Material.061']} skeleton={nodes.Cube001_8.skeleton} morphTargetDictionary={nodes.Cube001_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_8.morphTargetInfluences} />
          <skinnedMesh name="Cube001_9" geometry={nodes.Cube001_9.geometry} material={materials['Material.062']} skeleton={nodes.Cube001_9.skeleton} morphTargetDictionary={nodes.Cube001_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_9.morphTargetInfluences} />
          <skinnedMesh name="Cube001_10" geometry={nodes.Cube001_10.geometry} material={materials['Material.063']} skeleton={nodes.Cube001_10.skeleton} morphTargetDictionary={nodes.Cube001_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_10.morphTargetInfluences} />
        </group>
      </group>
    </group>
  );
});

useGLTF.preload('/assets/models/Gamza_Coffee.glb');
