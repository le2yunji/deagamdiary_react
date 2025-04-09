// src/SceneContent.jsx
import { StatsGl } from '@react-three/drei';
import Ground from './components/Ground';
import PlayerController from './components/PlayerController';
import { useState, useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IsEnteredAtom } from './stores';
import { Loader } from './components/Loader';
import MetroScene from './scenes/MetroScene';
import CafeScene from './scenes/CafeScene';
import ClassroomScene from './scenes/ClassroomScene';
import AlbaScene from './scenes/AlbaScene';
import BakeryScene from './scenes/BakeryScene';
import MailScene from './scenes/MailScene';
import NomoneyScene from './scenes/NomoneyScene';
import ChatGPTScene from './scenes/ChatGPTScene';
import SceneCameraManager from './components/SceneCameraManager';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'


export default function SceneContent() {
  const [destination, setDestination] = useState(null);
  const [disableMovement, setDisableMovement] = useState(false);

  const cameraRef = useRef();
  const playerRef = useRef();
  const hasEnded = useRef(false); // ✅ 한 번만 실행

  const isEntered = useRecoilValue(IsEnteredAtom);
  const setIsEntered = useSetRecoilState(IsEnteredAtom);

  const [cameraType, setCameraType] = useState("main");
  const [mainCameraActive, setCameraActive] = useState(true);

  const directionalLightRef = useRef();
  const ambientLightRef = useRef();
  

  useEffect(() => {
    if (destination) {
      requestAnimationFrame(() => setIsEntered(true));
    }
  }, [destination]);



  // ✅ z 위치 감지 및 ending-screen 표시
  useFrame(() => {
    const z = playerRef.current?.position.z;
    const endingScreen = document.getElementById('ending-screen');
    const endingVideo = document.getElementById('ending-video'); // ✅ 여기에 선언 추가!

    if (z > 80 && endingScreen) {
      hasEnded.current = true; // ✅ 한 번만 실행
      endingScreen.style.display = 'block'; // 끝 화면 보이기
                
          // 페이드 인 효과
          endingScreen.classList.add('fade-in');

        // 필요하면 일정 시간 후 페이드 아웃
        setTimeout(() => {
          endingScreen.classList.remove('show');
          // endingScreen.style.display = 'none'; // 나중에 완전히 숨기고 싶으면
          // ✅ 영상 재생 시도
        if (endingVideo) {
          endingVideo.muted = false; // 혹시 모르니 재확인
          endingVideo.play().catch((e) => {
            console.warn('Ending video playback failed:', e);
          });
        }
      }, 10000);
    }
      // if (z == null) return;
    
      // const dirLight = directionalLightRef.current;
      // const ambLight = ambientLightRef.current;
    
      // if (!dirLight || !ambLight) return;
      // if (z < 50) {
      //   // ✅ 낮: 하얀색 & 고정 밝기
      //   const dayColor = new THREE.Color('#ffffff');
      //   dirLight.color.copy(dayColor);
      //   dirLight.intensity = 2.2;
      //   return;
      // }
      // // z 기준값 (50~100 구간)
      // const t = Math.min(Math.max((z - 50) / 50, 0), 1); // 0 ~ 1로 보간값 만들기
    
      // // 조명 색상 보간: 노을빛 → 밤색
      // const sunset = new THREE.Color('#fca311');   // 노을색 (밝은 주황)
      // const night = new THREE.Color('#000000');    // 밤하늘색
    
      // const currentColor = sunset.clone().lerp(night, t);
    
      // dirLight.color.copy(currentColor);
    
      // // 밝기도 줄이기
      // dirLight.intensity = 2.2 - t * 1.7;  // → 2.2 → 0.5

      if (z == null) return;

      const dirLight = directionalLightRef.current;
      const ambLight = ambientLightRef.current;
      if (!dirLight || !ambLight) return;
    
      const dayColor = new THREE.Color('#ffffff');
      const sunsetColor = new THREE.Color('#f9743f');
      const nightColor = new THREE.Color('#0a0f1f');
      const blackoutColor = new THREE.Color('#000000');
    
      if (z <= 40) {
        dirLight.color.copy(dayColor);
        ambLight.color.copy(dayColor);
        dirLight.intensity = 2.2;
        ambLight.intensity = 2.0;
        return;
      }
    
      if (z > 40 && z < 60) {
        const t = (z - 40) / 20;
        const mixColor = dayColor.clone().lerp(sunsetColor, t);
        dirLight.color.copy(mixColor);
        // ambLight.color.copy(mixColor);
        dirLight.intensity = 2.2 - t * 0.5;
        // ambLight.intensity = 2.0 - t * 0.4;
        return;
      }
      if (z >= 60 && z < 70) {
        // ✅ 보간 구간 확장 + 점진적 곡선 보간 (느려짐)
        let t = (z - 60) / 40; // 0 ~ 1
        t = t * t // → 느리게 시작해서 부드럽게 꺼지도록
    
        const mixColor = sunsetColor.clone().lerp(nightColor, t);
        dirLight.color.copy(mixColor);
    
        dirLight.intensity = 2.0 * (1 - t);  // 1.0 → 0
        return;
      }

    
      if (z >= 70 && z < 100) {
        // ✅ 보간 구간 확장 + 점진적 곡선 보간 (느려짐)
        let t = (z - 60) / 40; // 0 ~ 1
        // t = t * t // → 느리게 시작해서 부드럽게 꺼지도록
    
        const mixColor = nightColor.clone().lerp(blackoutColor, t);
        dirLight.color.copy(mixColor);
        // ambLight.color.copy(mixColor);
    
        dirLight.intensity = 2.0 * (1 - t);  // 1.0 → 0
        // ambLight.intensity = 0.8 * (1 - t);  // 0.8 → 0
        return;
      }
    
      // 완전 암전
      dirLight.color.copy(blackoutColor);
      // ambLight.color.copy(blackoutColor);
      dirLight.intensity = 0.0;
      // ambLight.intensity = 0.0;

  });

  // 배경음 멈추는 로직
  // useEffect(() => {
  //   if (isEntered) {
  //     const bgAudio = document.getElementById("bg-audio");
  //     if (bgAudio) bgAudio.pause(); // 혹은 bgAudio.volume = 0;
  //   }
  // }, [isEntered]);
  

  if (isEntered) {
    return (
      <>
        <StatsGl className='stats' />

        <SceneCameraManager
          position={[1, 5, 5]}
          zoom={30}
          makeActive={cameraType === "main"}
          cameraRef={cameraRef}
          playerRef={playerRef}
        />

        <ambientLight intensity={2.2}  ref={ambientLightRef} />

        <directionalLight
          ref={directionalLightRef}
          position={[5, 10, 5]}
          castShadow
          intensity={2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={200}
          shadow-camera-bottom={-100}
          shadow-camera-near={1}
          shadow-camera-far={200}
          shadow-bias={-0.001}
        />

        <Ground onClickGround={(point) => setDestination(point)} />

        <PlayerController
          ref={playerRef}
          destination={destination}
          cameraRef={cameraRef}
          disableMovement={disableMovement}
        />

        <MetroScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          setDisableMovement={setDisableMovement}
        />

        <CafeScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />

        <ClassroomScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />

        <NomoneyScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />

        {/* <AlbaScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        /> */}

      <AlbaScene
          playerRef={playerRef}
          // emotionRef={emotionRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setCameraActive={setCameraActive}
          // mainCameraActive={mainCameraActive}
          setDisableMovement={setDisableMovement} // ✅ 전달

      />

        <BakeryScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />

        <ChatGPTScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />

        <MailScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          setDisableMovement={setDisableMovement}
        />
      </>
    );
  }

  return <Loader isCompleted />;
}
