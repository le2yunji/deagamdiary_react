import { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { getAssetUrl } from "../utils/assetUrl";

const FILE_MODEL_URL = getAssetUrl("/assets/models/File.glb");

/** 알바 장면 파일 GLB와 단발 애니메이션을 장면 제어에 연결한다. */
export const File = forwardRef(({ onLoaded, ...props }, ref) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(FILE_MODEL_URL);
  const { actions, mixer } = useAnimations(animations, group);

  useImperativeHandle(ref, () => group.current);

  // 외부에서 액션, mixer 접근 가능하게 전달 + 반복 없이 재생 설정
  useEffect(() => {
    if (onLoaded && group.current) {
      Object.values(actions).forEach((action) => {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      });

      // ref 전달
      if (ref) {
        if (typeof ref === "function") {
          ref(group.current);
        } else {
          ref.current = group.current;
        }
      }
      onLoaded({ ref: group.current, mixer, actions }); // ✅ ref 전달
    }
  }, [onLoaded, mixer, actions, ref]);

  // 그림자 설정
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
    }
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cube001"
          geometry={nodes.Cube001.geometry}
          material={materials["Material.055"]}
          position={[0.236, 0.61, -0.153]}
          rotation={[1.087, -1.139, 1.047]}
          scale={0.308}
        />
      </group>
    </group>
  );
});

useGLTF.preload(FILE_MODEL_URL);
