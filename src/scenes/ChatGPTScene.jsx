// ChatGPTScnee.jsx

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PositionalAudio } from '@react-three/drei'; 
import { ChatGPT } from '../components/ChatGPT';
import { AudioPlayer } from '../utils/AudioPlayer';
import { AudioTimelinePlayer } from '../utils/AudioTimelinePlayer';
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';

import {
  disappearPlayer,
  appearPlayer,
  // disableMouseEvents,
  // enableMouseEvents,
  // downCameraY,
  // returnCameraY
} from '../utils/Common';

export default function ChatGPTScene({
  playerRef,
  setCameraTarget,
  setDisableMovement,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,       // 💡 추가
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose
}) {
  const group = useRef();
  const gamzaRef = useRef();

  const chatGptRef = useRef();
  const chatGptActions = useRef();
  const chatGptMixer = useRef();

  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  // const lightRef = useRef();
  const clock = new THREE.Clock();
  const { scene, camera } = useThree();
  const chatGptSpotRef = useRef();
  const bgAudio = document.getElementById("bg-audio");
  const gptAudioRef = useRef();

  const bbongAudioRef = useRef();

  const ChatGPTSpotMeshPosition = new Vector3(91, 0.005, -17.5);  //(92.5, 0.005, -12.5);
  const gptTexture = useTexture('/assets/images/gptTrigger.png');

  useEffect(() => {
    if (gptTexture) {
      gptTexture.colorSpace = THREE.SRGBColorSpace;
      gptTexture.anisotropy = 16;
      gptTexture.flipY = false;
      gptTexture.needsUpdate = true;
    }
  }, [gptTexture]);


const gptZzal = useRef()

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/assets/images/gpt_zzal.png', (texture) => {
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
      mesh.position.set(105, 0.05, -6.5);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(0);
      mesh.scale.set(5, 7, 1);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      gptZzal.current = mesh;
    });
  }, []);





  useEffect(() => {
    if (chatGptRef.current) {
        chatGptRef.current.traverse((child) => {
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

  // 씬 완료 
  const restorePlayerAfterChatGPT = () => {
    if (chatGptFinished) {
    // ✅ 감자만 scale 줄이기
    const gamzaInChat = chatGptRef.current?.getObjectByName("Gamza");
    triggerCloudEffect();

    if (gamzaInChat) {
      gsap.to(gamzaInChat.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }

    setTimeout(() => {
      playerRef.current.visible = true;
      playerRef.current.position.set(90.8, 0.3, -6.8);
      console.log(Object.keys(playerRef.current?.animations || {}));

      const bbyong = playerRef.current?.animations?.["Bbyong"];
      if (bbyong) {
        bbyong.reset().setLoop(THREE.LoopOnce, 1);
        bbyong.clampWhenFinished = true;
        bbyong.play();
      }
      
      playerRef.current.scale.set(0.3, 0.3, 0.3);
      appearPlayer(playerRef, 1.2);
      restoreMainCamera(setCameraActive, setUseSceneCamera);
    }, 1000)

    setDisableMovement(false);

    gptAudioRef.current?.stop();
    if (bgAudio) bgAudio.play(); //📢

    setCameraTarget(new Vector3(87.5, 0, 3));
    // enableMouseEvents();
  }
  };

  let chatGptFinished = false;

  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x, 0, playerRef.current.position.z
      ).distanceTo(new Vector3(ChatGPTSpotMeshPosition.x, 0, ChatGPTSpotMeshPosition.z));

      const gptScript = document.getElementById('gpt-script')
      gptScript.style.display = 'none'
  
      if (dist < 25 && !triggered) {
        gptScript.style.display = 'block'
      }

      if (dist < 3) {
        gptScript.style.display = 'none'
        bbongAudioRef.current?.play()
        
        setTriggered(true);
        // if (emotionRef.current) emotionRef.current.visible = false;
        disappearPlayer(playerRef);
        setDisableMovement(true);
        if (bgAudio) bgAudio.pause(); // 혹은 bgAudio.volume = 0;

        setTimeout(() => {
          gptAudioRef.current?.play();
        }, 1000)

        scene.remove(scene.getObjectByName('chatGptSpot'));
        scene.remove(chatGptSpotRef.current);
        if (chatGptSpotRef.current) chatGptSpotRef.current.visible = false;

        // disableMouseEvents();

       // 💡 카메라 전환 (씬 전용 카메라 활성화)
       activateSceneCamera(setCameraActive, setUseSceneCamera);

       setInitialCameraPose({
         position: [93, 12, 16],
         lookAt: [89, 2, -14],
         zoom: 40
       });

       // 💡 카메라 이동 + 시선 애니메이션
       animateCamera({
         position: { x: 93, y: 12, z: 18 },
         lookAt: [89, 2, -14],
         zoom: 50,
         duration: 1.5
       });

        // if (lightRef.current) scene.add(lightRef.current);

        if (chatGptRef.current) {
          gsap.to( chatGptRef.current.scale,
            { x: 2, y: 2, z: 2, duration: 1, ease: "expo.inOut" }
          );
        }

        setTimeout(() => {
        const chatGPTAnim = chatGptActions.current?.["Scene"]
        chatGPTAnim.timeScale = 0.63
        chatGPTAnim?.reset().play()
        }, 1000);

        // setTimeout(() => {
        //     if (chatGptRef.current) chatGptRef.current.visible = false;
        //   }, 6000);

        setTimeout(() => {
          chatGptFinished = true

          if (gamzaRef.current) {
            gsap.to( gamzaRef.current.scale,
              { x: 0, y: 0, z: 0, duration: 0.5, ease: "expo.inOut" }
            );
          }

          restorePlayerAfterChatGPT();
        }, 23000);
      }
    }
  });

  useFrame((_, delta) => {
    chatGptMixer.current?.update(delta);
  });

  return (
    <group ref={group}>
    <ChatGPT
        ref={ chatGptRef } // ✅ ref 넘기기
        onGamzaRef={(ref) => { gamzaRef.current = ref }}
        position={[87, 0, -16]}
        rotation={[0, THREE.MathUtils.degToRad(60), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
            chatGptMixer.current = mixer;
            chatGptActions.current = actions;
        }}
    />
     <ManualAudioPlayer
        ref={gptAudioRef}
        url="/assets/audio/gptScene.mp3"
        volume={3}
        loop={false}
        position={[87, 2, -16]}
      />

    <ManualAudioPlayer
        ref={bbongAudioRef}
        url="/assets/audio/bbong.mp3"
        volume={3}
        loop={false}
        position={[87, 2, -16]}
      />



      {showCloudEffect && gamzaRef.current && (
        <CloudEffect
            position={[
              92,
              gamzaRef.current.position.y + 2,
              -9.5
            ]}
        />
      )}

      <mesh
        name="chatGptSpot"
        ref={chatGptSpotRef}
        position={ChatGPTSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial 
          map={gptTexture}
          transparent={true} 
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true} // ✅ 핵심 옵션!
          />
      </mesh>

 


    </group>
  );
}
