// src/components/SceneCameraManager.jsx
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { OrthographicCamera, useScroll } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';


export default function SceneCameraManager({
  position = [1, 4, 5],
  zoom = 30,
  near = -1000,
  far = 1000,
  makeActive = false,
  cameraRef,
  playerRef, // 👈 추가: 감자 참조
}) {
  const internalRef = useRef();
  const { set } = useThree();
  const scroll = useScroll();
  const currentZoom = useRef(zoom); // 초기 줌 저장

    // 📸 makeActive 시 cameraRef 세팅
  useEffect(() => {
    const camera = internalRef.current;
    if (makeActive && camera) {
      if (cameraRef) cameraRef.current = camera;
      set({ camera });
    }
  }, [makeActive]);

  return (
    <OrthographicCamera
      ref={internalRef}
      position={position}
      zoom={zoom}
      near={near}
      far={far}
    />
  );
}
