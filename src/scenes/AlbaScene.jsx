// AlbaScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import { AlbaBoard } from '../components/AlbaBoard';
import { AlbaGamza } from '../components/AlbaGamza';
import { Posters } from '../components/AlbaPosters';

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  enableMouseEvents,
  returnCameraY
} from '../utils/Common';

export default function AlbaScene({
  playerRef,
  setPlayerVisible,
  setCameraTarget,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,  
  setDisableMovement,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  useSceneCamera,
  setInitialCameraPose,

}) {
  const group = useRef();
  const albaGamzaRef = useRef();
  const albaSpotRef = useRef();

  const [albaBoardRef, setAlbaBoardRef] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [actions, setActions] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const AlbaSpotMeshPosition = new Vector3(-36, 0.005, -21);
  const clock = new THREE.Clock();
  const { scene, camera } = useThree();

  const bgAudio = document.getElementById("bg-audio");

  const gamzaActions = useRef();
  const gamzaMixer = useRef();

  const [selectedPoster, setSelectedPoster] = useState(null);


  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };

  // ✅ 알바 씬 끝 복귀
  const restorePlayerAfterAlba = () => {
    // if (bgAudio) bgAudio.play();
    playerRef.current.visible = true;
    playerRef.current.position.set(-39, 0.3, -16);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    gsap.to(camera, {
      duration: 1,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });


    appearPlayer(playerRef, 1.2);
    setCameraTarget(new Vector3(-43, 0, -9));
    setDisableMovement(false);
  };

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!triggered || !selectedPoster || !gamzaActions.current) return;
  
    const idle = gamzaActions.current["Idle"];
    const aha = gamzaActions.current["Aha"];
    const confuse = gamzaActions.current["Confuse"];
  
    if (confuse) {
      confuse.timeScale = 0.63;
      confuse.setLoop(THREE.LoopRepeat, Infinity);
      confuse.clampWhenFinished = false;
    }
  
    if (aha) {
      aha.timeScale = 0.63;
      aha.setLoop(THREE.LoopOnce, 1);
      aha.clampWhenFinished = true;
    }
  
    if (idle) {
      idle.timeScale = 0.63;
      idle.setLoop(THREE.LoopRepeat, Infinity);
      idle.clampWhenFinished = false;
    }
  
    switch (selectedPoster) {
      case "BakeryMemo":
        idle?.stop()
        confuse?.stop()
        aha?.reset().play();
        setTimeout(() => { 
          aha?.stop()
          idle?.reset().play(); 
        }, 1000);
        break;
      case "GamzaMemo":
      case "SushiMemo":
      case "KidsMemo":
      case "DokseoMemo":
        aha?.stop()
        idle?.stop()
        confuse?.reset().play();
        break;
      case "IwannagoHomeMemo":
      case "DoNotNakseoMemo":
      case "WonesoongMemo":
        aha?.stop()
        confuse?.reset().play(); 
        idle?.reset().play(); 
        break;
      default:
        confuse?.stop()
        aha?.stop()
        idle?.reset().play();
        break;
    }
  }, [triggered, selectedPoster]);
  
  // 🟡 🪧 알바씬 인터랙션 시작
  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x,
        0,
        playerRef.current.position.z
      ).distanceTo(new Vector3(AlbaSpotMeshPosition.x, 0, AlbaSpotMeshPosition.z));

      if (dist < 1.5) {
        setTriggered(true);
        setDisableMovement(true);

        // if (bgAudio) bgAudio.pause();
        disappearPlayer(playerRef);
        scene.remove(scene.getObjectByName("albaSpot"));
        scene.remove(albaSpotRef.current);
        if (albaSpotRef.current) albaSpotRef.current.visible = false;


     // 💡 카메라 전환 (씬 전용 카메라 활성화)
     activateSceneCamera(setCameraActive, setUseSceneCamera);

     setInitialCameraPose({
      position: [-35, 7, -19],
      lookAt: [-35, 5, -19],
      zoom: 55
    });

     // 💡 카메라 이동 + 시선 애니메이션
     animateCamera({
       position: { x: -35, y: 10, z: -10 },
       lookAt: [-35, 5, -20],
       zoom: 60,
       duration: 1.5
     });

        if (albaGamzaRef.current) {
          setShowCloudEffect(true);
          setTimeout(() => setShowCloudEffect(false), 1500);
          gsap.to(albaGamzaRef.current.scale, {
            x: 1.7,
            y: 1.7,
            z: 1.7,
            duration: 0.3,
            ease: "bounce.out",
          });
        }

        setTimeout(() => {    
          if (albaGamzaRef.current) {

          gsap.to(albaGamzaRef.current.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "bounce.inOut",
          });
        }
          setTimeout(() => {
            if (!hasRestoredRef.current) {
              restoreMainCamera(setCameraActive, setUseSceneCamera);
              restorePlayerAfterAlba();
              hasRestoredRef.current = true;
            }
          }, 1000 )
        }, 20000);
      }
    }
  });
  useFrame((_, delta) => {
    gamzaMixer.current?.update(delta);
  });
  return (
    <>
      {/* 👇 카메라 매니저는 비활성화 */}
      {/* <SceneCameraManager ... /> */}

      <group ref={group}>
        <AlbaBoard
          position={[-35, 0, -24]}
          // rotation={[0, THREE.MathUtils.degToRad(10), 0]}
          onLoaded={({ albaBoardRef }) => setAlbaBoardRef(albaBoardRef)}
          onClick={() => {}}
        />

        <AlbaGamza
          ref={albaGamzaRef}
          position={[-35, 0.5, -20]}
          scale={[0, 0, 0]}
          onLoaded={({ mixer, actions }) => {
            gamzaMixer.current = mixer;
            gamzaActions.current = actions;
          }}
        />

        {showCloudEffect && albaGamzaRef.current && (
          <CloudEffect
            position={[
              albaGamzaRef.current?.position?.x ?? 0,
              (albaGamzaRef.current?.position?.y ?? 0) + 4,
              albaGamzaRef.current?.position?.z ?? 0,
            ]}
          />
        )}

        <Posters 
          selectedPoster={selectedPoster}
          setSelectedPoster={setSelectedPoster}
        />

        <mesh
          name="albaSpot"
          ref={albaSpotRef}
          position={AlbaSpotMeshPosition}
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
