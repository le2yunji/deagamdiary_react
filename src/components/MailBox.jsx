// component/MailBox.jsx

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { getAssetUrl } from "../utils/assetUrl";

const MAIL_BOX_MODEL_URL = getAssetUrl("/assets/models/MailBox.glb");

/** 우편함 GLB를 복제하고 메시 그림자를 설정해 장면에 제공한다. */
export const MailBox = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { scene } = useGLTF(MAIL_BOX_MODEL_URL);
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

useGLTF.preload(MAIL_BOX_MODEL_URL);
