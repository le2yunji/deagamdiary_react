// EscalatorScene.jsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree,  } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import CloudEffect from '../components/CloudEffect';
import { Escalator } from "../components/Escalator";
import { EscalatorGamza } from '../components/EscalatorGamza';
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';



import {
  disappearPlayer,
//   appearPlayer,
//   disableMouseEvents,
  disablePlayerControlEvents,
//   enableMouseEvents,
//   downCameraY,
//   returnCameraY,
//   showArrow,
//   hideAllArrows,
//   createArrows,
} from '../utils/Common';

export default function EscalatorScene({
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
  const gamzaRef = useRef();
  const { scene, camera } = useThree();
  const clock = new THREE.Clock();

  const escalatorRef = useRef();
  const escalatorMixer = useRef();
  const escalatorActions = useRef();

  const escalatorGamzaRef = useRef();
  const escalatorGamzaMixer = useRef();
  const escalatorGamzaActions = useRef();

  const escalatorSpotRef = useRef();

  const [triggered, setTriggered] = useState(false);
  const [ovenInteractionReady, setOvenInteractionReady] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);
  const light = new PointLight('white', 3, 200, 1);

  const EscalatorSpotMeshPosition = new Vector3(43.5, 0.005, 118);
  const escalatorTexture = useTexture('/assets/images/houseTrigger.png');

  useEffect(() => {
    if (escalatorTexture) {
      escalatorTexture.colorSpace = THREE.SRGBColorSpace;
      escalatorTexture.anisotropy = 16;
      escalatorTexture.flipY = false;
      escalatorTexture.needsUpdate = true;
    }
  }, [escalatorTexture]);


  const bgAudio = document.getElementById("bg-audio");
  const escalatorAudioRef = useRef();

//   const wallTexture = useTexture('/assets/images/innerWall.png');

//   useEffect(() => {
//     wallTexture.wrapS = THREE.RepeatWrapping;
//     wallTexture.wrapT = THREE.RepeatWrapping;
//     wallTexture.repeat.set(1, 1); // 필요 시 조정
//     wallTexture.flipY = false;
//     wallTexture.colorSpace = THREE.SRGBColorSpace;
//     wallTexture.needsUpdate = true;
//   }, [wallTexture]);
  
//   const innerWallMaterial = useMemo(() => {
//     return new THREE.MeshStandardMaterial({
//       map: wallTexture,
//       side: THREE.FrontSide,
//       transparent: true,
//     });
//   }, [wallTexture]);
  
  
//   // ✅ 씬 복귀
//   const restorePlayerAfterBakery = () => {
//     playerRef.current.visible = true;
//     playerRef.current.position.set(23, 0.3, -28);
//     playerRef.current.scale.set(0.3, 0.3, 0.3);
//     appearPlayer(playerRef, 1.2);
//     setDisableMovement(false);
//     enableMouseEvents();

//     if (bgAudio) bgAudio.play(); //📢
//     escalatorAudioRef.current?.stop();

//     setCameraTarget(new Vector3(20, 0, -23.5));
//   };        

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 500);
  };

  // ✅ 플레이어 도달 → 초기 애니메이션 재생
  useFrame(() => {
    const delta = clock.getDelta();
    escalatorMixer.current?.update(delta);
    escalatorGamzaMixer.current?.update(delta);


    if (!triggered && playerRef.current) {
      const dist = playerRef.current.position.clone().setY(0).distanceTo(EscalatorSpotMeshPosition);

      if (dist < 3.5) {
        setTriggered(true);
        disappearPlayer(playerRef);
        setDisableMovement(true);
        scene.remove(scene.getObjectByName('escalatorSpot'));
        escalatorSpotRef.current.visible = false;

        if (bgAudio) bgAudio.pause(); // 혹은 bgAudio.volume = 0;

        escalatorAudioRef.current?.play();

            setTimeout(() => {
                triggerCloudEffect()
                // 모델 등장
                gsap.to(escalatorGamzaRef.current.scale, {
                    x: 8,
                    y: 8,
                    z: 8,
                    duration: 0.5,
                    ease: "expo.inOut"
                });
        
            }, 2000)

            setTimeout(() => {
                const escalatorAnim = escalatorActions.current?.["Scene"]
                escalatorAnim.reset().play();
                escalatorAnim.timeScale = 0.3;
        
                const escalatorGamzaAnim = escalatorGamzaActions.current?.["Scene"]
                escalatorGamzaAnim.reset().play();
                escalatorGamzaAnim.timeScale = 0.3;
            }, 2500)

        setTimeout(() => {
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [28, 10, 150],
            lookAt: [27, 2, 140],
            zoom: 30,
            near: -100,  // ✅ 추가
            far: 50,    // ✅ 추가
          });

          setTimeout(() => {
            animateCamera({
                position: { x: 28, y: 12, z: 150},
                lookAt: [27, 2, 140],
                zoom: 22,
                duration: 3,
                near: -100,
                far: 50,
              });
          }, 1000)
    
        }, 1000)


     


        // setTimeout(() => {
        //   addLight()
        // }, 800)

     
    
        // setTimeout(() => {
        //   triggerCloudEffect()
        //   gsap.to(escalatorGamzaRef.current.scale, {
        //     x: 0,
        //     y: 0,
        //     z: 0,
        //     duration: 0.5,
        //     ease: "power3.inOut",
        //   });
        // }, 30000);

        setTimeout(() => {
        //   restoreMainCamera(setCameraActive, setUseSceneCamera);
        //   restorePlayerAfterBakery();
        }, 35000);

      }
    }
  });





  return (
    <group ref={group}>
      <Escalator
        ref={escalatorRef}
        // onGamzaRef={(ref) => { gamzaRef.current = ref }}
        position={[24, 6.2, 143]}
        rotation={[0, THREE.MathUtils.degToRad(-45), 0]}
        scale={[8, 8, 8]}
        onLoaded={({ actions, mixer }) => {
          escalatorActions.current = actions;
          escalatorMixer.current = mixer;
        }}  
        // innerWallMaterial={innerWallMaterial} // ✅ 전달
      />

        <EscalatorGamza
            ref={escalatorGamzaRef}
            // onGamzaRef={(ref) => { gamzaRef.current = ref }}
            position={[24, 6.2, 143]}
            rotation={[0, THREE.MathUtils.degToRad(-45), 0]}
            scale={[0, 0, 0]}
            onLoaded={({ actions, mixer }) => {
            escalatorGamzaActions.current = actions;
            escalatorGamzaMixer.current = mixer;
            }}  
            // innerWallMaterial={innerWallMaterial} // ✅ 전달
        />

      <ManualAudioPlayer
        ref={escalatorAudioRef}
        url="/assets/audio/escalatorScene.mp3"
        volume={3}
        loop={false}
        position={[30, 2, -38]}
      />


      {showCloudEffect && (
        <CloudEffect
          position={[ 27, 8, 138]}
        />
      )}


      <mesh
        name="escalatorSpot"
        ref={escalatorSpotRef}
        position={EscalatorSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial  
          map={escalatorTexture}
          transparent={true}
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true} // ✅ 핵심 옵션!
          />
      </mesh>
    </group>
  );
}
