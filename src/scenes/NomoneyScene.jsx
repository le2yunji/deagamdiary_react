// src/scenes/NomoneyScene.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { NomoneyGamza } from '../components/NomoneyGamza';

import {
  disappearPlayer,
  appearPlayer,
  disableMouseEvents,
  enableMouseEvents,
  moveModelYPosition,
  downCameraY,
  returnCameraY,
  setDisableMovement
} from '../utils/Common';

// 지하철 씬을 담당하는 컴포넌트입니다.
// 플레이어가 특정 위치(스팟)에 도달하면 지하철이 등장하고 애니메이션이 실행됩니다.
export default function NomoneyScene({
  playerRef,
  setCameraTarget,
  setDisableMovement,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,       // 💡 추가
  useSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose
}) {
  const group = useRef();

  const nomoneyGamzaRef = useRef()
  const nomoneyGamzaActions = useRef();
  const nomoneyGamzaMixer = useRef();

  const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const clock = new THREE.Clock(); // 애니메이션용 시간
  const NomoneySpotMeshPosition = new Vector3(-92, 0.005, -10.5); // 감자가 도달해야 할 스팟 위치
  const { scene, camera } = useThree();
  const nomoneySpotRef = useRef(); // ✅ 메쉬 ref 추가

  // 텅장 텍스트 💬
  const noMoneyText = useRef();
  useEffect(() => {
    const texture = new THREE.TextureLoader().load('/assets/images/nomoney.webp');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    const geometry = new THREE.PlaneGeometry(1.2, 0.7);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-92, 2, -7.6);
    mesh.rotation.y = THREE.MathUtils.degToRad(5);
    mesh.scale.set(1, 1, 1); // 아주 작게 시작
    mesh.visible = false;
    scene.add(mesh);
    noMoneyText.current = mesh;
  }, [scene]);

 // 💭
  const nomoneyTalk = useRef();
  useEffect(() => {
    const texture = new THREE.TextureLoader().load('/assets/images/talk5.webp');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    const geometry = new THREE.PlaneGeometry(3.5, 2.5);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-89, 4, -10);
    mesh.rotation.y = THREE.MathUtils.degToRad(10);
    mesh.visible = false;
    scene.add(mesh);
    nomoneyTalk.current = mesh;
  }, [scene]);

  const showGIFOverlay = () => {
    const overlay = document.getElementById('gifOverlay2');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => (overlay.style.display = 'none'), 3000);
    }
  };

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1000);
  };

  // ✅ 노머니 이벤트 완료 후 감자 복귀
  const restorePlayerAfterNomoney = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(-92, 0.3, -10);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);

    triggerCloudEffect();
    appearPlayer(playerRef, 1.2); // 부드럽게 다시 나타남

    // // 카메라 복귀
    // returnCameraY(camera)
    // gsap.to(camera, {
    //   duration: 1,  
    //   zoom: 30,    // ✅ 목표 zoom 값
    //   ease: "expo.inOut", // ✅ 부드러운 감속 애니메이션
    //   onUpdate: () => {
    //     camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
    //   }
    // });
    
    setTimeout(() => {
    // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    setCameraTarget(new Vector3(-83.4, 0, -6.5));  
    enableMouseEvents();      // 마우스 이벤트 복원
    }, 1000)

  };


  // ✅ 씬 시작
  // 🎮 매 프레임마다 실행
  useFrame(() => {
    if (!triggered && playerRef.current) {
      // 감자와 스팟 간 거리 계산
      const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
      const spotPosXZ = new Vector3(NomoneySpotMeshPosition.x, 0, NomoneySpotMeshPosition.z);
      const dist = playerPosXZ.distanceTo(spotPosXZ);
      // 일정 거리 이내에 도달하면 이벤트 트리거
      if (dist < 2) {
        setTriggered(true);
        setDisableMovement(true);
        disappearPlayer(playerRef); // 감자 작아지며 사라짐
        scene.remove(scene.getObjectByName('nomoneySpot'));
        scene.remove(nomoneySpotRef.current); // ✅ 정확하게 제거됨
        nomoneySpotRef.current.visible = false

        disableMouseEvents(); 

        triggerCloudEffect();

        // 노머니감자 등장
        gsap.to(nomoneyGamzaRef.current.scale, {
          x: 1.7,
          y: 1.7,
          z: 1.7,
          duration: 0.5,
          ease: "expo.inOut"
        });

        setTimeout(() => {
          // 카메라 설정

          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [-90, 12, 3],
            lookAt: [-92, 3, -9.5],
            zoom: 30
          });

          // 💡 카메라 이동 + 시선 애니메이션
          animateCamera({
            position: { x: -90, y: 8, z: 3},
            lookAt: [-92, 3, -9.5],
            zoom: 50,
            duration: 1.5
          });
          // gsap.to(camera.position, {
          //   duration: 0.5,  
          //   // x: -90,  
          //   y: 3,   
          //   ease: "power2.out", // ✅ 부드러운 감속 애니메이션
          //   onUpdate: () => {
          //     camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
          //   }
          // });
          // gsap.to(camera, {
          //   duration: 1,  
          //   zoom: 50,    // ✅ 목표 zoom 값
          //   ease: "expo.inOut", // ✅ 부드러운 감속 애니메이션
          //   onUpdate: () => {
          //     camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
          //   }
          // });
        }, 200)
       
  
          if (nomoneyGamzaActions.current) {
            const noMoneyGamzaAction = nomoneyGamzaActions.current["Scene"];
            noMoneyGamzaAction.timeScale = 0.4;
            noMoneyGamzaAction.reset().play();
          }


        // 말풍선 & gif 표시
        setTimeout(() => {
          noMoneyText.current.visible = true;
          showGIFOverlay();
        }, 5500)

        // 텍스트 확대 & 이동
        setTimeout(() => {
          nomoneyTalk.current.visible = true;
          if (noMoneyText.current) {
            gsap.to(noMoneyText.current.scale, {
              duration: 0.5,
              x: 7,
              y: 7,
              z: 7,
              ease:'expo.inOut',
            });
            gsap.to(noMoneyText.current.position, {
              duration: 0.5,
              x: -98,
              y: 5,
              ease: 'none',
            });
            gsap.to(noMoneyText.current.rotation, {
              duration: 0.5,
              y: THREE.MathUtils.degToRad(10),
            });
          }
        }, 6000);

        setTimeout(() => {
          noMoneyText.current.visible = false;
          nomoneyTalk.current.visible = false;
          gsap.to(nomoneyGamzaRef.current.position,{
            y: 2,
            duration: 0.3,
            ease: "expo.inOut"
          })
          triggerCloudEffect();

          gsap.to(nomoneyGamzaRef.current.scale,{
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "expo.inOut"
          })
          restoreMainCamera(setCameraActive, setUseSceneCamera);

        }, 11000);

        setTimeout(() => {
          restorePlayerAfterNomoney();
        }, 13000);

      } 
    }
  });

    // 믹서 업데이트도 각각 따로
    useFrame((_, delta) => {
      nomoneyGamzaMixer.current?.update(delta);
    });

  return (
    <group ref={group}>

   {showCloudEffect && playerRef.current && (
      <CloudEffect 
        position={[
          playerRef.current.position.x + 0.5, 
          playerRef.current.position.y + 3,
          playerRef.current.position.z 
        ]}
      />
    )}

    <NomoneyGamza 
      ref={nomoneyGamzaRef}
      position={[-92, 0, -10.5]}  
      rotation={[0, THREE.MathUtils.degToRad(-70), 0]}
      scale={[0, 0, 0]}
      onLoaded={({ mixer, actions }) => {
        nomoneyGamzaMixer.current = mixer;
        nomoneyGamzaActions.current = actions; 
      }}
    />

 

      {/* ✅ 바닥 클릭 지점 */}
      <mesh
        name="nomoneySpot"
        ref={nomoneySpotRef} // ✅ ref 연결
        position={NomoneySpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="red" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
