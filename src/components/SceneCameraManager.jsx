import { useRef, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/** 메인 직교 카메라를 만들고 활성화될 때 React Three Fiber의 기본 카메라로 등록한다. */
export default function SceneCameraManager({
  position = [1, 4, 5],
  zoom = 30,
  near = -1000,
  far = 1000,
  makeActive = false,
  cameraRef,
}) {
  const internalRef = useRef();
  const { set } = useThree();

  useEffect(() => {
    const camera = internalRef.current;
    if (makeActive && camera) {
      if (cameraRef) cameraRef.current = camera;
      set({ camera });
    }
  }, [cameraRef, makeActive, set]);

  return (
    <OrthographicCamera
      ref={internalRef}
      position={position}
      zoom={zoom}
      near={near}
      far={far}
    />
  );
}
