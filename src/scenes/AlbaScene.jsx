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
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';

import {
  disappearPlayer,
  appearPlayer,
  // disableMouseEvents,
  // enableMouseEvents,
  // returnCameraY
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

  const clock = new THREE.Clock();
  const { scene, camera } = useThree();

  const bgAudio = document.getElementById("bg-audio");
  const ahaAudioRef = useRef();
  const hmmAudioRef = useRef();

  const gamzaActions = useRef();
  const gamzaMixer = useRef();

  const [selectedPoster, setSelectedPoster] = useState(null);

  const AlbaSpotMeshPosition = new Vector3(-25.5, 0.005, -10);
  const albaTexture = useTexture('/assets/images/albaTrigger.png');

  useEffect(() => {
    if (albaTexture) {
      albaTexture.colorSpace = THREE.SRGBColorSpace;
      albaTexture.anisotropy = 16;
      albaTexture.flipY = false;
      albaTexture.needsUpdate = true;
    }
  }, [albaTexture]);


  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };

  // ✅ 알바 씬 끝 복귀
  const restorePlayerAfterAlba = () => {
    // if (bgAudio) bgAudio.play();
    playerRef.current.visible = true;
    playerRef.current.position.set(-29, 0.3, -6);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    if (bgAudio) bgAudio.volume = 0.2;

    ahaAudioRef.current?.stop();
    hmmAudioRef.current?.stop();

    gsap.to(camera, {
      duration: 1,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setSelectedPoster(null); // ✅ 알바씬 끝나면 포스터 닫기

  // ✅ DOM에서 포스터 토글 닫기
  const ids = [
    "gamza-poster",
    "bakery-poster",
    "kids-poster",
    "dokseo-poster",
    "sushi-poster",
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
    appearPlayer(playerRef, 1.2);
    setCameraTarget(new Vector3(-33, 0, 1));
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
        ahaAudioRef.current?.play();
        hmmAudioRef.current?.stop();

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
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

        break;
      case "IwannagoHomeMemo":
      case "DoNotNakseoMemo":
      case "WonesoongMemo":
        aha?.stop()
        confuse?.reset().play(); 
        idle?.reset().play(); 
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

        break;
      default:
        confuse?.stop()
        aha?.stop()
        idle?.reset().play();
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

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

      if (dist < 2) {
        setTriggered(true);
        setDisableMovement(true);
        if (bgAudio) bgAudio.volume = 0.03;

        // if (bgAudio) bgAudio.pause();
        disappearPlayer(playerRef);
        scene.remove(scene.getObjectByName("albaSpot"));
        scene.remove(albaSpotRef.current);
        if (albaSpotRef.current) albaSpotRef.current.visible = false;


        // 💡 카메라 전환 (씬 전용 카메라 활성화)
        activateSceneCamera(setCameraActive, setUseSceneCamera);

        setInitialCameraPose({
          position: [-25, 7, -9],
          lookAt: [-25, 5, -9],
          zoom: 50
        });

        // 💡 카메라 이동 + 시선 애니메이션
        animateCamera({
          position: { x: -25, y: 10, z: 5 },
          lookAt: [-25, 4, -10],
          zoom: 55,
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

  useEffect(() => {
    const handlePosterClose = (e) => {
      setSelectedPoster(null);
    };
    window.addEventListener('PosterClosed', handlePosterClose);
    return () => window.removeEventListener('PosterClosed', handlePosterClose);
  }, []);

  return (
    <>
      {/* 👇 카메라 매니저는 비활성화 */}
      {/* <SceneCameraManager ... /> */}

      <group ref={group}>
        <AlbaBoard
          position={[-25, 0, -7.7]} 
          scale={[3, 3, 3]}
          // rotation={[0, THREE.MathUtils.degToRad(10), 0]}
          onLoaded={({ albaBoardRef }) => setAlbaBoardRef(albaBoardRef)}
          onClick={() => {}}
        />

        <AlbaGamza
          ref={albaGamzaRef}
          position={[-25, 0, -10]}
          scale={[0, 0, 0]}
          onLoaded={({ mixer, actions }) => {
            gamzaMixer.current = mixer;
            gamzaActions.current = actions;
          }}
        />
        <ManualAudioPlayer
          ref={ahaAudioRef}
          url="/assets/audio/albaScene_aha.mp3"
          volume={3}
          loop={false}
          position={[-25, 2, -10]}
        />
        <ManualAudioPlayer
          ref={hmmAudioRef}
          url="/assets/audio/albaScene_hmm.mp3"
          volume={3}
          loop={false}
          position={[-25, 2, -10]}
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
          rotation={[-Math.PI / 2, 0, Math.PI]}
          receiveShadow
        >
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial   
          map={albaTexture}
          transparent={true} 
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true} // ✅ 핵심 옵션!
          />
        </mesh>
      </group>


    </>
  );
}
