// component/Classroom.jsx

import React,{ useEffect, useImperativeHandle, forwardRef }  from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three';

export const Classroom = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/Classroomscene-draco.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, group)


  useImperativeHandle(ref, () => group.current); // ✅ 이거 꼭 필요!
 // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
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
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Empty" position={[0, 1.536, 0.458]} scale={[0.1, 0.098, 0.094]}>
          <group name="Empty002" position={[-0.653, 0.727, 0.035]} scale={0}>
            <group name="OnionBone" position={[-0.009, 0.336, 0]} scale={2.706}>
              <primitive object={nodes.Root} />
              <group name="OnionBody">
                <skinnedMesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials['Material.014']} skeleton={nodes.Cube001_1.skeleton} morphTargetDictionary={nodes.Cube001_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_1.morphTargetInfluences} />
                <skinnedMesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials['Material.015']} skeleton={nodes.Cube001_2.skeleton} morphTargetDictionary={nodes.Cube001_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_2.morphTargetInfluences} />
                <skinnedMesh name="Cube001_3" geometry={nodes.Cube001_3.geometry} material={materials['Material.016']} skeleton={nodes.Cube001_3.skeleton} morphTargetDictionary={nodes.Cube001_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_3.morphTargetInfluences} />
                <skinnedMesh name="Cube001_4" geometry={nodes.Cube001_4.geometry} material={materials['Material.017']} skeleton={nodes.Cube001_4.skeleton} morphTargetDictionary={nodes.Cube001_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_4.morphTargetInfluences} />
                <skinnedMesh name="Cube001_5" geometry={nodes.Cube001_5.geometry} material={materials['Material.023']} skeleton={nodes.Cube001_5.skeleton} morphTargetDictionary={nodes.Cube001_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_5.morphTargetInfluences} />
                <skinnedMesh name="Cube001_6" geometry={nodes.Cube001_6.geometry} material={materials['Material.018']} skeleton={nodes.Cube001_6.skeleton} morphTargetDictionary={nodes.Cube001_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_6.morphTargetInfluences} />
                <skinnedMesh name="Cube001_7" geometry={nodes.Cube001_7.geometry} material={materials['Material.019']} skeleton={nodes.Cube001_7.skeleton} morphTargetDictionary={nodes.Cube001_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube001_7.morphTargetInfluences} />
              </group>
            </group>
          </group>
          <group name="Empty003" position={[0.951, 0.587, -0.965]} scale={[0.025, 0.021, 0.026]}>
            <group name="GamzaBone" position={[-0.056, -0.007, -0.002]} rotation={[Math.PI, -0.45, Math.PI]} scale={0.432}>
              <primitive object={nodes.spine} />
              <primitive object={nodes.spine003} />
              <primitive object={nodes.neutral_bone} />
              <group name="Head_1">
                <skinnedMesh name="Cube004_1" geometry={nodes.Cube004_1.geometry} material={materials['Material.020']} skeleton={nodes.Cube004_1.skeleton} morphTargetDictionary={nodes.Cube004_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_1.morphTargetInfluences} />
                <skinnedMesh name="Cube004_2" geometry={nodes.Cube004_2.geometry} material={materials['Material.021']} skeleton={nodes.Cube004_2.skeleton} morphTargetDictionary={nodes.Cube004_2.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_2.morphTargetInfluences} />
                <skinnedMesh name="Cube004_3" geometry={nodes.Cube004_3.geometry} material={materials['Material.024']} skeleton={nodes.Cube004_3.skeleton} morphTargetDictionary={nodes.Cube004_3.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_3.morphTargetInfluences} />
                <skinnedMesh name="Cube004_4" geometry={nodes.Cube004_4.geometry} material={materials['Material.025']} skeleton={nodes.Cube004_4.skeleton} morphTargetDictionary={nodes.Cube004_4.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_4.morphTargetInfluences} />
                <skinnedMesh name="Cube004_5" geometry={nodes.Cube004_5.geometry} material={materials['Material.026']} skeleton={nodes.Cube004_5.skeleton} morphTargetDictionary={nodes.Cube004_5.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_5.morphTargetInfluences} />
                <skinnedMesh name="Cube004_6" geometry={nodes.Cube004_6.geometry} material={materials['Material.028']} skeleton={nodes.Cube004_6.skeleton} morphTargetDictionary={nodes.Cube004_6.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_6.morphTargetInfluences} />
                <skinnedMesh name="Cube004_7" geometry={nodes.Cube004_7.geometry} material={materials['Material.029']} skeleton={nodes.Cube004_7.skeleton} morphTargetDictionary={nodes.Cube004_7.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_7.morphTargetInfluences} />
                <skinnedMesh name="Cube004_8" geometry={nodes.Cube004_8.geometry} material={materials['Material.030']} skeleton={nodes.Cube004_8.skeleton} morphTargetDictionary={nodes.Cube004_8.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_8.morphTargetInfluences} />
                <skinnedMesh name="Cube004_9" geometry={nodes.Cube004_9.geometry} material={materials['Material.032']} skeleton={nodes.Cube004_9.skeleton} morphTargetDictionary={nodes.Cube004_9.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_9.morphTargetInfluences} />
                <skinnedMesh name="Cube004_10" geometry={nodes.Cube004_10.geometry} material={materials['Material.033']} skeleton={nodes.Cube004_10.skeleton} morphTargetDictionary={nodes.Cube004_10.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_10.morphTargetInfluences} />
                <skinnedMesh name="Cube004_11" geometry={nodes.Cube004_11.geometry} material={materials['Material.042']} skeleton={nodes.Cube004_11.skeleton} morphTargetDictionary={nodes.Cube004_11.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_11.morphTargetInfluences} />
                <skinnedMesh name="Cube004_12" geometry={nodes.Cube004_12.geometry} material={materials['Material.043']} skeleton={nodes.Cube004_12.skeleton} morphTargetDictionary={nodes.Cube004_12.morphTargetDictionary} morphTargetInfluences={nodes.Cube004_12.morphTargetInfluences} />
              </group>
              <group name="Pad">
                <skinnedMesh name="Cube010" geometry={nodes.Cube010.geometry} material={materials['Material.022']} skeleton={nodes.Cube010.skeleton} morphTargetDictionary={nodes.Cube010.morphTargetDictionary} morphTargetInfluences={nodes.Cube010.morphTargetInfluences} />
                <skinnedMesh name="Cube010_1" geometry={nodes.Cube010_1.geometry} material={materials['Material.031']} skeleton={nodes.Cube010_1.skeleton} morphTargetDictionary={nodes.Cube010_1.morphTargetDictionary} morphTargetInfluences={nodes.Cube010_1.morphTargetInfluences} />
              </group>
            </group>
          </group>
          <group name="Chairrim001" position={[-0.43, 0.98, 1.053]} scale={[-0.021, -0.021, -0.023]}>
            <mesh name="Chairrim001_1" geometry={nodes.Chairrim001_1.geometry} material={materials.Legs} />
            <mesh name="Chairrim001_2" geometry={nodes.Chairrim001_2.geometry} material={materials.Cushion} />
            <mesh name="Chairrim001_3" geometry={nodes.Chairrim001_3.geometry} material={materials.Caps} />
            <mesh name="Chairrim001_4" geometry={nodes.Chairrim001_4.geometry} material={materials['Material.010']} />
            <mesh name="Chairrim001_5" geometry={nodes.Chairrim001_5.geometry} material={materials.Desk} />
            <mesh name="Chairrim001_6" geometry={nodes.Chairrim001_6.geometry} material={materials.Hook} />
            <mesh name="Chairrim001_7" geometry={nodes.Chairrim001_7.geometry} material={materials['Bolt.001']} />
            <mesh name="Chairrim001_8" geometry={nodes.Chairrim001_8.geometry} material={materials['Material.011']} />
            <mesh name="Chairrim001_9" geometry={nodes.Chairrim001_9.geometry} material={materials['Material.012']} />
          </group>
          <group name="Chairrim002" position={[0.467, 0.98, 1.053]} scale={[-0.021, -0.021, -0.023]}>
            <mesh name="Chairrim006" geometry={nodes.Chairrim006.geometry} material={materials.Legs} />
            <mesh name="Chairrim006_1" geometry={nodes.Chairrim006_1.geometry} material={materials.Cushion} />
            <mesh name="Chairrim006_2" geometry={nodes.Chairrim006_2.geometry} material={materials.Caps} />
            <mesh name="Chairrim006_3" geometry={nodes.Chairrim006_3.geometry} material={materials['Material.010']} />
            <mesh name="Chairrim006_4" geometry={nodes.Chairrim006_4.geometry} material={materials.Desk} />
            <mesh name="Chairrim006_5" geometry={nodes.Chairrim006_5.geometry} material={materials.Hook} />
            <mesh name="Chairrim006_6" geometry={nodes.Chairrim006_6.geometry} material={materials['Bolt.001']} />
            <mesh name="Chairrim006_7" geometry={nodes.Chairrim006_7.geometry} material={materials['Material.011']} />
            <mesh name="Chairrim006_8" geometry={nodes.Chairrim006_8.geometry} material={materials['Material.012']} />
          </group>
          <group name="Chairrim003" position={[1.363, 0.98, 1.053]} scale={[-0.021, -0.021, -0.023]}>
            <mesh name="Chairrim007" geometry={nodes.Chairrim007.geometry} material={materials.Legs} />
            <mesh name="Chairrim007_1" geometry={nodes.Chairrim007_1.geometry} material={materials.Cushion} />
            <mesh name="Chairrim007_2" geometry={nodes.Chairrim007_2.geometry} material={materials.Caps} />
            <mesh name="Chairrim007_3" geometry={nodes.Chairrim007_3.geometry} material={materials['Material.010']} />
            <mesh name="Chairrim007_4" geometry={nodes.Chairrim007_4.geometry} material={materials.Desk} />
            <mesh name="Chairrim007_5" geometry={nodes.Chairrim007_5.geometry} material={materials.Hook} />
            <mesh name="Chairrim007_6" geometry={nodes.Chairrim007_6.geometry} material={materials['Bolt.001']} />
            <mesh name="Chairrim007_7" geometry={nodes.Chairrim007_7.geometry} material={materials['Material.011']} />
            <mesh name="Chairrim007_8" geometry={nodes.Chairrim007_8.geometry} material={materials['Material.012']} />
          </group>
          <group name="Classroom001" position={[-1.085, 0.523, -0.86]} rotation={[-Math.PI, 0.083, -Math.PI]} scale={[0.101, 0.103, 0.068]}>
            <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials.Bolt} />
            <mesh name="Cube003_1" geometry={nodes.Cube003_1.geometry} material={materials['Whiteboard.002']} />
            <mesh name="Cube003_2" geometry={nodes.Cube003_2.geometry} material={materials['Material.008']} />
          </group>
          <mesh name="Classroom002" geometry={nodes.Classroom002.geometry} material={materials['White.001']} position={[-1.318, 0.894, 1.017]} rotation={[0, 1.571, 0]} scale={[0.215, 0.161, 0.161]} />
          <mesh name="Classroom050" geometry={nodes.Classroom050.geometry} material={materials['White.001']} position={[-1.318, 0.879, 1.017]} rotation={[0, 1.571, 0]} scale={[0.215, 0.161, 0.161]} />
          <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials['Material.002']} position={[1.519, 0.325, -1.546]} rotation={[0, -1.571, 0]} scale={[1.069, 1.018, 0.817]} />
          <mesh name="Cube002" geometry={nodes.Cube002.geometry} material={materials['Material.002']} position={[-1.296, 0.411, 1.015]} scale={[0.059, 0.015, 0.509]} />
          <mesh name="Cube004" geometry={nodes.Cube004.geometry} material={materials['Black.003']} position={[-1.081, 1.415, -1.66]} scale={[1, 1.018, 1.069]} />
          <mesh name="Cube006" geometry={nodes.Cube006.geometry} material={materials['Material.002']} position={[-1.397, 0.931, 1.015]} scale={[0.066, 0.494, 0.509]} />
          <mesh name="Cube007" geometry={nodes.Cube007.geometry} material={materials['Material.002']} position={[-1.397, 0.713, 1.015]} scale={[0.059, 0.015, 0.509]} />
          <mesh name="Cube011" geometry={nodes.Cube011.geometry} material={materials.Bolt} position={[-1.09, 0.164, -0.867]} rotation={[0, -0.083, 0]} scale={[0.82, 0.929, 0.974]} />
          <mesh name="Cube012" geometry={nodes.Cube012.geometry} material={materials.Bolt} position={[-1.09, 0.072, -0.867]} rotation={[0, -0.083, 0]} scale={[0.912, 1.289, 0.974]} />
          <mesh name="Cube013" geometry={nodes.Cube013.geometry} material={materials['Material.002']} position={[-1.397, 0.556, 1.015]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.059, 0.013, 0.153]} />
          <group name="Cube014" position={[0, -0.064, -0.49]} scale={[1, 1.018, 1.069]}>
            <mesh name="Cube024" geometry={nodes.Cube024.geometry} material={materials['Material.003']} />
            <mesh name="Cube024_1" geometry={nodes.Cube024_1.geometry} material={materials['Material.004']} />
            <mesh name="Cube024_2" geometry={nodes.Cube024_2.geometry} material={materials['Material.005']} />
          </group>
          <group name="Cube025" position={[1.658, 0.744, -1.537]} rotation={[0, 1.289, 0]} scale={[0.242, 0.337, 0.229]}>
            <mesh name="Cube019" geometry={nodes.Cube019.geometry} material={materials['Material.064']} />
            <mesh name="Cube019_1" geometry={nodes.Cube019_1.geometry} material={materials['Material.063']} />
            <mesh name="Cube019_2" geometry={nodes.Cube019_2.geometry} material={materials['Material.034']} />
            <mesh name="Cube019_3" geometry={nodes.Cube019_3.geometry} material={materials['Material.013']} />
          </group>
          <group name="Cylinder001" position={[-1.046, -0.011, -1.45]} rotation={[1.571, -0.005, 0.083]} scale={[0.604, 0.645, 0.615]}>
            <mesh name="Cylinder001_1" geometry={nodes.Cylinder001_1.geometry} material={materials.Black} />
            <mesh name="Cylinder001_2" geometry={nodes.Cylinder001_2.geometry} material={materials['Desk.001']} />
            <mesh name="Cylinder001_3" geometry={nodes.Cylinder001_3.geometry} material={materials.Bolt} />
          </group>
          <mesh name="Cylinder002" geometry={nodes.Cylinder002.geometry} material={materials['Material.007']} position={[-1.15, 0.073, 1.526]} scale={[0.742, 0.755, 0.792]} />
          <mesh name="Cylinder003" geometry={nodes.Cylinder003.geometry} material={nodes.Cylinder003.material} position={[-1.128, 0.216, 0.002]} scale={[1.022, 1.207, 1.092]} />
          <mesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials['Material.009']} position={[-1.128, 0.23, 0.002]} scale={[1.191, 1.406, 1.273]} />
          <group name="Cylinder015" position={[-1.252, 0.525, 0.693]} rotation={[1.715, -0.752, 1.79]} scale={[0.199, 0.275, 0.188]}>
            <mesh name="Cylinder017" geometry={nodes.Cylinder017.geometry} material={materials['Material.038']} />
            <mesh name="Cylinder017_1" geometry={nodes.Cylinder017_1.geometry} material={materials['Material.039']} />
            <mesh name="Cylinder017_2" geometry={nodes.Cylinder017_2.geometry} material={materials['Material.040']} />
            <mesh name="Cylinder017_3" geometry={nodes.Cylinder017_3.geometry} material={materials['Material.041']} />
          </group>
          <group name="Photo1" position={[-1.352, 1.026, -0.52]} rotation={[-2.039, 1.556, 2.058]} scale={[0.227, 0.216, 0.212]}>
            <mesh name="Cube033" geometry={nodes.Cube033.geometry} material={materials['Material.036']} />
            <mesh name="Cube033_1" geometry={nodes.Cube033_1.geometry} material={materials['Material.046']} />
          </group>
          <group name="Photo1001" position={[-1.346, 1.076, -1.19]} rotation={[-0.79, 1.544, 0.685]} scale={[0.215, 0.205, 0.201]}>
            <mesh name="Cube034" geometry={nodes.Cube034.geometry} material={materials['Material.045']} />
            <mesh name="Cube034_1" geometry={nodes.Cube034_1.geometry} material={materials['Material.046']} />
          </group>
          <group name="Photo1002" position={[-1.352, 0.779, 0.092]} rotation={[-1.4, 1.565, 1.514]} scale={[0.197, 0.188, 0.184]}>
            <mesh name="Cube035" geometry={nodes.Cube035.geometry} material={materials['Material.035']} />
            <mesh name="Cube035_1" geometry={nodes.Cube035_1.geometry} material={materials['Material.046']} />
          </group>
          <group name="Plane001" position={[-1.126, 0.44, 0.021]} rotation={[0.032, -0.508, -1.548]} scale={[0.716, 0.715, 0.741]}>
            <mesh name="Plane001_1" geometry={nodes.Plane001_1.geometry} material={materials['Material.001']} />
            <mesh name="Plane001_2" geometry={nodes.Plane001_2.geometry} material={materials['Plant.002']} />
          </group>
          <group name="ppt" position={[0.233, 1.076, -1.655]} rotation={[0, 1.571, 0]} scale={[0.146, 0.139, 0.12]}>
            <mesh name="Cube025_1" geometry={nodes.Cube025_1.geometry} material={materials.Black} />
            <mesh name="Cube025_2" geometry={nodes.Cube025_2.geometry} material={materials.White} />
            <mesh name="Cube025_3" geometry={nodes.Cube025_3.geometry} material={materials.Whiteboard} />
          </group>
          <group name="UmbrellaCanvas" position={[-1.11, -0.023, 1.549]} rotation={[2.683, -0.712, 2.974]} scale={[1.398, 0.499, 1.404]}>
            <mesh name="Circle011" geometry={nodes.Circle011.geometry} material={materials['Umbrella.Canopy.002']} />
            <mesh name="Circle011_1" geometry={nodes.Circle011_1.geometry} material={materials['Umbrella.Bronze']} />
            <mesh name="Circle011_2" geometry={nodes.Circle011_2.geometry} material={materials['Umbrella.Wood.001']} />
          </group>
          <group name="UmbrellaCanvas001" position={[-1.172, -0.01, 1.494]} rotation={[-2.749, 1, 2.867]} scale={[1.426, 0.497, 1.382]}>
            <mesh name="Circle001" geometry={nodes.Circle001.geometry} material={materials['Umbrella.Canopy']} />
            <mesh name="Circle001_1" geometry={nodes.Circle001_1.geometry} material={materials['Umbrella.Bronze']} />
            <mesh name="Circle001_2" geometry={nodes.Circle001_2.geometry} material={materials['Umbrella.Wood']} />
          </group>
          <group name="UmbrellaCanvas002" position={[-1.163, -0.025, 1.556]} rotation={[2.255, 1.386, -2.065]} scale={[1.447, 0.497, 1.359]}>
            <mesh name="Circle002" geometry={nodes.Circle002.geometry} material={materials['Umbrella.Canopy.001']} />
            <mesh name="Circle002_1" geometry={nodes.Circle002_1.geometry} material={materials['Umbrella.Bronze']} />
            <mesh name="Circle002_2" geometry={nodes.Circle002_2.geometry} material={materials['Material.006']} />
          </group>
          <group name="교탁" position={[0.964, -0.044, -0.51]} rotation={[0, 1.571, 0]} scale={[0.175, 0.167, 0.143]}>
            <mesh name="Cube008" geometry={nodes.Cube008.geometry} material={materials['light_wood.002']} />
            <mesh name="Cube008_1" geometry={nodes.Cube008_1.geometry} material={materials['Desk.001']} />
            <mesh name="Cube008_2" geometry={nodes.Cube008_2.geometry} material={materials['Black.001']} />
            <mesh name="Cube008_3" geometry={nodes.Cube008_3.geometry} material={materials.Logo} />
          </group>
          <group name="시계" position={[-1.331, 1.29, 0.099]} rotation={[Math.PI, 0, Math.PI]} scale={[0.107, 0.109, 0.1]}>
            <mesh name="Cube014_1" geometry={nodes.Cube014_1.geometry} material={materials.Clock} />
            <mesh name="Cube014_2" geometry={nodes.Cube014_2.geometry} material={materials['Yellow.001']} />
          </group>
          <group name="책" position={[0.749, 0.42, -1.501]} rotation={[0, 1.571, 0]} scale={[0.171, 0.163, 0.14]}>
            <mesh name="Cube018" geometry={nodes.Cube018.geometry} material={materials['White.002']} />
            <mesh name="Cube018_1" geometry={nodes.Cube018_1.geometry} material={materials['Yellow.002']} />
            <mesh name="Cube018_2" geometry={nodes.Cube018_2.geometry} material={materials['Plant.001']} />
            <mesh name="Cube018_3" geometry={nodes.Cube018_3.geometry} material={materials['Material.027']} />
            <mesh name="Cube018_4" geometry={nodes.Cube018_4.geometry} material={materials['Bookcover.001']} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/assets/models/Classroomscene-draco.glb')
