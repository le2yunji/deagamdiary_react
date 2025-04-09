// 기존 베이커리씬
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import CloudEffect from '../components/CloudEffect';
import { BakeryProps } from '../components/BakeryProps';
import { Bakery } from '../components/Bakery';

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  disablePlayerControlEvents,
  enableMouseEvents,
  downCameraY,
  returnCameraY,
  showArrow,
  hideAllArrows,
  createArrows,
} from '../utils/Common';

export default function BakeryScene({
  playerRef,
  emotionRef,
  setCameraTarget,
  setDisableMovement
}) {
  const group = useRef();
  const { scene, camera } = useThree();
  const clock = new THREE.Clock();

  const bakeryRef = useRef();
  const bakeryPropsRef = useRef();
  const bakeryPropsMixer = useRef();
  const bakeryPropsActions = useRef();

  const bakerySpotRef = useRef();
  const BakerySpotMeshPosition = new Vector3(31, 0.005, -38);

  const [triggered, setTriggered] = useState(false);
  const [ovenInteractionReady, setOvenInteractionReady] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  // 💡 조명
  useEffect(() => {
    const light = new PointLight('white', 2.5, 200, 1);
    light.position.set(33, 12, -31);
    light.castShadow = true;
    scene.add(light);
  }, []);

  // ⬇️ 화살표 생성
  const arrowInfos = [{ x: 37, y: 8, z: -36, rotationX: -10, rotationY: 8 }];
  useEffect(() => {
    createArrows(scene, arrowInfos);
    hideAllArrows();
  }, []);

  // 🍩 오븐 인터랙션 시작
  const handleOvenClick = () => {
    if (!ovenInteractionReady) return;
    hideAllArrows();
    setOvenInteractionReady(false);

    const play = (name) => bakeryPropsActions.current?.[name]?.reset().play();

    play("Anim2");
    play("Oven1");
    play("DonutTrayAnim2");
    play("DonutRAnim2");
    play("DonutLAnim2");
    play("BbAnim2");
    play("BaAnim2");

    // 오븐 후속 애니메이션
    setTimeout(() => {
      play("Anim3");
      play("Sad");
      play("Oven2");
      play("DonutTrayAnim3");
      play("DonutRAnim3");
      play("DonutLAnim3");
      play("BbAnim3");
      play("BaAnim3");
    }, 19000);

    // 30초 후 플레이어 복귀
    setTimeout(() => {
      startOvenOpen()    
    }, 30000);
  };

  // 🍞 핵심 로직
const startOvenOpen = () => {
  if (!ovenInteractionReady) return;
  hideAllArrows();

  // Anim2 세트 재생
  bakeryPropsActions.current?.["Anim2"].reset().play();
  bakeryPropsActions.current?.["Oven1"].reset().play();
  bakeryPropsActions.current?.["DonutTrayAnim2"].reset().play();
  bakeryPropsActions.current?.["DonutRAnim2"].reset().play();
  bakeryPropsActions.current?.["DonutLAnim2"].reset().play();
  bakeryPropsActions.current?.["BbAnim2"].reset().play();
  bakeryPropsActions.current?.["BaAnim2"].reset().play();

  // Anim2 세트 끝난 후 → Anim3+Sad 세트 실행 → 플레이어 복구
  setTimeout(() => {
    bakeryPropsActions.current?.["Anim2"].stop();
    bakeryPropsActions.current?.["Oven1"].stop();
    bakeryPropsActions.current?.["DonutTrayAnim2"].stop();
    bakeryPropsActions.current?.["DonutRAnim2"].stop();
    bakeryPropsActions.current?.["DonutLAnim2"].stop();
    bakeryPropsActions.current?.["BbAnim2"].stop();
    bakeryPropsActions.current?.["BaAnim2"].stop();

    bakeryPropsActions.current?.["Anim3"].reset().play();
    bakeryPropsActions.current?.["Sad"].reset().play();
    bakeryPropsActions.current?.["Oven2"].reset().play();
    bakeryPropsActions.current?.["DonutTrayAnim3"].reset().play();
    bakeryPropsActions.current?.["DonutRAnim3"].reset().play();
    bakeryPropsActions.current?.["DonutLAnim3"].reset().play();
    bakeryPropsActions.current?.["BbAnim3"].reset().play();
    bakeryPropsActions.current?.["BaAnim3"].reset().play();

    // 감정 애니메이션까지 끝나고 나면 플레이어 복구
    setTimeout(() => {
      restorePlayerAfterBakery();
    }, 5000); // 마지막 애니메이션 길이 고려해서 조정 가능
  }, 9000); // Anim2 전체 재생 시간 후 실행
};


  // ✅ 씬 복귀
  const restorePlayerAfterBakery = () => {

    if (bakeryPropsRef.current) {
      gsap.to(bakeryPropsRef.current.scale, {
        x: 0, y: 0, z: 0, duration: 1, ease: "bounce.inOut"
      });
    }

    playerRef.current.visible = true;
    playerRef.current.position.set(23, 0.3, -28);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    appearPlayer(playerRef, 0.8);
    returnCameraY(camera);
    setDisableMovement(false);

    gsap.to(camera, {
      duration: 0.5,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setCameraTarget(new Vector3(20, 0, -23.5));
    enableMouseEvents();
  };

  // ✅ 플레이어 도달 → 초기 애니메이션 재생
  useFrame(() => {
    const delta = clock.getDelta();
    bakeryPropsMixer.current?.update(delta);

    if (!triggered && playerRef.current) {
      const dist = playerRef.current.position.clone().setY(0).distanceTo(BakerySpotMeshPosition);

      if (dist < 1.5) {
        setTriggered(true);
        disappearPlayer(playerRef);
        setDisableMovement(true);
        downCameraY(camera);
        // disablePlayerControlEvents()
        gsap.to(camera, {
          duration: 1,
          zoom: 40,
          ease: "power2.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        });

        setShowCloudEffect(true);
        setTimeout(() => setShowCloudEffect(false), 1500);

        gsap.to([bakeryRef.current.scale, bakeryPropsRef.current.scale], {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 0.5,
          ease: "power3.inOut",
        });

        setTimeout(() => {
          const play = (name) => bakeryPropsActions.current?.[name]?.reset().play();

          play("Anim1");
          play("Oven0");
          play("DonutTrayAnim1");
          play("DonutRAnim1");
          play("DonutLAnim1");
          play("BbAnim1");
          play("BaAnim1");

          setOvenInteractionReady(true);
          setTimeout(() => showArrow(0), 4000);
        }, 700);
      }
    }
  });

  // ✅ 오븐 클릭 핸들링
  useEffect(() => {
    if (!ovenInteractionReady) return;
    const handleClick = () => handleOvenClick();
    window.addEventListener("click", handleClick, { once: true });
    return () => window.removeEventListener("click", handleClick);
  }, [ovenInteractionReady]);

  return (
    <group ref={group}>
      <Bakery
        ref={bakeryRef}
        position={[25, -1, -38]}
        rotation={[0, THREE.MathUtils.degToRad(45), 0]}
        scale={[0, 0, 0]}
      />
      <BakeryProps
        ref={bakeryPropsRef}
        position={[25, -1, -38]}
        rotation={[0, THREE.MathUtils.degToRad(40), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ actions, mixer }) => {
          bakeryPropsActions.current = actions;
          bakeryPropsMixer.current = mixer;
        }}
      />
      {showCloudEffect && playerRef.current && (
        <CloudEffect
          position={[
            playerRef.current.position.x,
            playerRef.current.position.y + 4,
            playerRef.current.position.z,
          ]}
        />
      )}
      <mesh
        name="bakerySpot"
        ref={bakerySpotRef}
        position={BakerySpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="brown" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
