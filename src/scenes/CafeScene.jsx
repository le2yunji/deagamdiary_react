import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Cafe } from '../components/Cafe';
import { CafeGamza } from '../components/CafeGamza';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';
import { useSpotTexture } from '../hooks/useSceneTexture';
import { getAssetUrl } from '../utils/assetUrl';

import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
} from 'three';

import {
  disappearPlayer,
  appearPlayer,
} from '../utils/Common';

const CAFE_TRIGGER_URL = getAssetUrl('/assets/images/cafeTrigger.png');
const CAFE_ZZAL_URL = getAssetUrl('/assets/images/cafe_zzal.png');
const COFFEE_IMAGE_URLS = [
  getAssetUrl('/assets/images/coffee1.webp'),
  getAssetUrl('/assets/images/coffee2.webp'),
  getAssetUrl('/assets/images/coffee3.webp'),
  getAssetUrl('/assets/images/coffee4.webp'),
];
const CAFE_AUDIO_URL = getAssetUrl('/assets/audio/cafeScene.mp3');

/** 카페 주문 장면의 모델·프레임 이미지·카메라·오디오 진행을 제어한다. */
export default function CafeScene({
  playerRef,
  setCameraTarget,
  setDisableMovement,
  setCameraActive,
  setUseSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose
}) {
  const group = useRef();

  const cafeRef = useRef();
  const cafeActions = useRef();
  const cafeMixer = useRef();

  const cafeGamzaRef = useRef();
  const cafeGamzaActions = useRef();
  const cafeGamzaMixer = useRef();

  const [triggered, setTriggered] = useState(false);
  const [cloudPosition, setCloudPosition] = useState(null);

  const lightRef = useRef();
  const { scene } = useThree();
  const cafeSpotRef = useRef();
  const coffeeRef = useRef([]);

  const bgAudio = document.getElementById("bg-audio");
  const cafeAudioRef = useRef();


  const CafeSpotMeshPosition = new Vector3(-37.5, 0.005, -89);
  const cafeTexture = useSpotTexture(CAFE_TRIGGER_URL);

  const cafeZzal = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(CAFE_ZZAL_URL, (texture) => {
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
      mesh.position.set(-22.5, 0.05, -62.5);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(-40);
      mesh.scale.set(8, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      cafeZzal.current = mesh;
    });
  }, [scene]);






  // 커피 그림
  useEffect(() => {
    const geometry = new PlaneGeometry(4, 6);
    const loader = new TextureLoader();
    const meshes = COFFEE_IMAGE_URLS.map((path) => {
      const mat = new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 });
      const mesh = new Mesh(geometry, mat);
      mesh.rotation.y = THREE.MathUtils.degToRad(20);
      mesh.rotation.z = THREE.MathUtils.degToRad(-10);
      mesh.position.set(-34, 5, -82);
      mesh.visible = false;
      mat.map = loader.load(path, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.color.set(0xffffff);
        mat.opacity = 1;
        mat.needsUpdate = true;
      });
      scene.add(mesh);
      return mesh;
    });
    coffeeRef.current = meshes;

    return () => {
      coffeeRef.current = [];
      for (const mesh of meshes) {
        scene.remove(mesh);
        mesh.material.map.dispose();
        mesh.material.dispose();
      }
      geometry.dispose();
    };
  }, [scene]);

  /** 커피 프레임을 순서대로 보여 준 뒤 모두 숨긴다. */
  const animateDrinkCoffee = () => {
    const coffee = coffeeRef.current;
    if (coffee.length === 0) return;

    coffee.forEach((c) => (c.visible = false)); // 초기값 전부 숨김

    coffee.forEach((_, index) => {
      setTimeout(() => {
        // 현재 프레임만 visible = true
        coffee.forEach((c, i) => (c.visible = i === index));
      }, index * 300);
    });

    // 마지막 프레임 이후 전부 숨김
    setTimeout(() => {
      coffee.forEach((c) => (c.visible = false));
    }, coffee.length * 300);
  };


  /** 효과가 시작되는 순간의 위치를 저장해 렌더링에서 모델 참조를 읽지 않도록 한다. */
  const triggerCloudEffect = () => {
    const position = cafeGamzaRef.current?.position;
    if (!position) return;
    const { x, y, z } = position;
    setCloudPosition([x + 1.5, y + 2, z]);
    setTimeout(() => setCloudPosition(null), 1500);
  };


  // ✅ 씬 복귀  
  const restorePlayerAfterCafe = () => {
    if (coffeeFinished) {
    setTriggered(true)

    playerRef.current.visible = true;
    playerRef.current.position.set(-38.7, 0.3, -86.7);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);

    appearPlayer(playerRef, 1.2);

    setCameraTarget(new Vector3(-30, 0, -69.5));
    cafeAudioRef.current?.stop();
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

      const cafeScript = document.getElementById('cafe-script')
      cafeScript.style.display = 'none'

      if (dist < 25 && !triggered) {
        cafeScript.style.display = 'block'
      }

      // 카페 스팟 매쉬 도달시
      if (dist < 3) {
        cafeScript.style.display = 'none'

        if (bgAudio) bgAudio.pause(); //📢
        cafeAudioRef.current?.play();

        triggerCloudEffect();
        disappearPlayer(playerRef);

        setTriggered(true);

        scene.remove(scene.getObjectByName('cafeSpot'));
        scene.remove(cafeSpotRef.current);
        if (cafeSpotRef.current) cafeSpotRef.current.visible = false;

        setDisableMovement(true);

  
        if (lightRef.current) scene.add(lightRef.current);

        // 카페 등장 및 애니메이션 재생
        if (cafeRef.current) {
       
          gsap.to(
            cafeRef.current.scale,
            { x: 1.8, y: 1.8, z: 1.8, duration: 0.5, ease: "expo.inOut" }
          );

          gsap.to(
            cafeGamzaRef.current.scale,
            { x: 1.8, y: 1.8, z: 1.8, duration: 0.5, ease: "expo.inOut" }
          );

          const cafeAnim = cafeActions.current?.["Scene"];
          if (cafeAnim) { cafeAnim.reset().play(); cafeAnim.timeScale = 0.7; }

          const cafeGamzaAnim = cafeGamzaActions.current?.["Scene"];
          if (cafeGamzaAnim) { cafeGamzaAnim.reset().play(); cafeGamzaAnim.timeScale = 0.7; }

          // 커피 2D 애니메이션
          setTimeout(() => {
            animateDrinkCoffee()
          }, 15000)
        }

        setTimeout(() => {
          // 💡 카메라 전환 (씬 전용 카메라 활성화)
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [-30, 12, -75],
            lookAt: [-38, 5, -86],
            zoom: 40
          });

          // 💡 카메라 이동 + 시선 애니메이션
          animateCamera({
            position: { x: -34, y: 10, z: -73 },
            lookAt: [-38, 5, -86],
            zoom: 50,
            duration: 1.5
          });
        }, 200)

        setTimeout(() => {
          // 💡 카메라 이동 + 시선 애니메이션
          animateCamera({
            position: { x: -34, y: 8, z: -73 },
            lookAt: [-43, 5, -81],
            zoom: 63,
            duration: 2
          });
      }, 17000)

  
        setTimeout(() => {
          coffeeFinished = true
          triggerCloudEffect(); 
          // 카페 감자 사라지기
          gsap.to(
            cafeGamzaRef.current.scale,
            { x: 0, y: 0, z: 0, duration: 0.5, ease: "expo.inOut" }
          );

          setTimeout(()=>{
            if (!hasRestoredRef.current) {
              restoreMainCamera(setCameraActive, setUseSceneCamera);
              restorePlayerAfterCafe();
              hasRestoredRef.current = true;
            }
          }, 3000)
        }, 20000);
        
      }
    }
  });

  useFrame((_, delta) => {
    cafeMixer.current?.update(delta);
    cafeGamzaMixer.current?.update(delta);
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

    <CafeGamza 
      ref={cafeGamzaRef} // ✅ ref 넘기기
      position={[-39, 0, -87]}
      rotation={[0, THREE.MathUtils.degToRad(-50), 0]}
      // scale={[1.5, 1.5, 1.5]}
      scale={[0, 0, 0]}
      onLoaded={({ mixer, actions }) => {
        cafeGamzaMixer.current = mixer;
        cafeGamzaActions.current = actions;
      }}
    />

      {cloudPosition && <CloudEffect position={cloudPosition} />}

      <mesh
        name="cafeSpot"
        ref={cafeSpotRef}
        position={CafeSpotMeshPosition}
        rotation={[ -Math.PI/2, 0,  Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial   
        map={cafeTexture}
        transparent={true} 
        alphaTest={0.5}
        depthWrite={true}
        premultipliedAlpha={true}
        />
      </mesh>

      <ManualAudioPlayer
        ref={cafeAudioRef}
        url={CAFE_AUDIO_URL}
        volume={2}
        loop={false}
        position={[-38, 2, -86]}
      />



{/* 
      <mesh
        name="cafeGuideSpot"
        ref={cafeSpotRef}
        position={CafeSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh> */}


    </group>
  );
}
