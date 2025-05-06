import React, { forwardRef, useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export const Bakery = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/Bakery.glb');
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.side = THREE.FrontSide;

      }

      if (child.material) {
        // child.material.side = THREE.DoubleSide;
        // 필요 시 다음 주석 해제
        // child.material.depthWrite = true;
        // child.material.depthTest = true;
      }
    });

    Object.values(actions).forEach((action) => {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    });

    onLoaded?.({ ref: group.current, mixer, actions });
  }, [actions, mixer, onLoaded]);

  return (
    <primitive ref={group} object={cloned} {...props} />
  );
});

useGLTF.preload('/assets/models/Bakery.glb');
