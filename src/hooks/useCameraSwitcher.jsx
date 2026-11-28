import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

/** 메인 카메라를 끄고 장면 전용 카메라를 활성화한다. */
function activateSceneCamera(setCameraActive, setUseSceneCamera) {
  setCameraActive(false);
  setUseSceneCamera(true);
}

/** 장면 전용 카메라를 끄고 메인 카메라를 복구한다. */
function restoreMainCamera(setCameraActive, setUseSceneCamera) {
  setUseSceneCamera(false);
  setCameraActive(true);
}

/** 장면 전용 카메라의 활성화·복귀·이동을 한곳에서 관리한다. */
export default function useCameraSwitcher() {
  const sceneCameraRef = useRef(); // 전용 카메라 ref
  const initialPosition = useRef(new THREE.Vector3()); // 초기 위치
  const initialLookAt = useRef(new THREE.Vector3());   // 초기 시선
  const initialZoom = useRef(30); // ✅ 줌 값도 저장

  /** 장면 카메라가 시작할 위치와 시선, 투영 범위를 적용한다. */
  const setInitialCameraPose = useCallback(({ position, lookAt, zoom, near, far }) => {
    if (position) initialPosition.current.set(...position);
    if (lookAt) initialLookAt.current.set(...lookAt);
    if (zoom !== undefined) initialZoom.current = zoom;
  
    const camera = sceneCameraRef.current;
    if (camera) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(initialLookAt.current);
      camera.zoom = initialZoom.current;
  
      if (near !== undefined) camera.near = near;
      if (far !== undefined) camera.far = far;
  
      camera.updateProjectionMatrix();
    }
  }, []);

  /** 장면 카메라의 위치·시선·줌·투영 범위를 함께 보간한다. */
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
  
    // 절두체 범위도 위치·줌과 함께 보간한다.
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
    setInitialCameraPose,
  };
}
