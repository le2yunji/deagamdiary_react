import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Cafe } from '../components/Cafe';
import { Coffee } from '../components/Coffee';
import { CafeGamza } from '../components/CafeGamza';

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
  emotionRef,
  setCameraTarget,
  disableMouse,
  enableMouse,
  setDisableMovement
}) {
  const group = useRef();

  const cafeGamzaRef = useRef();
  const coffeeRef = useRef();
  const cafeRef = useRef();

  const cafeActions = useRef();
  const coffeeActions = useRef();
  const cafeGamzaActions = useRef();

  const cafeMixer = useRef();
  const coffeeMixer = useRef();
  const cafeGamzaMixer = useRef();

  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const lightRef = useRef();
  const clock = new THREE.Clock();
  const CafeSpotMeshPosition = new Vector3(-37.5, 0.005, -89);
  const { scene, camera } = useThree();
  const cafeSpotRef = useRef();

  const bgAudio = document.getElementById("bg-audio");

  useEffect(() => {
    if (cafeGamzaRef.current) {
      cafeGamzaRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      coffeeRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      cafeRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
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
    playerRef.current.position.set(-37.7, 0.3, -86.7);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);
    appearPlayer(playerRef, 1.2);
    triggerCloudEffect();

    if (cafeGamzaRef.current) {
      gsap.to(cafeGamzaRef.current.scale, {
        x: 0, y: 0, z: 0, duration: 1, ease: "bounce.inOut"
      });
    }

    // if (emotionRef.current) emotionRef.current.visible = true;
    returnCameraY(camera);

    gsap.to(camera, {
      duration: 1,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setCameraTarget(new Vector3(-30, 0, -69.5));
    // if (bgAudio) bgAudio.play(); //📢
  }
  };

  let coffeeFinished = false;

  // 카페씬 인터랙션 시작
  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x, 0, playerRef.current.position.z
      ).distanceTo(new Vector3(CafeSpotMeshPosition.x, 0, CafeSpotMeshPosition.z));

      // 카페 스팟 매쉬 도달시
      if (dist < 1.5) {
        // if (bgAudio) bgAudio.pause(); //📢

        setTriggered(true);
        // if (emotionRef.current) emotionRef.current.visible = false;
        triggerCloudEffect();
        disappearPlayer(playerRef);

        scene.remove(scene.getObjectByName('cafeSpot'));
        scene.remove(cafeSpotRef.current);
        if (cafeSpotRef.current) cafeSpotRef.current.visible = false;

        // disableMouseEvents();
        downCameraY(camera);
        setDisableMovement(true);

        gsap.to(camera, {
          duration: 1,
          zoom: 40,
          ease: "power2.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        });

        if (lightRef.current) scene.add(lightRef.current);

        if (cafeRef.current && coffeeRef.current) {
          gsap.to(
            [cafeRef.current.scale, coffeeRef.current.scale, cafeGamzaRef.current.scale],
            { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, ease: "bounce.inOut" }
          );
        }
        setTimeout(() => {
          if (cafeGamzaRef.current) {
            gsap.to(
              [cafeRef.current.scale, coffeeRef.current.scale, cafeGamzaRef.current.scale],
              { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power3.inOut" }
            );
          }
        }, 1000)
       

        setTimeout(() => {
          const anim1 = cafeActions.current?.["CoffeAnim1"];
          const idle = cafeGamzaActions.current?.["Idle"];
          if (anim1) { anim1.reset().play(); anim1.timeScale = 0.8; }
          if (idle) { idle.reset().play(); idle.timeScale = 0.8; }
        }, 1500);

        setTimeout(() => {
          cafeActions.current?.["CoffeAnim1"]?.stop();
          const anim2 = cafeActions.current?.["CoffeAnim2"];
          const cup1 = coffeeActions.current?.["cupfee1"];
          if (anim2) { anim2.reset().play(); anim2.timeScale = 0.8; }
          if (cup1) { cup1.reset().play(); cup1.timeScale = 0.8; }
        }, 2000);

        setTimeout(() => {
          const cup2 = coffeeActions.current?.["cupfee2"];
          const drink = cafeGamzaActions.current?.["drink"];
          const aitt = cafeGamzaActions.current?.["aitt"];

          coffeeActions.current?.["cupfee1"]?.stop();
          if (coffeeRef.current?.position) {
            coffeeRef.current.position.set(-38.6, 0, -88);
          }

          if (cup2) { cup2.reset().play(); cup2.timeScale = 0.8; }
          if (drink) { drink.reset().play(); drink.timeScale = 0.8; }
          if (aitt) { aitt.reset().play(); aitt.timeScale = 0.8; }
        }, 6000);

        setTimeout(() => {
          cafeActions.current?.["CoffeAnim2"]?.stop();
          const anim3 = cafeActions.current?.["CoffeAnim3"];
          const surprise = cafeActions.current?.["Coffe_Surprise"];
          if (anim3) { anim3.reset().play(); anim3.timeScale = 0.8; }
          if (surprise) { surprise.reset().play(); surprise.timeScale = 0.8; }

          setTimeout(() => {
            if (coffeeRef.current) coffeeRef.current.visible = false;
          }, 6000);
        }, 6800);

        setTimeout(() => {
          coffeeFinished = true
          restorePlayerAfterCafe();
        }, 12000);
      }
    }
  });

  useFrame((_, delta) => {
    cafeMixer.current?.update(delta);
    coffeeMixer.current?.update(delta);
    cafeGamzaMixer.current?.update(delta);
  });

  return (
    <group ref={group}>

<Cafe
  ref={cafeRef} // ✅ ref 넘기기
  position={[-38, 0, -87]}
  rotation={[0, THREE.MathUtils.degToRad(-50), 0]}
  // scale={[1.5, 1.5, 1.5]}
  scale={[0, 0, 0]}
  onLoaded={({ mixer, actions }) => {
    cafeMixer.current = mixer;
    cafeActions.current = actions;
  }}
/>

<Coffee
  ref={coffeeRef} // ✅ ref 넘기기
  position={[-38, 0, -87.5]}
  rotation={[0, THREE.MathUtils.degToRad(-50), 0]}
  scale={[0, 0, 0]}
  onLoaded={({ mixer, actions }) => {
    coffeeMixer.current = mixer;
    coffeeActions.current = actions;
  }}
/>

<CafeGamza
  ref={cafeGamzaRef} // ✅ ref 넘기기
  position={[-37.7, 0, -86.7]}
  rotation={[0, THREE.MathUtils.degToRad(-20), 0]}
  scale={[0, 0, 0]}
  onLoaded={({ mixer, actions }) => {
    cafeGamzaMixer.current = mixer;
    cafeGamzaActions.current = actions;
  }}
/>


      {showCloudEffect && cafeGamzaRef.current && (
        <CloudEffect
          position={[
            cafeGamzaRef.current.position.x,
            cafeGamzaRef.current.position.y + 2,
            cafeGamzaRef.current.position.z
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
