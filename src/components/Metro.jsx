// component/Metro.jsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

export const Metro = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = React.useRef()
  const { scene, animations }= useGLTF('/assets/models/Metro-draco.glb')

  // ✅ clone: 애니메이션 충돌 방지
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.FrontSide;
        }

      });
 
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      onLoaded?.({ ref: group.current, mixer, actions });
    }
  }, [actions, mixer, onLoaded]);

  return (
    <group ref={group} {...props} dispose={null} scale={[1.2, 1.2, 1.2]}>
      <primitive object={clonedScene} />
    </group>
  );
})

useGLTF.preload('/assets/models/Metro-draco.glb')
