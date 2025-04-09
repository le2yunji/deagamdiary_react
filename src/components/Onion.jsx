import React, { useEffect, useRef, forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export const Onion = forwardRef(({ onLoaded, ...props }, ref) => {
  const sceneRef = useRef();

  const gltf = useLoader(GLTFLoader, '/assets/models/Onion.glb', loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder); // 💡 여기에 meshopt까지 등록
  });

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
    }

    if (ref) {
      if (typeof ref === 'function') ref(sceneRef.current);
      else ref.current = sceneRef.current;
    }

    if (onLoaded) onLoaded({ ref: sceneRef.current });
  }, [ref, onLoaded]);

  return <primitive ref={sceneRef} object={gltf.scene} {...props} />;
});
