// AlbaScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import SceneCameraManager from '../components/SceneCameraManager';

import { House } from '../components/House';


import {
    disappearPlayer,
    appearPlayer,
    disableMouseEvents,
    enableMouseEvents
  } from '../utils/Common';

  export default function HouseScene({
    playerRef,        // 감자 모델 참조
    emotionRef,       // 감자 머리 위 이모션 참조
    setPlayerVisible, // 감자 보임 여부 변경 함수 (사용 안됨)
    setCameraTarget,  // 카메라가 다시 따라가야 할 타겟
    disableMouse,     // 마우스 이벤트 제거
    enableMouse,      // 마우스 이벤트 복원
    setCameraActive,   // 메인 카메라로 복귀 설정
    setAlbaCameraRef, // ✅ albaCameraRef 설정용
  }) {
    const group = useRef();
    const cameraRef = useRef(); // 지하철 씬용 오쏘 카메라
    
    // const [albaGamzaRef, setAlbaGamzaRef] = useState(null);
    const [mixer, setMixer] = useState(null);
    const [actions, setActions] = useState(null);
    const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부
    const houseRef = useRef(); // ✅ useState 대신
    
    const clock = new THREE.Clock(); // 애니메이션용 시간
    const HouseSpotMeshPosition = new Vector3(-16, 0.005, 108); // 감자가 도달해야 할 스팟 위치
    const { scene } = useThree();
    const houseSpotRef = useRef(); // ✅ 메쉬 ref 추가
  
    const [useHouseCamera, setUseHouseCamera] = useState(false);
    const [showCloudEffect, setShowCloudEffect] = useState(false);

    // 알바 구하기 이벤트 완료 후 감자 복귀
    // const restorePlayerAfterHouse = () => {
    //   playerRef.current.visible = true;
    //   playerRef.current.position.set(-39, 0.3, -16);
    //   playerRef.current.scale.set(0.3, 0.3, 0.3);
  
    //   appearPlayer(playerRef, 0.8); // 부드럽게 다시 나타남
  
    //   if (emotionRef.current) {
    //     emotionRef.current.visible = true;
    //   }
  
    //   // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    //   setCameraTarget(new Vector3(-43, 0, -9));  
    //   enableMouseEvents();      // 마우스 이벤트 복원
    // };

    
  
    // 🎮 매 프레임마다 실행
    useFrame(() => {
      if (!triggered && playerRef.current) {
        // 감자와 스팟 간 거리 계산
        const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
        const spotPosXZ = new Vector3(HouseSpotMeshPosition.x, 0, HouseSpotMeshPosition.z);
        const dist = playerPosXZ.distanceTo(spotPosXZ);
        // 일정 거리 이내에 도달하면 이벤트 트리거
        if (dist < 1.5) {
          setTriggered(true);
          if (emotionRef.current) emotionRef.current.visible = false;
          disableMouseEvents();
          disappearPlayer(playerRef); // 감자 작아지며 사라짐
          scene.remove(scene.getObjectByName('houseSpot'));
          scene.remove(houseSpotRef.current); // ✅ 정확하게 제거됨
          houseSpotRef.current.visible = false
  
  
            // ✅ alba 모델 스케일 애니메이션
          if (houseRef.current) {
            // albaGamzaRef.visible = true
            setShowCloudEffect(true);
            setTimeout(() => setShowCloudEffect(false), 1500);
            gsap.to(houseRef.current.scale, {
              x: 1.5,
              y: 1.5,
              z: 1.5,
              duration: 0.3,
              ease: "bounce.out"
            });
          }
  
          // 🚊 애니메이션 및 카메라 연출
          setTimeout(() => {
              if (actions) {
                Object.values(actions).forEach((action) => action.play());
                actions["Scene"]?.reset().play();  // ✅ 도달 후 실행
              }
          }, 1500);
  
          // 감자 다시 등장
          setTimeout(() => {    
            // restorePlayerAfterHouse();
          }, 10000);
        }
      }
  
      // 애니메이션 업데이트
      if (mixer) mixer.update(clock.getDelta());
    });
  
    return (
      <>
      <group ref={group}> 
        <House
        ref={houseRef}
        position={[-21.09, 0.5, 114]}
        rotation={[0, THREE.MathUtils.degToRad(50), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
          setMixer(mixer);
          setActions(actions);
        }}
      />
      
      {/* ✅ 구름 이펙트 */}
      {showCloudEffect && houseRef.current && (
      <CloudEffect
        position={[
            houseRef.current?.position?.x ?? 0,
          (houseRef.current?.position?.y ?? 0) + 4,
          houseRef.current?.position?.z ?? 0
        ]}
      />
    )}

        
  
        {/* ✅ 바닥 클릭 지점 */}
        <mesh
          name="houseSpot"
          ref={houseSpotRef} // ✅ ref 연결
          position={HouseSpotMeshPosition}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="orange" transparent opacity={0.5} />
        </mesh>
  
      </group>
      </>
    );
  }
  