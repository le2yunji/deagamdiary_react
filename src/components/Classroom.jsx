// component/Classroom.jsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export const Classroom = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/Classroomscene-draco.glb');
  const { actions, mixer } = useAnimations(animations, group);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
  
    // ✅ clone 하면서 mesh 단위로 직접 찾음
    clone.traverse((child) => {
      if (child.isMesh) {
        // 💡 조건: 이름이 mesh_25이고, 재질 이름이 Black이면
        if (child.name === 'mesh_25' && child.material?.name === 'Black') {
          child.material = new THREE.MeshStandardMaterial({
            color: 'white',
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1,
          });
          child.material.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene]);
  

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

useGLTF.preload('/assets/models/Classroomscene-draco.glb');
