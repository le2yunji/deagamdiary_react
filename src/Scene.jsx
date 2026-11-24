import { Canvas } from "@react-three/fiber";
import SceneContent from "./SceneContent";
import React, { useEffect } from "react";
import { shouldPreventPageScroll } from "./utils/keyboard";

/** 전역 키보드 스크롤을 막고 전체 3D 장면에 시작 상태를 전달한다. */
export const Scene = ({
  playerRef,
  destination,
  onPlayerArrived,
  setDestination,
  lockCamera,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (shouldPreventPageScroll(e.key)) {
        e.preventDefault(); // ⛔️ 키보드 스크롤 막기
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["white"]} />
      <SceneContent
        playerRef={playerRef}
        destination={destination}
        setDestination={setDestination}
        onPlayerArrived={onPlayerArrived}
        lockCamera={lockCamera}
      />
    </Canvas>
  );
};
