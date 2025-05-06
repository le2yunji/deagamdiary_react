// component/Onion.jsx (리팩토링 버전)

import React, { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export const Onion = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/ClassroomOnionAnim.glb');

  // ✅ clone해서 독립된 인스턴스 사용
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  // ✅ 로딩 후 애니메이션 및 그림자 설정
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
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
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
});

useGLTF.preload('/assets/models/ClassroomOnionAnim.glb');
