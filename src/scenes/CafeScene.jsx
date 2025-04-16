// CafeScene.jsx.jsx

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Cafe } from '../components/Cafe';
import { AudioTimelinePlayer } from '../utils/AudioTimelinePlayer';
// import useCameraSwitcher from '../hooks/useCameraSwitcher';

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  enableMouseEvents,
  downCameraY,
  returnCameraY
} from '../utils/Common';

export default function CafeScene({
  playerRef,
  setCameraTarget,
  setDisableMovement,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,       // 💡 추가
  useSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera
}) {
  const group = useRef();

  const cafeRef = useRef();
  const cafeActions = useRef();
  const cafeMixer = useRef();

  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const lightRef = useRef();
  const clock = new THREE.Clock();
  const CafeSpotMeshPosition = new Vector3(-37.5, 0.005, -89);
  const { scene, camera } = useThree();
  const cafeSpotRef = useRef();

  const bgAudio = document.getElementById("bg-audio");

  useEffect(() => {
    if (cafeRef.current?.model) {
      cafeRef.current.model.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
    }
  }, []);

  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };


  // ✅ 씬 복귀  
  const restorePlayerAfterCafe = () => {
    if (coffeeFinished) {
    playerRef.current.visible = true;
    playerRef.current.position.set(-38.7, 0.3, -86.7);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);

    appearPlayer(playerRef, 1.2);

  
    returnCameraY(camera);

    gsap.to(camera, {
      duration: 1,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setCameraTarget(new Vector3(-30, 0, -69.5));
    if (bgAudio) bgAudio.play(); //📢
  }
  };

  let coffeeFinished = false;
  const hasRestoredRef = useRef(false);

  // 🟡 ☕️ 카페씬 인터랙션 시작
  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x, 0, playerRef.current.position.z
      ).distanceTo(new Vector3(CafeSpotMeshPosition.x, 0, CafeSpotMeshPosition.z));

      // 카페 스팟 매쉬 도달시
      if (dist < 1.5) {
        if (bgAudio) bgAudio.pause(); //📢
        triggerCloudEffect();
        disappearPlayer(playerRef);

        setTriggered(true);

       // 💡 카메라 전환 (씬 전용 카메라 활성화)
        activateSceneCamera(setCameraActive, setUseSceneCamera);

        // 💡 카메라 이동 + 시선 애니메이션
        animateCamera({
          position: { x: -34, y: 10, z: -73 },
          lookAt: [-38, 5, -86],
          zoom: 50,
          duration: 1.5
        });

        scene.remove(scene.getObjectByName('cafeSpot'));
        scene.remove(cafeSpotRef.current);
        if (cafeSpotRef.current) cafeSpotRef.current.visible = false;

        // disableMouseEvents();
        setDisableMovement(true);

  
        if (lightRef.current) scene.add(lightRef.current);

        if (cafeRef.current.model) {
          gsap.to(
            cafeRef.current.position,
            { y: 0, duration: 0.5, ease: "bounce.inOut" }
          );
          gsap.to(
            cafeRef.current.model.scale,
            { x: 1.8, y: 1.8, z: 1.8, duration: 0.5, ease: "expo.inOut" }
          );
 

          const scene = cafeActions.current?.["Scene"];
          if (scene) { scene.reset().play(); scene.timeScale = 0.8; }
        }
  
        setTimeout(() => {
          coffeeFinished = true
          triggerCloudEffect(); 
          // ✅ scale로 등장
          gsap.to(cafeRef.current.gamza.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
          });

          // ✅ position으로 튕기며 등장
          gsap.fromTo(
            cafeRef.current.gamza.position,
            { y: 0 },
            { y: 2, duration: 0.5, ease: "bounce.out" }
          );
          setTimeout(()=>{
            if (!hasRestoredRef.current) {
              restoreMainCamera(setCameraActive, setUseSceneCamera);
              restorePlayerAfterCafe();
              hasRestoredRef.current = true;
            }
          }, 1500)
        }, 16000);
        
      }
    }
  });

  useFrame((_, delta) => {
    cafeMixer.current?.update(delta);
  });

  return (
    <group ref={group}>

    <Cafe
      ref={cafeRef} // ✅ ref 넘기기
      position={[-39, 0, -87]}
      rotation={[0, THREE.MathUtils.degToRad(-50), 0]}
      // scale={[1.5, 1.5, 1.5]}
      scale={[0, 0, 0]}
      onLoaded={({ mixer, actions }) => {
        cafeMixer.current = mixer;
        cafeActions.current = actions;
      }}
    />

      {showCloudEffect && playerRef.current && (
        <CloudEffect
          position={[
            playerRef.current.position.x,
            playerRef.current.position.y + 2,
            playerRef.current.position.z
          ]}
        />
      )}

      <mesh
        name="cafeSpot"
        ref={cafeSpotRef}
        position={CafeSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
