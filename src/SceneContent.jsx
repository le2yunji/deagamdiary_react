// src/SceneContent.jsx
import { StatsGl, useScroll, OrthographicCamera } from '@react-three/drei';
import Ground from './components/Ground';
import PlayerController from './components/PlayerController';
import { useState, useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IsEnteredAtom } from './stores';
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
import useCameraSwitcher from './hooks/useCameraSwitcher'; // 경로 맞게 조정
import gsap from 'gsap';
import { useControls } from 'leva';
import EscalatorScene from './scenes/EscalatorScene';

export default function SceneContent({ 
  playerRef,
  destination, 
  onPlayerArrived, 
  setDestination,  
  lockCamera,
}) {
  // const isEntered = useRecoilValue(IsEnteredAtom)

  // const [destination, setDestination] = useState(null);
  const [disableMovement, setDisableMovement] = useState(false);
  const { camera } = useThree(); // 현재 씬에 실제 사용되는 카메라

  const cameraRef = useRef();
  // const playerRef = useRef();
  const hasEnded = useRef(false); // ✅ 한 번만 실행

  const setIsEntered = useSetRecoilState(IsEnteredAtom);

  const [cameraType, setCameraType] = useState("main");
  const [useSceneCamera, setUseSceneCamera] = useState(false);

  const [mainCameraActive, setCameraActive] = useState(true);
  const { scene } = useThree();

  const directionalLightRef = useRef();
  const ambientLightRef = useRef();

  const start = useRef(false); // ✅ 한 번만 실행

  const {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose,
    restoreMainCameraSmoothly, 
  } = useCameraSwitcher();


  useEffect(() => {
    if (destination) {
      requestAnimationFrame(() => setIsEntered(true));
    }
  }, [destination]);

  const hasArrived = useRef(false);

  // 🩶
  useEffect(() => {
    // console.log("🔍 lockCamera =", lockCamera);
    if (!lockCamera) return;


    activateSceneCamera(setCameraActive, setUseSceneCamera);
  
    setInitialCameraPose({
      position: [12.3, 12.9, -90.5],
      lookAt: [8, 0, -112],
      zoom: 30,
    });
  }, [lockCamera]);


 // 감자가 목적지에 도달하면 콜백 실행
 useEffect(() => {
  if (!destination || !playerRef.current) return;
  // disableMouseEvents()
  const checkArrival = () => {
    if (hasArrived.current) return;

    const pos = playerRef.current?.position;
    if (!pos) return;

    const dx = pos.x - destination.x;
    const dz = pos.z - destination.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 0.5) {
      hasArrived.current = true;

      const startGuideBtn2 = document.getElementById('start-guide-btn2');

      if (startGuideBtn2) {

        startGuideBtn2.addEventListener("click", () => {

        restoreMainCamera(setCameraActive, setUseSceneCamera);

        // // ✅ 카메라가 감자를 바라보게 설정
        // const camera = cameraRef.current;          // 메인 카메라 ref
        // const player = playerRef.current;          // 감자 ref

        // if (camera && player) {
        //   camera.lookAt(player.position);          // 👁️ 감자를 바라보게
        //   camera.updateProjectionMatrix();         // 반영
        // }
        // start.current = true;

        })
      }

      onPlayerArrived?.();
      clearInterval(interval);
    }
  };

  const interval = setInterval(checkArrival, 200);
  return () => clearInterval(interval);
}, [destination]);


  const lightGradient = [
    { z: 0, color: new THREE.Color('#ffffff'), intensity: 2.2 },       // 낮
    { z: 40, color: new THREE.Color('#ffe1bd'), intensity: 2.2 },      // 노을
    { z: 60, color: new THREE.Color('#ffe1bd'), intensity: 2 },      // 노을
    { z: 70, color: new THREE.Color('#ffc1a8'), intensity: 2 },      // 다리
    { z: 80, color: new THREE.Color('#ffc1a8'), intensity: 1.5 },      // 다리
    { z: 100, color: new THREE.Color('#c0cbec'), intensity: 1.4 },      // 밤
    { z: 120, color: new THREE.Color('#c0cbec'), intensity: 1.3 }       // 암전
  ];
    
  function interpolateLighting(z, gradient) {
    for (let i = 0; i < gradient.length - 1; i++) {
      const curr = gradient[i];
      const next = gradient[i + 1];
      if (z >= curr.z && z <= next.z) {
        const t = (z - curr.z) / (next.z - curr.z);
        const mixedColor = curr.color.clone().lerp(next.color, t);
        const mixedIntensity = curr.intensity + (next.intensity - curr.intensity) * t;
        return { color: mixedColor, intensity: mixedIntensity };
      }
    }
  
    // 경계 밖 처리
    if (z < gradient[0].z) {
      return { color: gradient[0].color, intensity: gradient[0].intensity };
    }
    const last = gradient[gradient.length - 1];
    return { color: last.color, intensity: last.intensity };
  }

  
  // ✅ z 위치 감지 및 ending-screen 표시
useFrame(() => {

    // if (start.current){
    //   const player = playerRef.current;
    //   if (!player) return;
    //   camera.lookAt(player.position);
    // }
    const z = playerRef.current?.position.z;
    const endingScreen = document.getElementById('ending-screen');
    const endingVideo = document.getElementById('ending-video'); // ✅ 여기에 선언 추가!

    if (z > 200 && endingScreen) {
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

    const { color, intensity } = interpolateLighting(z, lightGradient);
    dirLight.color.copy(color);
    ambLight.color.copy(color);  // 동일한 색상
    dirLight.intensity = intensity;
    ambLight.intensity = intensity * 0.8; // 환경광은 조금 낮게
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
  

  // if (isEntered) {
    return (
      <>
        <StatsGl className='stats' />

        {/* 메인 카메라 */}
        <SceneCameraManager
          position={[1, 5, 5]}
          zoom={30}  // ✅ Leva에서 조절
          makeActive={cameraType === "main"} // <- 무조건 메인 카메라로
          cameraRef={cameraRef}
          playerRef={playerRef}
        />

      {/* 씬 카메라 */}
      <OrthographicCamera
        ref={sceneCameraRef}
        makeDefault={useSceneCamera} // 상태에 따라 전환
        zoom={30}  // ✅ Leva에서 조절
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
          // lockCamera={lockCamera}  // ✅ 이 줄 추가!
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
          setInitialCameraPose={setInitialCameraPose}
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
           setInitialCameraPose={setInitialCameraPose}

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
          setInitialCameraPose={setInitialCameraPose}

        />

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

        <ChatGPTScene
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
           setInitialCameraPose={setInitialCameraPose}
        />

         <EscalatorScene
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
      </>
    );
  }
