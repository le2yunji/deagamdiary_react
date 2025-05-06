// component/MailBox.jsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo
} from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export const MailBox = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene } = useGLTF('/assets/models/MailBox.glb');
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.FrontSide;
        }
      });

      onLoaded?.(group.current);
    }
  }, [onLoaded]);

  return (
    <group ref={group} {...props} dispose={null} scale={[1.7, 1.7, 1.7]}>
      <primitive object={clonedScene} />
    </group>
  );
});

useGLTF.preload('/assets/models/MailBox.glb');
