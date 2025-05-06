// component/ClassroomGamza.jsx

import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo
} from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export const ClassroomGamza = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/ClassroomGamAnim.glb');

  // ✅ 모델 복제 (애니메이션 충돌 방지)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  useEffect(() => {
    if (group.current) {
      // ✅ 그림자 설정
      group.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      // ✅ 애니메이션 설정
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      // ✅ 외부 콜백 전달
      onLoaded?.({ ref: group.current, mixer, actions });
    }
  }, [actions, mixer, onLoaded]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
});

useGLTF.preload('/assets/models/ClassroomGamAnim.glb');
