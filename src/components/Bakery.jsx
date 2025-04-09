// components/Bakery.jsx
import React, { useRef, useEffect, forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Bakery = forwardRef(({ onLoaded, ...props }, ref) => {
  const gltf = useLoader(GLTFLoader, '/assets/models/Bakery-draco.glb', loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
  });

  const sceneRef = useRef();

  // 그림자 설정
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
    }
  }, []);

  // 외부 ref에 연결
  useEffect(() => {
    if (ref && sceneRef.current) {
      if (typeof ref === 'function') {
        ref(sceneRef.current);
      } else {
        ref.current = sceneRef.current;
      }
    }
  }, [ref]);

  return (
    <primitive
      ref={sceneRef}
      object={gltf.scene}
      scale={[1.5, 1.5, 1.5]}
      {...props}
    />
  );
})
