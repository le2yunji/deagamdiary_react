import { useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function useCameraSwitcher() {
  const sceneCameraRef = useRef(); // 전용 카메라 ref
  const initialPosition = useRef(new THREE.Vector3()); // 초기 위치
  const initialLookAt = useRef(new THREE.Vector3());   // 초기 시선

  // 🎥 전용 카메라 초기값 등록
  const setInitialCameraPose = ({ position, lookAt }) => {
    initialPosition.current.set(...position);
    initialLookAt.current.set(...lookAt);

    // 바로 적용도 가능 (예: 씬 진입 시 고정된 각도로 보기)
    const camera = sceneCameraRef.current;
    if (camera) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(initialLookAt.current);
      camera.updateProjectionMatrix();
    }
  };

  // 🎥 전용 카메라 활성화
  const activateSceneCamera = (setCameraActive, setUseSceneCamera) => {
    setCameraActive(false);  // 메인 카메라 비활성화
    setUseSceneCamera(true); // 전용 카메라 활성화
  };

  // 🔁 메인 카메라 복구
  const restoreMainCamera = (setCameraActive, setUseSceneCamera) => {
    setUseSceneCamera(false);
    setCameraActive(true);
  };

  // 📸 전용 카메라 애니메이션 (이동 + 바라보기)
  const animateCamera = ({ position, lookAt, duration = 3 }) => {
    const camera = sceneCameraRef.current;
    if (!camera) return;

    const target = new THREE.Vector3(...lookAt);

    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      },
    });
  };

  return {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose, // 👈 새로 추가된 메서드
  };
}
