// src/scenes/NomoneyScene.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { NomoneyGamza } from '../components/NomoneyGamza';
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';
import { getAssetUrl } from '../utils/assetUrl';

import {
  disappearPlayer,
  appearPlayer,
} from '../utils/Common';

const NOMONEY_TRIGGER_URL = getAssetUrl('/assets/images/noMoneyTrigger.png');
const NOMONEY_ZZAL_URL = getAssetUrl('/assets/images/nomoney_zzal.png');
const NOMONEY_TEXT_URL = getAssetUrl('/assets/images/nomoney.webp');
const NOMONEY_TALK_URL = getAssetUrl('/assets/images/nomoney_talk.webp');
const NOMONEY_AUDIO_URL = getAssetUrl('/assets/audio/nomoneyScene.mp3');
const NOMONEY_MONEY_AUDIO_URL = getAssetUrl('/assets/audio/nomoney_money.mp3');
const BBONG_AUDIO_URL = getAssetUrl('/assets/audio/bbong.mp3');

/** 잔고 부족 장면의 모델·카메라·대화 이미지·오디오 진행을 제어한다. */
export default function NomoneyScene({
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

  const nomoneyGamzaRef = useRef()
  const nomoneyGamzaActions = useRef();
  const nomoneyGamzaMixer = useRef();

  const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const NomoneySpotMeshPosition = new Vector3(-92, 0.005, -15); // -10.5  
  const { scene } = useThree();
  const nomoneySpotRef = useRef();
  const bgAudio = document.getElementById("bg-audio");
  const nomoneyAudioRef = useRef();

  const nomoneyTalkAudioRef = useRef();
  const bbongAudioRef= useRef();

  const nomoneyTexture = useTexture(NOMONEY_TRIGGER_URL);

  useEffect(() => {
    if (nomoneyTexture) {
      nomoneyTexture.colorSpace = THREE.SRGBColorSpace;
      nomoneyTexture.anisotropy = 16;
      nomoneyTexture.flipY = false;
      nomoneyTexture.needsUpdate = true;
    }
  }, [nomoneyTexture]);
  
const nomneyZzal = useRef();
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(NOMONEY_ZZAL_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });
  
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-60, 0.05, 1);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(-10);
      mesh.scale.set(8, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      nomneyZzal.current = mesh;
    });
  }, []);


  // 텅장 텍스트 💬
  const noMoneyText = useRef();
  useEffect(() => {
    const texture = new THREE.TextureLoader().load(NOMONEY_TEXT_URL);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    const geometry = new THREE.PlaneGeometry(1.2, 0.7);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-92, 2.2, -12.5); 
    mesh.rotation.y = THREE.MathUtils.degToRad(5);
    mesh.scale.set(1, 1, 1); // 아주 작게 시작
    mesh.visible = false;
    scene.add(mesh);
    noMoneyText.current = mesh;
  }, [scene]);

 // 💭
  const nomoneyTalk = useRef();
  useEffect(() => {
    const texture = new THREE.TextureLoader().load(NOMONEY_TALK_URL);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    const geometry = new THREE.PlaneGeometry(7, 7);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-87, 6, -14.5);
    mesh.rotation.y = THREE.MathUtils.degToRad(10);
    mesh.visible = false;
    scene.add(mesh);
    nomoneyTalk.current = mesh;
  }, [scene]);

  const showGIFOverlay = () => {
    const overlay = document.getElementById('gifOverlay2');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => (overlay.style.display = 'none'), 3000);
    }
  };

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1000);
  };

  // ✅ 노머니 이벤트 완료 후 감자 복귀
  const restorePlayerAfterNomoney = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(-92, 0.3, -13);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);
    
    triggerCloudEffect();
    appearPlayer(playerRef, 1.2); // 부드럽게 다시 나타남
    nomoneyAudioRef.current?.stop();
    if (bgAudio) bgAudio.volume = 0.2;
    nomoneyTalkAudioRef.current?.stop();

    
    setTimeout(() => {
    // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    setCameraTarget(new Vector3(-83.4, 0, -9.5));  
  
    }, 1000)
  };


  // ✅ 씬 시작
  // 🎮 매 프레임마다 실행
  useFrame(() => {
    if (!triggered && playerRef.current) {
      // 감자와 스팟 간 거리 계산
      const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
      const spotPosXZ = new Vector3(NomoneySpotMeshPosition.x, 0, NomoneySpotMeshPosition.z);
      const dist = playerPosXZ.distanceTo(spotPosXZ);

      const nomoneyScript = document.getElementById('nomoney-script')
      nomoneyScript.style.display = 'none'

      if (dist < 20 && !triggered) {
        nomoneyScript.style.display = 'block'
      }
   
      // 일정 거리 이내에 도달하면 이벤트 트리거
      if (dist < 3) {
        nomoneyScript.style.display = 'none'
        bbongAudioRef.current?.play()
        setTriggered(true);
        setDisableMovement(true);
        disappearPlayer(playerRef); // 감자 작아지며 사라짐
        scene.remove(scene.getObjectByName('nomoneySpot'));
        scene.remove(nomoneySpotRef.current); // ✅ 정확하게 제거됨
        nomoneySpotRef.current.visible = false


        triggerCloudEffect();


        if (bgAudio) bgAudio.volume = 0.1;

        setTimeout(() => {
          nomoneyAudioRef.current?.play();
        }, 7000)

        // 노머니감자 등장
        gsap.to(nomoneyGamzaRef.current.scale, {
          x: 1.7,
          y: 1.7,
          z: 1.7,
          duration: 0.5,
          ease: "expo.inOut"
        });

        setTimeout(() => {
          // 카메라 설정

          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [-90, 12, -1.5],
            lookAt: [-92, 3, -11],
            zoom: 40
          });

          // 💡 카메라 이동 + 시선 애니메이션
          animateCamera({
            position: { x: -90, y: 8, z: -2},
            lookAt: [-92, 3, -11],
            zoom: 70,
            duration: 1.5
          });
        }, 200)
       
  
          if (nomoneyGamzaActions.current) {
            const noMoneyGamzaAction = nomoneyGamzaActions.current["Scene"];
            noMoneyGamzaAction.timeScale = 0.4;
            noMoneyGamzaAction.reset().play();
          }


        // 말풍선 & gif 표시
        setTimeout(() => {
          nomoneyTalkAudioRef.current?.play()
          noMoneyText.current.visible = true;
          showGIFOverlay();
        }, 5500)

        // 텍스트 확대 & 이동
        setTimeout(() => {
          nomoneyTalk.current.visible = true;
          if (noMoneyText.current) {
            gsap.to(noMoneyText.current.scale, {
              duration: 0.5,
              x: 7,
              y: 7,
              z: 7,
              ease:'expo.inOut',
            });
            gsap.to(noMoneyText.current.position, {
              duration: 0.5,
              x: -98,
              y: 5,
              ease: 'none',
            });
            gsap.to(noMoneyText.current.rotation, {
              duration: 0.5,
              y: THREE.MathUtils.degToRad(10),
            });
          }
        }, 6000);

        setTimeout(() => {
          noMoneyText.current.visible = false;
          nomoneyTalk.current.visible = false;
          gsap.to(nomoneyGamzaRef.current.position,{
            y: 2,
            duration: 0.3,
            ease: "expo.inOut"
          })
          triggerCloudEffect();

          gsap.to(nomoneyGamzaRef.current.scale,{
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "expo.inOut"
          })
          restoreMainCamera(setCameraActive, setUseSceneCamera);

        }, 11000);

        setTimeout(() => {
          restorePlayerAfterNomoney();

        }, 13000);

      } 
    }
  });

    // 믹서 업데이트도 각각 따로
    useFrame((_, delta) => {
      nomoneyGamzaMixer.current?.update(delta);
    });

  return (
    <group ref={group}>

   {showCloudEffect && playerRef.current && (
      <CloudEffect 
        position={[
          nomoneyGamzaRef.current.position.x , 
          nomoneyGamzaRef.current.position.y + 3,
          nomoneyGamzaRef.current.position.z 
        ]}
      />
    )}
     <ManualAudioPlayer
        ref={nomoneyAudioRef}
        url={NOMONEY_AUDIO_URL}
        volume={1.3}
        loop={false}
        position={[-92, 2, -15]}
      />
      <ManualAudioPlayer
        ref={nomoneyTalkAudioRef}
        url={NOMONEY_MONEY_AUDIO_URL}
        volume={1.3}
        loop={false}
        position={[-92, 2, -15]}
      />
     <ManualAudioPlayer
        ref={bbongAudioRef}
        url={BBONG_AUDIO_URL}
        volume={3}
        loop={false}
        position={[-92, 2, -15]}
      />
    <NomoneyGamza 
      ref={nomoneyGamzaRef}
      position={[-92, 0, -15]}  
      rotation={[0, THREE.MathUtils.degToRad(-70), 0]}
      scale={[0, 0, 0]}
      onLoaded={({ mixer, actions }) => {
        nomoneyGamzaMixer.current = mixer;
        nomoneyGamzaActions.current = actions; 
      }}
    />

      {/* ✅ 바닥 클릭 지점 */}
      <mesh
        name="nomoneySpot"
        ref={nomoneySpotRef} // ✅ ref 연결
        position={NomoneySpotMeshPosition}
        rotation={[ -Math.PI/2, 0, -Math.PI/1.5]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
        map={nomoneyTexture}
        transparent={true}
        alphaTest={0.5}
        depthWrite={true}
        premultipliedAlpha={true}
      />
      </mesh>
    </group>
  );
}
