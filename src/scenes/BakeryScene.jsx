import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import CloudEffect from '../components/CloudEffect';
import { Bakery } from '../components/Bakery';
import { BakeryGamza } from '../components/BakeryGamza';
import { BamGoguma } from '../components/BamGoguma';

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  disablePlayerControlEvents,
  enableMouseEvents,
  downCameraY,
  returnCameraY,
  showArrow,
  hideAllArrows,
  createArrows,
} from '../utils/Common';

export default function BakeryScene({
  playerRef,
  setDisableMovement,
  setCameraTarget,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,       // 💡 추가
  useSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose
}) {
  const group = useRef();
  const { scene, camera } = useThree();
  const clock = new THREE.Clock();

  const bakeryRef = useRef();
  const bakeryMixer = useRef();
  const bakeryActions = useRef();

  const bakeryGamzaRef = useRef();
  const bakeryGamzaMixer = useRef();
  const bakeryGamzaActions = useRef();

  const bamGogumaRef = useRef();
  const bamGogumaMixer = useRef();  
  const bamGogumaActions = useRef();


  const bakerySpotRef = useRef();
  const BakerySpotMeshPosition = new Vector3(31, 0.005, -38);

  const [triggered, setTriggered] = useState(false);
  const [ovenInteractionReady, setOvenInteractionReady] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);
  const light = new PointLight('white', 3, 200, 1);

//   light.position.set(30, 8, -38);
//   light.castShadow = true;
//     // ✅ 그림자 품질 설정
//   light.shadow.mapSize.width = 1024; // 기본: 512
//   light.shadow.mapSize.height = 1024;
//   light.shadow.radius = 10; // 부드럽게 (PCF 필터 기반)
//   light.shadow.bias = -0.002; // 셰도우 아티팩트 제거용 미세 조정

//   const light2 = new PointLight('white', 2, 300, 2);
//   light2.position.set(30, 3, -42);
//   light2.castShadow = true;
//   // ✅ 그림자 품질 설정
//   light2.shadow.mapSize.width = 1024; // 기본: 512
//   light2.shadow.mapSize.height = 1024;
//   light2.shadow.radius = 10; // 부드럽게 (PCF 필터 기반)
//   light2.shadow.bias = -0.002; // 셰도우 아티팩트 제거용 미세 조정

//   // 💡 조명
// const addLight = () => {
//   scene.add(light, light2)
// }
  // // ⬇️ 화살표 생성
  // const arrowInfos = [{ x: 37, y: 8, z: -36, rotationX: -10, rotationY: 8 }];
  // useEffect(() => {
  //   createArrows(scene, arrowInfos);
  //   hideAllArrows();
  // }, []);

  // ✅ 씬 복귀
  const restorePlayerAfterBakery = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(23, 0.3, -28);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    appearPlayer(playerRef, 1.2);
    setDisableMovement(false);
    enableMouseEvents();

    setCameraTarget(new Vector3(20, 0, -23.5));
  };        

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };

  // ✅ 플레이어 도달 → 초기 애니메이션 재생
  useFrame(() => {
    const delta = clock.getDelta();
    bakeryMixer.current?.update(delta);
    bakeryGamzaMixer.current?.update(delta);
    bamGogumaMixer.current?.update(delta);


    if (!triggered && playerRef.current) {
      const dist = playerRef.current.position.clone().setY(0).distanceTo(BakerySpotMeshPosition);

      if (dist < 1.5) {
        setTriggered(true);
        disappearPlayer(playerRef);
        setDisableMovement(true);

        setTimeout(() => {
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [30, 8, -30],
            lookAt: [30, 2, -37],
            zoom: 30,
            near: -100,  // ✅ 추가
            far: 50,    // ✅ 추가
          });

          animateCamera({
            position: { x: 30, y: 6, z: -30},
            lookAt: [30, 2, -37],
            zoom: 35,
            duration: 3,
            near: -100,
            far: 50,
          });

        }, 200)

        // triggerCloudEffect()

        // 모델 등장
        gsap.to(bakeryRef.current.scale, {
          x: 1.7,
          y: 1.7,
          z: 1.7,
          duration: 0.5,
          ease: "expo.inOut"
        });

        gsap.to(bakeryGamzaRef.current.scale, {
          x: 1.7,
          y: 1.7,
          z: 1.7,
          duration: 0.5,
          ease: "expo.inOut"       
        });
        gsap.to(bamGogumaRef.current.scale, {
          x: 1.7,
          y: 1.7,
          z: 1.7,
          duration: 0.5,
          ease: "expo.inOut",
        });

        // setTimeout(() => {
        //   addLight()
        // }, 800)

        const bakeryAnim = bakeryActions.current?.["Scene"]
        bakeryAnim.reset().play();
        bakeryAnim.timeScale = 0.7;

        const bakeryGamzaAnim = bakeryGamzaActions.current?.["Scene"]
        bakeryGamzaAnim.reset().play();
        bakeryGamzaAnim.timeScale = 0.7;

        const bamGogumaAnim = bamGogumaActions.current?.["Scene"]
        bamGogumaAnim.reset().play();
        bamGogumaAnim.timeScale = 0.7;

        setTimeout(() => {
          triggerCloudEffect()
          gsap.to(bakeryGamzaRef.current.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power3.inOut",
          });
        }, 22000);

        setTimeout(() => {
          restoreMainCamera(setCameraActive, setUseSceneCamera);
          restorePlayerAfterBakery();
        }, 25000);

      }
    }
  });



  return (
    <group ref={group}>
      <Bakery
        ref={bakeryRef}
        position={[30, 0, -38]}
        rotation={[0, THREE.MathUtils.degToRad(45), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ actions, mixer }) => {
          bakeryActions.current = actions;
          bakeryMixer.current = mixer;
        }}
      />

      <BamGoguma
        ref={bamGogumaRef}
        position={[30.3, 0, -35.5]}
        rotation={[0, THREE.MathUtils.degToRad(30), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ actions, mixer }) => {
          bamGogumaActions.current = actions;
          bamGogumaMixer.current = mixer;
        }}
      />

      <BakeryGamza
        ref={bakeryGamzaRef}
        position={[30, 0, -38]}
        rotation={[0, THREE.MathUtils.degToRad(45), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ actions, mixer }) => {
          bakeryGamzaActions.current = actions;
          bakeryGamzaMixer.current = mixer;
        }}
      />

      {showCloudEffect && bakeryGamzaRef.current && (
        <CloudEffect
          position={[
            34,
            4,
            -37,
          ]}
        />
      )}
      <mesh
        name="bakerySpot"
        ref={bakerySpotRef}
        position={BakerySpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="brown" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
