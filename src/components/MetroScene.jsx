// src/scenes/MetroScene.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Metro } from '../components/Metro';
import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  enableMouseEvents
} from '../utils/Common';

// 지하철 씬을 담당하는 컴포넌트입니다.
// 플레이어가 특정 위치(스팟)에 도달하면 지하철이 등장하고 애니메이션이 실행됩니다.
export default function MetroScene({
  playerRef,        // 감자 모델 참조
  emotionRef,       // 감자 머리 위 이모션 참조
  setPlayerVisible, // 감자 보임 여부 변경 함수 (사용 안됨)
  setCameraTarget,  // 카메라가 다시 따라가야 할 타겟
  disableMouse,     // 마우스 이벤트 제거
  enableMouse,      // 마우스 이벤트 복원
  setCameraActive,   // 메인 카메라로 복귀 설정
  setMetroCameraRef, // ✅ metroCameraRef 설정용
}) {
  const group = useRef();
  const cameraRef = useRef(); // 지하철 씬용 오쏘 카메라
  const [metroRef, setMetroRef] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [actions, setActions] = useState(null);
  const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부

  const lightRef = useRef(); // 지하철 전등
  const clock = new THREE.Clock(); // 애니메이션용 시간
  const MetroSpotMeshPosition = new Vector3(9, 0.005, -98); // 감자가 도달해야 할 스팟 위치
  const { scene } = useThree();
  const metroSpotRef = useRef(); // ✅ 메쉬 ref 추가



  // 🎇 지하철 조명 설정
  useEffect(() => {
    const light = new PointLight('white', 50, 200, 1.5);
    light.position.set(8, 15, -105);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 5;
    lightRef.current = light;
  }, []);

  // 🚆 등교 이벤트 완료 후 감자 복귀
  const restorePlayerAfterMetro = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(7.2, 0.3, -96.5);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    appearPlayer(playerRef, 0.8); // 부드럽게 다시 나타남

    if (emotionRef.current) {
      emotionRef.current.visible = true;
    }

    // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    setCameraTarget(new Vector3(6, 0, -79));  
    enableMouseEvents();      // 마우스 이벤트 복원
    setCameraActive(true); // 메인 카메라 활성화
  };

  // 🎮 매 프레임마다 실행
  useFrame(() => {
    if (!triggered && playerRef.current) {
      // 감자와 스팟 간 거리 계산
      const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
      const spotPosXZ = new Vector3(MetroSpotMeshPosition.x, 0, MetroSpotMeshPosition.z);
      const dist = playerPosXZ.distanceTo(spotPosXZ);
      // 일정 거리 이내에 도달하면 이벤트 트리거
      if (dist < 1.5) {
        setTriggered(true);
        if (emotionRef.current) emotionRef.current.visible = false;
        disableMouseEvents();
        disappearPlayer(playerRef); // 감자 작아지며 사라짐
        scene.remove(scene.getObjectByName('metroSpot'));
        scene.remove(metroSpotRef.current); // ✅ 정확하게 제거됨
 

        if (lightRef.current) scene.add(lightRef.current);

          // ✅ metro 모델 y 위치 애니메이션
        if (metroRef) {
          gsap.to(metroRef.position, {
            y: 4,
            duration: 1,
            ease: "none"
          });
        }
    

        // 🚊 애니메이션 및 카메라 연출
        setTimeout(() => {
            if (actions) {
              Object.values(actions).forEach((action) => action.play());
              actions["Scene"]?.reset().play();  // ✅ 도달 후 실행
            }
          // 지하철 전용 카메라 활성화
          setCameraActive(false);

          // 카메라가 지하철 따라 이동
          gsap.to(cameraRef.current.position, {
            duration: 12,
            x: -32,
            y: 10,
            z: -57,
            onUpdate: () => {
              cameraRef.current.lookAt(8, 1, -105); // 지하철 위치 바라보기
            },
          });
        }, 1500);

        // 감자 다시 등장
        setTimeout(() => {
          restorePlayerAfterMetro();
        }, 10000);
      }
    }

    // 애니메이션 업데이트
    if (mixer) mixer.update(clock.getDelta());
  });

  return (
    <group ref={group}>
      {/* ✅ 지하철 모델 */}
      <Metro
        position={[-11, -10, -120]}
        rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
        scale={[1.5, 1.5, 1.5]}
        onLoaded={({ ref, mixer, actions }) => {
          setMetroRef(ref);
          setMixer(mixer);
          setActions(actions);
        }}
      />

      {/* ✅ 바닥 클릭 지점 */}
      <mesh
        name="metroSpot"
        ref={metroSpotRef} // ✅ ref 연결
        position={MetroSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>

      {/* ✅ 지하철 카메라 */}
      <orthographicCamera
        ref={cameraRef}
        position={[-75, 20, -62.5]}
        zoom={0.1}
        near={-1000}
        far={1000}
      />
    </group>
  );
}
