// AlbaScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrthographicCamera } from '@react-three/drei';
import SceneCameraManager from '../components/SceneCameraManager';

import { MailBox } from '../components/MailBox';
import { MailGamza } from '../components/MailGamza';
import { File } from '../components/File';

import {
    downCameraY,
    returnCameraY,
    disappearPlayer,
    appearPlayer,
    disableMouseEvents,
    enableMouseEvents
  } from '../utils/Common';

  export default function MailScene({
    playerRef,        // 감자 모델 참조
    emotionRef,       // 감자 머리 위 이모션 참조
    setPlayerVisible, // 감자 보임 여부 변경 함수 (사용 안됨)
    setCameraTarget,  // 카메라가 다시 따라가야 할 타겟
    disableMouse,     // 마우스 이벤트 제거
    enableMouse,      // 마우스 이벤트 복원
    setCameraActive,   // 메인 카메라로 복귀 설정
    setAlbaCameraRef, // ✅ albaCameraRef 설정용
    setDisableMovement
  }) {
    const group = useRef();
    const cameraRef = useRef(); // 지하철 씬용 오쏘 카메라
    const [albaBoardRef, setAlbaBoardRef] = useState(null);
    // const [albaGamzaRef, setAlbaGamzaRef] = useState(null);
    const [mixer, setMixer] = useState(null);
    const [actions, setActions] = useState(null);
    const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부

    const mailGamzaRef = useRef(); // ✅ useState 대신
    const mailBoxRef = useRef(); // ✅ useState 대신
    const fileRef = useRef(); // ✅ useState 대신

    const mailgamzaMixer = useRef();
    const mailgamzaActions = useRef();
  
    const fileMixer = useRef();
    const fileActions = useRef();

    const clock = new THREE.Clock(); // 애니메이션용 시간
    const mailSpotMeshPosition = new Vector3(112, 0.005, 25); // 감자가 도달해야 할 스팟 위치
    const { scene, gl, camera } = useThree();
    const mailSpotRef = useRef(); // ✅ 메쉬 ref 추가
  
    const [showCloudEffect, setShowCloudEffect] = useState(false);
    const bgAudio = document.getElementById("bg-audio");


    // 알바 구하기 이벤트 완료 후 감자 복귀
    const restorePlayerAfterMail = () => {
      setShowCloudEffect(true);
      setTimeout(() => setShowCloudEffect(false), 1500);

      if (mailGamzaRef.current) {
        gsap.to(mailGamzaRef.current.position, {
          y: 2,
          duration: 0.7,
          ease: "expo.inOut"
        });
        gsap.to(mailGamzaRef.current.scale, {
          x: 0, y: 0, z: 0, duration: 0.7, ease: "expo.inOut",
        });
      }

      playerRef.current.visible = true;
      playerRef.current.position.set(107, 0.3, 26);
      playerRef.current.scale.set(0.3, 0.3, 0.3);
  
      appearPlayer(playerRef, 0.8); // 부드럽게 다시 나타남
      returnCameraY()
      // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
      setCameraTarget(new Vector3(99, 0, 25));  
      enableMouseEvents();      // 마우스 이벤트 복원
      setDisableMovement(false)
      if (bgAudio) bgAudio.play(); //📢

    };

  
    // 🎮 매 프레임마다 실행
    useFrame(() => {
      const delta = clock.getDelta();
      fileMixer.current?.update(delta);
      mailgamzaMixer.current?.update(delta);

      if (!triggered && playerRef.current) {
        // 감자와 스팟 간 거리 계산
        const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
        const spotPosXZ = new Vector3(mailSpotMeshPosition.x, 0, mailSpotMeshPosition.z);
        const dist = playerPosXZ.distanceTo(spotPosXZ);

        // 일정 거리 이내에 도달하면 이벤트 트리거
        if (dist < 1.5) {
          if (bgAudio) bgAudio.pause(); //📢
          setTriggered(true);
          disableMouseEvents();
          setDisableMovement(true)
          setShowCloudEffect(true);
          disappearPlayer(playerRef); // 감자 작아지며 사라짐
          scene.remove(scene.getObjectByName('mailSpot'));
          scene.remove(mailSpotRef.current); // ✅ 정확하게 제거됨
          mailSpotRef.current.visible = false
  
            // ✅ mail 모델 스케일 애니메이션
          if (mailGamzaRef.current) {
            // albaGamzaRef.visible = true
            setTimeout(() => setShowCloudEffect(false), 1500);
            // downCameraY(camera);

            gsap.to(camera, {
              duration: 1,
              zoom: 55,
              ease: "power2.out",
              onUpdate: () => camera.updateProjectionMatrix(),
            });
            // gsap.to(camera.position,{
            //   duration: 1, 
            //   // x: 4, 
            //   y: 3, 
            //   ease: "expo.inOut",
            //   onUpdate: () => {
            //     camera.updateProjectionMatrix();
            //   },        
            // })
   
            
            gsap.to(camera.position, {
              duration: 1,
              y: 3.5,      // ↑ 카메라를 좀 더 위로 올림
              ease: "expo.inOut",
              onUpdate: () => {
                const target = playerRef.current.position.clone();
                target.y += 0.4; // 👀 눈 높이쯤을 바라보게
                camera.lookAt(target);
                camera.updateProjectionMatrix();
              },
            });
            gsap.to(mailGamzaRef.current.scale, {
              x: 1.7,
              y: 1.7,
              z: 1.7,
              duration: 1,
              ease: "back.out"
            });
            gsap.to(fileRef.current.scale, {
              x: 1.7,
              y: 1.7,
              z: 1.7,
              duration: 1,
              ease: "power3.inOut"
            });
            
            setTimeout(() => {
                mailgamzaActions.current?.["Anim2"].reset().play()
                // mailgamza.actions[0].play();
                fileActions.current?.["Folder"].reset().play()
                // 🔥 Three.js 이벤트에서 GIF 오버레이 실행
                setTimeout(() => {
                  // showGIFOverlay(); // GIF 화면 전체 표시
                }, 4000);
            }, 500);



              // setTimeout(() => setShowCloudEffect(false), 1000); // 구름 이펙트
            
          }
          // 감자 애니메이션
          // [Anim2, Idle, Pocket, PostAnim, Walk_Bone.002]

          // 파일 애니메이션
          // [Folder]

          // 🚊 애니메이션 및 카메라 연출
          // setTimeout(() => {
          //     if (actions) {
          //       Object.values(actions).forEach((action) => action.play());
          //       actions["Scene"]?.reset().play();  // ✅ 도달 후 실행
          //     }
          // }, 1500);
  
          // 감자 다시 등장
          setTimeout(() => {    
            restorePlayerAfterMail();
          }, 8000);
        }
      }
  
      // 애니메이션 업데이트
      if (mixer) mixer.update(clock.getDelta());
    });
  
    return (
      <>

      <group ref={group}>
        {/* ✅ 알바 게시판 모델 */}
        <MailBox
          ref={mailBoxRef}
          position={[114, 0, 23.5]}
          rotation={[0, THREE.MathUtils.degToRad(40), 0]}
        //   rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
        onLoaded={({ ref }) => (mailBoxRef.current = ref)}
        />

        <MailGamza
          ref={mailGamzaRef}
          position={[112, 0.5, 24.7]}
          rotation={[0, THREE.MathUtils.degToRad(20), 0]}
          scale={[0, 0, 0]}
          onLoaded={({ actions, mixer }) => {
            mailgamzaActions.current = actions;
            mailgamzaMixer.current = mixer;
          }}
        />

      <File
        ref={fileRef}
        position={[112, 0.5, 24.7]}
        rotation={[0, THREE.MathUtils.degToRad(20), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ actions, mixer }) => {
          fileActions.current = actions;
          fileMixer.current = mixer;
        }}
      />

      {/* ✅ 구름 이펙트 */}
      {showCloudEffect && mailGamzaRef.current && (
      <CloudEffect
        position={[
            mailGamzaRef.current?.position?.x ?? 0,
          (mailGamzaRef.current?.position?.y ?? 0) + 4,
          mailGamzaRef.current?.position?.z ?? 0
        ]}
      />
    )}
  
        {/* ✅ 바닥 클릭 지점 */}
        <mesh
          name="albaSpot"
          ref={mailSpotRef} // ✅ ref 연결
          position={mailSpotMeshPosition}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="royalblue" transparent opacity={0.5} />
        </mesh>
  
      </group>
      </>
    );
  }
  