// hooks/useCameraSwitcher.jsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function useCameraSwitcher() {
  const sceneCameraRef = useRef(); // 전용 카메라 ref
  const initialPosition = useRef(new THREE.Vector3()); // 초기 위치
  const initialLookAt = useRef(new THREE.Vector3());   // 초기 시선
  const initialZoom = useRef(30); // ✅ 줌 값도 저장

  // 🎥 전용 카메라 초기값 등록
  const setInitialCameraPose = ({ position, lookAt, zoom, near, far }) => {
    if (position) initialPosition.current.set(...position);
    if (lookAt) initialLookAt.current.set(...lookAt);
    if (zoom !== undefined) initialZoom.current = zoom;
  
    const camera = sceneCameraRef.current;
    if (camera) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(initialLookAt.current);
      camera.zoom = initialZoom.current;
  
      if (near !== undefined) camera.near = near;   // ✅ 추가
      if (far !== undefined) camera.far = far;       // ✅ 추가
  
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
  const animateCamera = ({ position, lookAt, zoom, near, far, duration = 3 }) => {
    const camera = sceneCameraRef.current;
    if (!camera) return;
  
    const target = new THREE.Vector3(...lookAt);
  
    // position 애니메이션
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
  
    // zoom 애니메이션
    if (zoom !== undefined && camera.zoom !== undefined) {
      gsap.to(camera, {
        zoom,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });
    }
  
    // near 애니메이션 (추가 ✅)
    if (near !== undefined && camera.near !== undefined) {
      gsap.to(camera, {
        near,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });
    }
  
    // far 애니메이션 (추가 ✅)
    if (far !== undefined && camera.far !== undefined) {
      gsap.to(camera, {
        far,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });
    }
  };
  

  return {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose, // 👈 새로 추가된 메서드
  };
}
