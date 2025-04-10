// ChatGPT.jsx

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

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  enableMouseEvents,
  downCameraY,
  returnCameraY
} from '../utils/Common';

export default function ChatGPTScene({
  playerRef,
  emotionRef,
  setCameraTarget,
  disableMouse,
  enableMouse,
  setDisableMovement
}) {
  const group = useRef();

  const chatGptRef = useRef();
  const chatGptActions = useRef();
  const chatGptMixer = useRef();

  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const lightRef = useRef();
  const clock = new THREE.Clock();
  const ChatGPTSpotMeshPosition = new Vector3(91, 0.005, -17.5);  //(92.5, 0.005, -12.5);
  const { scene, camera } = useThree();
  const chatGptSpotRef = useRef();
  const bgAudio = document.getElementById("bg-audio");


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
      playerRef.current.scale.set(0.3, 0.3, 0.3);
      appearPlayer(playerRef, 1.2);
    }, 2000)

    setDisableMovement(false);

    // if (bgAudio) bgAudio.play(); //📢


    // if (cafeGamzaRef.current) {
    //   gsap.to(cafeGamzaRef.current.scale, {
    //     x: 0, y: 0, z: 0, duration: 1, ease: "bounce.inOut"
    //   });
    // }

    // if (emotionRef.current) emotionRef.current.visible = true;
    returnCameraY(camera);  
    gsap.to(camera, {
      duration: 1,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setCameraTarget(new Vector3(87.5, 0, 3));
    enableMouseEvents();
  }
  };

  let chatGptFinished = false;

  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x, 0, playerRef.current.position.z
      ).distanceTo(new Vector3(ChatGPTSpotMeshPosition.x, 0, ChatGPTSpotMeshPosition.z));

      if (dist < 1.5) {
        setTriggered(true);
        // if (emotionRef.current) emotionRef.current.visible = false;
        disappearPlayer(playerRef);
        setDisableMovement(true);
        // if (bgAudio) bgAudio.pause(); // 혹은 bgAudio.volume = 0;

        scene.remove(scene.getObjectByName('chatGptSpot'));
        scene.remove(chatGptSpotRef.current);
        if (chatGptSpotRef.current) chatGptSpotRef.current.visible = false;

        disableMouseEvents();
        // downCameraY(camera);
        gsap.to(camera, {
          duration: 1,
          zoom: 45,
          ease: "power3.in",
          onUpdate: () => camera.updateProjectionMatrix(),
        });
        gsap.to(camera.position, {
          duration: 0.5,
          y: 3,
          ease: "power3.in",
          onUpdate: () => camera.updateProjectionMatrix(),
        });

        if (lightRef.current) scene.add(lightRef.current);

        if (chatGptRef.current) {
          gsap.to( chatGptRef.current.scale,
            { x: 2, y: 2, z: 2, duration: 1, ease: "expo.inOut" }
          );
        }

        setTimeout(() => {
        const chatGPTAnim =  chatGptActions.current?.["Scene"]?.reset().play()
        if (chatGPTAnim) { chatGptActions.timeScale = 0.4; }
        }, 1000);

        // setTimeout(() => {
        //     if (chatGptRef.current) chatGptRef.current.visible = false;
        //   }, 6000);

        setTimeout(() => {
            chatGptFinished = true
          restorePlayerAfterChatGPT();
        }, 18000);
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
        position={[87, 0, -16]}
        rotation={[0, THREE.MathUtils.degToRad(60), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
            chatGptMixer.current = mixer;
            chatGptActions.current = actions;
        }}
    />
<AudioTimelinePlayer
  mixer={chatGptMixer.current}
  action={chatGptActions.current?.["Scene"]}
  position={[93.5, 2, -10.7]}
  timeline={[
    {
      time: 3.1,
      url: '/assets/audio/Keyboard.mp3',
      duration: 3,
      volume: 0.7,
      loop: false,
      refDistance: 4
    },
    // {
    //   time: 2.0,
    //   url: '/assets/audio/Keyboard.mp3',
    //   duration: 2.5,
    //   volume: 1.0,
    //   loop: false,
    //   refDistance: 6
    // },
    // {
    //   time: 4.8,
    //   url: '/assets/audio/Keyboard.mp3',
    //   duration: 1.0,
    //   volume: 0.6,
    //   loop: false,
    //   refDistance: 5
    // }
  ]}
/>



      {showCloudEffect && chatGptRef.current && (
        <CloudEffect
            position={[
            chatGptRef.current.position.x,
            chatGptRef.current.position.y + 2,
            chatGptRef.current.position.z
            ]}
        />
      )}

      <mesh
        name="chatGptSpot"
        ref={chatGptSpotRef}
        position={ChatGPTSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="royalblue" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
