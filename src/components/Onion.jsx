// Onion.jsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export const Onion = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/onion1.glb')
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
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="OnionBone" position={[0, 0.508, 0]}>
          <primitive object={nodes.Root} />
          <group name="BodyO">
            <skinnedMesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.013']} skeleton={nodes.Cube003.skeleton} morphTargetDictionary={nodes.Cube003.morphTargetDictionary} morphTargetInfluences={nodes.Cube003.morphTargetInfluences} />
            <skinnedMesh name="Cube003_1" geometry={nodes.Cube003_1.geometry} material={materials['Material.006']} skeleton={nodes.Cube003_1.skeleton} morphTargetDictionary={nodes.Cube003_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_1.morphTargetInfluences} />
            <skinnedMesh name="Cube003_2" geometry={nodes.Cube003_2.geometry} material={materials['Material.007']} skeleton={nodes.Cube003_2.skeleton} morphTargetDictionary={nodes.Cube003_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_2.morphTargetInfluences} />
            <skinnedMesh name="Cube003_3" geometry={nodes.Cube003_3.geometry} material={materials.Material} skeleton={nodes.Cube003_3.skeleton} morphTargetDictionary={nodes.Cube003_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_3.morphTargetInfluences} />
            <skinnedMesh name="Cube003_4" geometry={nodes.Cube003_4.geometry} material={materials['Material.023']} skeleton={nodes.Cube003_4.skeleton} morphTargetDictionary={nodes.Cube003_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_4.morphTargetInfluences} />
            <skinnedMesh name="Cube003_5" geometry={nodes.Cube003_5.geometry} material={materials['Material.017']} skeleton={nodes.Cube003_5.skeleton} morphTargetDictionary={nodes.Cube003_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_5.morphTargetInfluences} />
            <skinnedMesh name="Cube003_6" geometry={nodes.Cube003_6.geometry} material={materials['Material.012']} skeleton={nodes.Cube003_6.skeleton} morphTargetDictionary={nodes.Cube003_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube003_6.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/onion1.glb')
