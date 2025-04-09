// src/scenes/NomoneyScene.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import CloudEffect from '../components/CloudEffect';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { NomoneyBank } from '../components/NomoneyBank';
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
  playerRef,        // 감자 모델 참조
  emotionRef,       // 감자 머리 위 이모션 참조
  setPlayerVisible, // 감자 보임 여부 변경 함수 (사용 안됨)
  setCameraTarget,  // 카메라가 다시 따라가야 할 타겟
  disableMouse,     // 마우스 이벤트 제거
  enableMouse,      // 마우스 이벤트 복원
  setDisableMovement
}) {
  const group = useRef();

  // const [nomoneyBankRef, setNomoneyBankRef] = useState(null);
  // const [nomoneyGamzaRef, setNomoneyGamzaRef] = useState(null);
  const lightRef = useRef();

  const nomoneyBankRef = useRef()
  const nomoneyGamzaRef = useRef()


  // 각각 별도의 mixer와 actions 관리
  const nomoneyBankActions = useRef();
  const nomoneyGamzaActions = useRef();

  const nomoneyBankMixer = useRef();
  const nomoneyGamzaMixer = useRef();

  const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const clock = new THREE.Clock(); // 애니메이션용 시간
  const NomoneySpotMeshPosition = new Vector3(-92, 0.005, -10.5); // 감자가 도달해야 할 스팟 위치
  const { scene, camera } = useThree();
  const nomoneySpotRef = useRef(); // ✅ 메쉬 ref 추가

  // 텅장 텍스트
  const noMoneyText = useRef();
  useEffect(() => {
    const texture = new THREE.TextureLoader().load('/assets/images/nomoney.webp');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-92, 1.2, -9.4);
    mesh.rotation.y = THREE.MathUtils.degToRad(5);
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
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-89, 4.5, -10);
    mesh.rotation.y = THREE.MathUtils.degToRad(20);
    mesh.visible = false;
    scene.add(mesh);
    nomoneyTalk.current = mesh;
  }, [scene]);

  // const showGIFOverlay = () => {
  //   const overlay = document.getElementById('gifOverlay2');
  //   if (overlay) {
  //     overlay.style.display = 'flex';
  //     setTimeout(() => (overlay.style.display = 'none'), 3000);
  //   }
  // };
  

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };


  // ✅ 노머니 이벤트 완료 후 감자 복귀
  const restorePlayerAfterNomoney = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(-92, 0.3, -10);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    setDisableMovement(false);

    appearPlayer(playerRef, 1.2); // 부드럽게 다시 나타남
    triggerCloudEffect();

    gsap.to(nomoneyGamzaRef.current.position,{
      y: 2,
      duration: 0.5,
      ease: "bounce.inOut"
    })
    gsap.to(nomoneyGamzaRef.current.scale,{
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      ease: "bounce.inOut"
    })

    // 카메라 복귀
    returnCameraY(camera)
    gsap.to(camera, {
      duration: 1,  
      zoom: 30,    // ✅ 목표 zoom 값
      ease: "expo.inOut", // ✅ 부드러운 감속 애니메이션
      onUpdate: () => {
        camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
      }
    });

    setTimeout(() => {
      if (noMoneyText.current) noMoneyText.current.visible = false;
      if (nomoneyTalk.current) nomoneyTalk.current.visible = false;
    }, 600);
    
    // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    setCameraTarget(new Vector3(-83.4, 0, -6.5));  
    enableMouseEvents();      // 마우스 이벤트 복원
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
        triggerCloudEffect();
        setDisableMovement(true);
        disappearPlayer(playerRef); // 감자 작아지며 사라짐
        scene.remove(scene.getObjectByName('nomoneySpot'));
        scene.remove(nomoneySpotRef.current); // ✅ 정확하게 제거됨
        nomoneySpotRef.current.visible = false

        disableMouseEvents(); 

        // 카메라 설정
        gsap.to(camera.position, {
          duration: 0.5,  
          // x: -90,  
          y: 3,   
          ease: "power2.out", // ✅ 부드러운 감속 애니메이션
          onUpdate: () => {
            camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
          }
        });
        gsap.to(camera, {
          duration: 1,  
          zoom: 50,    // ✅ 목표 zoom 값
          ease: "expo.inOut", // ✅ 부드러운 감속 애니메이션
          onUpdate: () => {
            camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
          }
        });

        // 노머니 모델들
        gsap.to([nomoneyGamzaRef.current.position,nomoneyBankRef.current.position] , {
          y: 0,
          duration: 1,
          ease: "expo.inOut"
        });

        // gsap.to(nomoneyGamzaRef.current.position , {
        //   y: 0,
        //   duration: 1,
        //   ease: "bounce.inOut"
        // });
        // setTimeout(() => {
        //   gsap.to(nomoneyBankRef.current.scale, {
        //     x: 1.8,
        //     y: 1.8,
        //     x: 1.5,
        //     duration: 0.5,
        //     ease: "expo.in"
        //   });
        // }, 2000)



        // 노머니💵💸 통장 animations:  ['Anim2', 'Bank', 'NoMoney', 'Pocket', 'Walk_Bone.002']
        // 노머니💵💸 감자🥔 animations:  ['Anim2', 'Bank', 'NoMoney', 'Pocket', 'Walk_Bone.002', 'ahew']

        // 🚊 애니메이션 및 카메라 연출
        setTimeout(() => {
          if (nomoneyBankActions.current && nomoneyGamzaActions.current) {
            nomoneyBankActions.current["Bank"].timeScale = 0.5;
            nomoneyGamzaActions.current["NoMoney"].timeScale = 0.5;
            nomoneyGamzaActions.current["ahew"].timeScale = 0.5;

            nomoneyBankActions.current["Bank"]?.reset().play();
            nomoneyGamzaActions.current["NoMoney"]?.reset().play();
            nomoneyGamzaActions.current["ahew"]?.reset().play();
            // nomoneyBankActions.current["CoffeAnim1"]?.reset().play();
            // nomoneyGamzaActions.current["Idle"]?.reset().play();
          }
        }, 500);

        // 텍스트 등장
        setTimeout(() => {
          if (noMoneyText.current) {
            noMoneyText.current.visible = true;
          }
        }, 5000);

        // 텍스트 확대 & 이동
        setTimeout(() => {
          if (noMoneyText.current) {
            gsap.to(noMoneyText.current.scale, {
              duration: 1,
              x: 6,
              y: 6,
              z: 6,
              ease: 'expo.out',
            });
            gsap.to(noMoneyText.current.position, {
              duration: 2,
              x: -98,
              y: 4,
              ease: 'expo.inOut',
            });
            gsap.to(noMoneyText.current.rotation, {
              duration: 2,
              y: THREE.MathUtils.degToRad(10),
            });
          }
        }, 4500);

        // 말풍선 & gif 표시
        setTimeout(() => {
          if (nomoneyTalk.current) nomoneyTalk.current.visible = true;
          // showGIFOverlay();
        }, 6500);

        setTimeout(() => {
          restorePlayerAfterNomoney();
        }, 12000);
      
      } 
    }

  });

    // 믹서 업데이트도 각각 따로
    useFrame((_, delta) => {
      nomoneyBankMixer.current?.update(delta);
      nomoneyGamzaMixer.current?.update(delta);
    });

  return (
    <group ref={group}>
      <NomoneyBank
        position={[-91.9, -10, -10.1]}
        rotation={[0, THREE.MathUtils.degToRad(-60), 0]}
        scale={[1.8, 1.5, 1.8]}
        onLoaded={({ ref, mixer, actions }) => {
            (nomoneyBankRef.current = ref)
            nomoneyBankMixer.current = mixer;
            nomoneyBankActions.current = actions;
        }}
    />
    {/* mesh.position.set(-98.7, 1.3, -17); */}
    <NomoneyGamza 
      position={[-92, -10, -10.5]}   // -96, -15   -> +4 , +4.5
      rotation={[0, THREE.MathUtils.degToRad(-70), 0]}
      scale={[1.7, 1.7, 1.7]}
      onLoaded={({ ref, mixer, actions }) => {
        (nomoneyGamzaRef.current = ref)
        nomoneyGamzaMixer.current = mixer;
        nomoneyGamzaActions.current = actions; 
      }}
    />

{showCloudEffect && playerRef.current && (
  <CloudEffect 
    position={[
      playerRef.current.position.x, 
      playerRef.current.position.y + 2,  // 위로 2 정도 올려보기
      playerRef.current.position.z
    ]}
  />
)}

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
