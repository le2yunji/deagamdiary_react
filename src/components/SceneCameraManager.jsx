// src/components/SceneCameraManager.jsx
import React, { useRef, useEffect } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useControls } from '@react-three/drei';

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

  useEffect(() => {
    const camera = internalRef.current;
    if (makeActive && camera) {
      if (cameraRef) cameraRef.current = camera;
      set({ camera });
    }
  }, [makeActive]);

  // 👁‍🗨 플레이어를 계속 바라보도록 설정
  useFrame(() => {
    if (playerRef?.current && internalRef.current) {
      // internalRef.current.lookAt(playerRef.current.position);
    }
  });

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
