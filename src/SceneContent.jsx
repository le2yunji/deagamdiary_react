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
import { OrthographicCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'
import useCameraSwitcher from './hooks/useCameraSwitcher'; // 경로 맞게 조정

export default function SceneContent() {
  const [destination, setDestination] = useState(null);
  const [disableMovement, setDisableMovement] = useState(false);

  const cameraRef = useRef();
  const playerRef = useRef();
  const hasEnded = useRef(false); // ✅ 한 번만 실행

  const isEntered = useRecoilValue(IsEnteredAtom);
  const setIsEntered = useSetRecoilState(IsEnteredAtom);

  const [cameraType, setCameraType] = useState("main");
  const [useSceneCamera, setUseSceneCamera] = useState(false);

  const [mainCameraActive, setCameraActive] = useState(true);
  const { scene } = useThree();

  const directionalLightRef = useRef();
  const ambientLightRef = useRef();
  
  const {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose
  } = useCameraSwitcher();


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

          if (endingVideo) {
            endingVideo.muted = false; // 혹시 모르니 재확인
            endingVideo.play().catch((e) => {
              console.warn('Ending video playback failed:', e);
            });
          }

        // 필요하면 일정 시간 후 페이드 아웃
        setTimeout(() => {
          endingScreen.classList.remove('show');
          // endingScreen.style.display = 'none'; // 나중에 완전히 숨기고 싶으면
          // ✅ 영상 재생 시도
      
      }, 500);
    }

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
  // useEffect(() => {
  //   console.log("▶ useSceneCamera:", useSceneCamera);
  //   console.log("▶ sceneCameraRef:", sceneCameraRef.current);
  // }, [useSceneCamera]);
  
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

        {/* 메인 카메라 */}
        <SceneCameraManager
          position={[1, 5, 5]}
          zoom={30}
          makeActive={cameraType === "main"}
          cameraRef={cameraRef}
          playerRef={playerRef}
        />

      {/* 씬 카메라 */}
      <OrthographicCamera
        ref={sceneCameraRef}
        makeDefault={useSceneCamera} // 상태에 따라 전환
        zoom={35}
        near={0.1}
        far={100}
        position={[1, 5, 5]} // 기본값 (바로 덮어씀)
        onUpdate={(self) => self.updateProjectionMatrix()}
      />

        <ambientLight intensity={2.2}  ref={ambientLightRef} />

        <directionalLight
          ref={directionalLightRef}
          position={[100, 200, 100]} // 높게 배치해서 전체를 커버
          castShadow
          intensity={3}
          shadow-mapSize-width={2024}
          shadow-mapSize-height={2024}
          shadow-camera-left={-250}     // ✅ 400x400보다 살짝 크게
          shadow-camera-right={250}
          shadow-camera-top={250}
          shadow-camera-bottom={-250}
          shadow-camera-near={1}
          shadow-camera-far={500}       // ✅ 카메라 거리도 넉넉히
          shadow-bias={-0.0005}
        />

        <Ground onClickGround={(point) => setDestination(point)} />

        <PlayerController
          scene={scene}
          ref={playerRef}
          destination={destination}
          cameraRef={cameraRef}
          disableMovement={disableMovement}
        />

        <MetroScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          sceneCameraRef={sceneCameraRef}
          setDisableMovement={setDisableMovement}
          useSceneCamera={useSceneCamera}
          setUseSceneCamera={setUseSceneCamera}
          setCameraActive={setCameraActive}
          activateSceneCamera={activateSceneCamera}
          restoreMainCamera={restoreMainCamera}
          animateCamera={animateCamera}
          setInitialCameraPose={setInitialCameraPose}
        />

        <CafeScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          sceneCameraRef={sceneCameraRef}
          setDisableMovement={setDisableMovement}
          useSceneCamera={useSceneCamera}
          setUseSceneCamera={setUseSceneCamera}
          setCameraActive={setCameraActive}
          activateSceneCamera={activateSceneCamera}
          restoreMainCamera={restoreMainCamera}
          animateCamera={animateCamera}
        />

        <ClassroomScene
           playerRef={playerRef}
           setPlayerVisible={(v) => (playerRef.current.visible = v)}
           setCameraTarget={(pos) => setDestination(pos)}
           cameraRef={cameraRef}
           sceneCameraRef={sceneCameraRef}
           setDisableMovement={setDisableMovement}
           useSceneCamera={useSceneCamera}
           setUseSceneCamera={setUseSceneCamera}
           setCameraActive={setCameraActive}
           activateSceneCamera={activateSceneCamera}
           restoreMainCamera={restoreMainCamera}
           animateCamera={animateCamera}
        />

        <NomoneyScene
          playerRef={playerRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          sceneCameraRef={sceneCameraRef}
          setDisableMovement={setDisableMovement}
          useSceneCamera={useSceneCamera}
          setUseSceneCamera={setUseSceneCamera}
          setCameraActive={setCameraActive}
          activateSceneCamera={activateSceneCamera}
          restoreMainCamera={restoreMainCamera}
          animateCamera={animateCamera}
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
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
          cameraRef={cameraRef}
          sceneCameraRef={sceneCameraRef}
          setDisableMovement={setDisableMovement}
          useSceneCamera={useSceneCamera}
          setUseSceneCamera={setUseSceneCamera}
          setCameraActive={setCameraActive}
          activateSceneCamera={activateSceneCamera}
          restoreMainCamera={restoreMainCamera}
          animateCamera={animateCamera}
          setInitialCameraPose={setInitialCameraPose}
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
           sceneCameraRef={sceneCameraRef}
           setDisableMovement={setDisableMovement}
           useSceneCamera={useSceneCamera}
           setUseSceneCamera={setUseSceneCamera}
           setCameraActive={setCameraActive}
           activateSceneCamera={activateSceneCamera}
           restoreMainCamera={restoreMainCamera}
           animateCamera={animateCamera}
        />
      </>
    );
  }

  return <Loader isCompleted />;
}
