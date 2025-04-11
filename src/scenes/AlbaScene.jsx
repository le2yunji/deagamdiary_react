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
} from '../utils/Common';

export default function AlbaScene({
  playerRef,
  emotionRef,
  setPlayerVisible,
  setCameraTarget,
  disableMouse,
  enableMouse,
  setCameraActive,
  setAlbaCameraRef,
  setDisableMovement,
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

        gsap.to(camera, {
          duration: 1,
          zoom: 40,
          ease: "power2.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        });
          gsap.to(camera.position, {
          duration: 1,
          x: -35.7,
          y: 3,
          z: -16,
          ease: "power2.out",
          onUpdate: () => {
            camera.updateProjectionMatrix()
            // camera.lookAt(-35, 5, -13)
          },
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

          // if (actions) {
          //   Object.values(actions).forEach((action) => action.play());
          //   actions["Confuse"]?.reset().play();
          // }
          
          const confuse = gamzaActions.current?.["Confuse"];
          if (confuse) {

            confuse.timeScale = 0.63

            confuse.setLoop(THREE.LoopRepeat, Infinity);
            confuse.clampWhenFinished = false;
            confuse.reset().play();
          }

          // Aha: 한 번만 재생, 마지막 프레임 유지
          const aha = gamzaActions.current?.["Aha"];
          if (aha) {
            aha.timeScale = 0.63
            aha.setLoop(THREE.LoopOnce, 1);
            aha.clampWhenFinished = true;
          }

        setTimeout(() => {    
          if (albaGamzaRef.current) {
          confuse.stop();
          aha.reset().play();

          gsap.to(albaGamzaRef.current.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "bounce.inOut",
          });
        }
          setTimeout(() => {
            restorePlayerAfterAlba();
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

        <Posters />

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
