// component/Onion.jsx (리팩토링 버전)

import {
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { getAssetUrl } from "../utils/assetUrl";

const ONION_MODEL_URL = getAssetUrl("/assets/models/ClassroomOnionAnim.glb");

/** 양파 GLB를 복제하고 교실 장면의 단발 애니메이션을 연결한다. */
export const Onion = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF(ONION_MODEL_URL);

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

useGLTF.preload(ONION_MODEL_URL);
