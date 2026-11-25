import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import Ground from "./components/Ground";
import PlayerController from "./components/PlayerController";
import { IsEnteredAtom } from "./stores";
import SceneCameraManager from "./components/SceneCameraManager";
import useCameraSwitcher from "./hooks/useCameraSwitcher";

import {
  AlbaScene,
  BakeryScene,
  CafeScene,
  ChatGPTScene,
  ClassroomScene,
  EscalatorScene,
  MailScene,
  MetroScene,
  NomoneyScene,
} from "./scenes";

/** 플레이어와 카메라를 모든 이야기 장면에 연결하고 위치에 따라 조명을 바꾼다. */
export default function SceneContent({
  playerRef,
  destination,
  onPlayerArrived,
  setDestination,
  lockCamera,
}) {
  const [disableMovement, setDisableMovement] = useState(false);
  const cameraRef = useRef();
  const setIsEntered = useSetRecoilState(IsEnteredAtom);
  const [useSceneCamera, setUseSceneCamera] = useState(false);
  const [, setCameraActive] = useState(true);
  const { scene } = useThree();

  const directionalLightRef = useRef();
  const ambientLightRef = useRef();

  const {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose,
  } = useCameraSwitcher();

  useEffect(() => {
    if (!destination) return;
    const frame = requestAnimationFrame(() => setIsEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [destination, setIsEntered]);

  const hasArrived = useRef(false);

  useEffect(() => {
    if (!lockCamera) return;
    activateSceneCamera(setCameraActive, setUseSceneCamera);

    setInitialCameraPose({
      position: [12.3, 12.9, -90.5],
      lookAt: [8, 0, -112],
      zoom: 40,
    });
  }, [activateSceneCamera, lockCamera, setInitialCameraPose]);

  useEffect(() => {
    const guideButton = document.getElementById("start-guide-btn2");
    if (!guideButton) return;

    /** 입장 안내를 마친 뒤 플레이어를 따라가는 카메라로 돌아간다. */
    const handleGuideComplete = () => {
      if (hasArrived.current) {
        restoreMainCamera(setCameraActive, setUseSceneCamera);
      }
    };

    guideButton.addEventListener("click", handleGuideComplete);
    return () => guideButton.removeEventListener("click", handleGuideComplete);
  }, [restoreMainCamera]);

  // 감자가 목적지에 도달하면 콜백 실행
  useEffect(() => {
    if (!destination || hasArrived.current) return;

    /** 첫 목적지에 도착하면 안내 화면을 한 번만 열도록 알린다. */
    const checkArrival = () => {
      if (hasArrived.current) return;

      const pos = playerRef.current?.position;
      if (!pos) return;

      const dx = pos.x - destination.x;
      const dz = pos.z - destination.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 0.5) {
        hasArrived.current = true;

        onPlayerArrived?.();
        clearInterval(interval);
      }
    };

    const interval = setInterval(checkArrival, 200);
    return () => clearInterval(interval);
  }, [destination, onPlayerArrived, playerRef]);

  const lightGradient = [
    { z: 0, color: new THREE.Color("#ffffff"), intensity: 2.2 }, // 낮
    { z: 40, color: new THREE.Color("#ffe1bd"), intensity: 2.2 }, // 노을
    { z: 60, color: new THREE.Color("#ffe1bd"), intensity: 2 }, // 노을
    { z: 70, color: new THREE.Color("#ffc1a8"), intensity: 2 }, // 다리
    { z: 80, color: new THREE.Color("#ffc1a8"), intensity: 1.5 }, // 다리
    { z: 100, color: new THREE.Color("#c0cbec"), intensity: 1.4 }, // 밤
    { z: 120, color: new THREE.Color("#c0cbec"), intensity: 1.3 }, // 암전
  ];

  /** 플레이어의 Z축 위치를 두 조명 구간 사이의 색과 밝기로 바꾼다. */
  function interpolateLighting(z, gradient) {
    for (let i = 0; i < gradient.length - 1; i++) {
      const curr = gradient[i];
      const next = gradient[i + 1];
      if (z >= curr.z && z <= next.z) {
        const t = (z - curr.z) / (next.z - curr.z);
        const mixedColor = curr.color.clone().lerp(next.color, t);
        const mixedIntensity =
          curr.intensity + (next.intensity - curr.intensity) * t;
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
    const z = playerRef.current?.position.z;

    if (z == null) return;

    const dirLight = directionalLightRef.current;
    const ambLight = ambientLightRef.current;
    if (!dirLight || !ambLight) return;

    const { color, intensity } = interpolateLighting(z, lightGradient);
    dirLight.color.copy(color);
    ambLight.color.copy(color); // 동일한 색상
    dirLight.intensity = intensity;
    ambLight.intensity = intensity * 0.8; // 환경광은 조금 낮게
  });

  return (
    <>
      {/* 메인 카메라 */}
      <SceneCameraManager
        position={[1, 5, 5]}
        zoom={40}
        makeActive
        cameraRef={cameraRef}
        playerRef={playerRef}
      />

      {/* 씬 카메라 */}
      <OrthographicCamera
        ref={sceneCameraRef}
        makeDefault={useSceneCamera} // 상태에 따라 전환
        zoom={40}
        near={0.1}
        far={100}
        position={[1, 5, 5]} // 기본값 (바로 덮어씀)
        onUpdate={(self) => self.updateProjectionMatrix()}
      />

      <ambientLight intensity={2.2} ref={ambientLightRef} />

      <directionalLight
        ref={directionalLightRef}
        position={[100, 200, 100]} // 높게 배치해서 전체를 커버
        castShadow
        intensity={3}
        shadow-mapSize-width={2024}
        shadow-mapSize-height={2024}
        shadow-camera-left={-250} // ✅ 400x400보다 살짝 크게
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-camera-near={1}
        shadow-camera-far={500} // ✅ 카메라 거리도 넉넉히
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
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <CafeScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <ClassroomScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <NomoneyScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <AlbaScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <BakeryScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <ChatGPTScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        restoreMainCamera={restoreMainCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />

      <MailScene
        playerRef={playerRef}
        setCameraTarget={(pos) => setDestination(pos)}
        setDisableMovement={setDisableMovement}
      />

      <EscalatorScene
        playerRef={playerRef}
        setDisableMovement={setDisableMovement}
        setUseSceneCamera={setUseSceneCamera}
        setCameraActive={setCameraActive}
        activateSceneCamera={activateSceneCamera}
        animateCamera={animateCamera}
        setInitialCameraPose={setInitialCameraPose}
      />
    </>
  );
}
