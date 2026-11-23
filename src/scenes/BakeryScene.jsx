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
import { getAssetUrl } from '../utils/assetUrl';

import {
  disappearPlayer,
  appearPlayer,
  // disableMouseEvents,
  // disablePlayerControlEvents,
  // enableMouseEvents,
  // downCameraY,
  // returnCameraY,
  // showArrow,
  // hideAllArrows,
  // createArrows,
} from '../utils/Common';

const BAKERY_TRIGGER_URL = getAssetUrl('/assets/images/bakeryTrigger.png');
const BAKERY_ZZAL_URL = getAssetUrl('/assets/images/bakery_zzal.png');
const BAKERY_ZZAL_SECOND_URL = getAssetUrl('/assets/images/bakery_zzal2.png');
const BAKERY_AUDIO_URL = getAssetUrl('/assets/audio/bakeryScene.mp3');
const BAKERY_SORRY_AUDIO_URL = getAssetUrl('/assets/audio/bakeryScene_sorry.mp3');
const GOGUMI_AUDIO_URL = getAssetUrl('/assets/audio/gogumi.mp3');

/** 베이커리 아르바이트 장면의 모델·카메라·오디오 진행을 제어한다. */
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
  const bakeryTexture = useTexture(BAKERY_TRIGGER_URL);
  const bakeryZzal = useRef();
  const bakeryZzal2 = useRef();
  const bakeryZzal3 = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(BAKERY_ZZAL_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
  
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });
  
      const geometry = new THREE.PlaneGeometry(1.3, 1.2);
      const mesh = new THREE.Mesh(geometry, material);
      const mesh2 = new THREE.Mesh(geometry, material);


      mesh.position.set(10, 0.05, -43);
      mesh2.position.set(43, 0.05, -32.5);

      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(30);

      mesh2.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh2.rotation.z = THREE.MathUtils.degToRad(-30);

      mesh.scale.set(5, 8, 5);
      mesh2.scale.set(4, 8, 5);

      mesh.visible = true;
      mesh2.visible = true;

      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh2.receiveShadow = true;
      mesh2.castShadow = true;

      scene.add(mesh);
      scene.add(mesh2);

      bakeryZzal.current = mesh;
      bakeryZzal2.current = mesh2;
    });
  }, []);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(BAKERY_ZZAL_SECOND_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });
  
      const geometry = new THREE.PlaneGeometry(1.3, 1.2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(43, 0.05, -13.5);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(-30);
      mesh.scale.set(8, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      bakeryZzal3.current = mesh;
    });
  }, []);


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
  const bakerySorryAudioRef = useRef();
  const gogumiAudioRef = useRef();


  // ✅ 씬 복귀
  const restorePlayerAfterBakery = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(23, 0.3, -28);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    appearPlayer(playerRef, 1.2);

    setDisableMovement(false);
    // enableMouseEvents();


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
      const bakeryScript = document.getElementById('bakery-script')
      bakeryScript.style.display = 'none'
  
      if (dist < 15 && !triggered) {
        bakeryScript.style.display = 'block'
      }
      
      if (dist < 3.5) {
        bakeryScript.style.display = 'none'

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
            zoom: 40,
            near: -100,  // ✅ 추가
            far: 50,    // ✅ 추가
          });

          animateCamera({
            position: { x: 30, y: 6, z: -30},
            lookAt: [30, 2, -37],
            zoom: 45,
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

        gogumiAudioRef.current.play()
        setTimeout(() => {
          bakerySorryAudioRef.current.play()
        }, 26000)

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
  
          animateCamera({
            position: { x: 30, y: 6, z: -33},
            lookAt: [30, 2, -37],
            zoom: 40,
            duration: 3,
            near: -100,
            far: 50,
          });

        }, 10000)

        setTimeout(() => {
  
          animateCamera({
            position: { x: 30, y: 3.2, z: -35},
            lookAt: [30, 2, -37],
            zoom: 50,
            duration: 2,
            near: -100,
            far: 50,
          });

        }, 15000)

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
        url={BAKERY_AUDIO_URL}
        volume={3}
        loop={false}
        position={[30, 2, -38]}
      />
      <ManualAudioPlayer
        ref={bakerySorryAudioRef}
        url={BAKERY_SORRY_AUDIO_URL}
        volume={3}
        loop={false}
        position={[30, 2, -38]}
      />
      <ManualAudioPlayer
        ref={gogumiAudioRef}
        url={GOGUMI_AUDIO_URL}
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
