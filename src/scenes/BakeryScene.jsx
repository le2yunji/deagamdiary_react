import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import CloudEffect from '../components/CloudEffect';
import { Bakery } from '../components/Bakery';
import { BakeryGamza } from '../components/BakeryGamza';
import { BamGoguma } from '../components/BamGoguma';
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';

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

  const [triggered, setTriggered] = useState(false);
  const [ovenInteractionReady, setOvenInteractionReady] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);
  const light = new PointLight('white', 3, 200, 1);

  const BakerySpotMeshPosition = new Vector3(31, 0.005, -38);
  const bakeryTexture = useTexture('/assets/images/bakeryTrigger.png');

  useEffect(() => {
    if (bakeryTexture) {
      bakeryTexture.colorSpace = THREE.SRGBColorSpace;
      bakeryTexture.anisotropy = 16;
      bakeryTexture.flipY = false;
      bakeryTexture.needsUpdate = true;
    }
  }, [bakeryTexture]);


  const bgAudio = document.getElementById("bg-audio");
  const bakeryAudioRef = useRef();

  // ✅ 씬 복귀
  const restorePlayerAfterBakery = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(23, 0.3, -28);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    appearPlayer(playerRef, 1.2);
    setDisableMovement(false);
    enableMouseEvents();

    if (bgAudio) bgAudio.play(); //📢
    bakeryAudioRef.current?.stop();

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

      if (dist < 3.5) {
        setTriggered(true);
        disappearPlayer(playerRef);
        setDisableMovement(true);

        if (bgAudio) bgAudio.pause(); // 혹은 bgAudio.volume = 0;

        bakeryAudioRef.current?.play();

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
        }, 30000);

        setTimeout(() => {
          restoreMainCamera(setCameraActive, setUseSceneCamera);
          restorePlayerAfterBakery();
        }, 35000);

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

      <ManualAudioPlayer
        ref={bakeryAudioRef}
        url="/assets/audio/bakeryScene.mp3"
        volume={3}
        loop={false}
        position={[30, 2, -38]}
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
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial  
          map={bakeryTexture}
          transparent={true}
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true} // ✅ 핵심 옵션!
          />
      </mesh>
    </group>
  );
}
