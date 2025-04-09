import React, { useEffect, useRef, useMemo, forwardRef } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export const BakeryProps = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/BakeryProps.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, mixer } = useAnimations(animations, group);

  // ✅ 외부 ref 연결
  useEffect(() => {
    if (ref && group.current) {
      if (typeof ref === 'function') {
        ref(group.current);
      } else {
        ref.current = group.current;
      }
    }
  }, [ref]);

  // ✅ 감자 관련 노드 숨기기, morph 초기화, 그림자 설정
  useEffect(() => {
    if (group.current) {
      group.current.traverse((node) => {
        const name = node.name || '';

        if (node.isMesh) {
          node.castShadow = true;

          // ✅ morphTargetInfluences 초기화
          node.morphTargetInfluences?.fill(0);
        }

        // // ✅ 감자 노드 숨김 처리
        // if (
        //   name.startsWith('Gamza') ||
        //   name.startsWith('Cube059') ||
        //   name.startsWith('Root') ||
        //   name.startsWith('spine') ||
        //   name.startsWith('shoulder') ||
        //   name.startsWith('upper_arm') ||
        //   name.startsWith('forearm') ||
        //   name.startsWith('hand') ||
        //   name.startsWith('thigh') ||
        //   name.startsWith('shin') ||
        //   name.startsWith('heel') ||
        //   name.startsWith('HandIK') ||
        //   name.startsWith('Armpole') ||
        //   name.startsWith('neutral_bone')
        // ) {
        //   node.visible = false;
        // }
      });

      // ✅ 월드 좌표 업데이트 (위치 정확도 향상)
      group.current.updateMatrixWorld(true);
    }
  }, []);

  // ✅ 외부 전달용 mixer, actions 등록
  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });
      onLoaded({ ref: group.current, mixer, actions });
    }
  }, [onLoaded, mixer, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
});

useGLTF.preload('/assets/models/BakeryProps.glb');
