// src/scenes/MetroScene.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Metro } from '../components/Metro';
import {
  disappearPlayer,
  appearPlayer,
  returnCameraY
} from '../utils/Common';
import { OrthographicCamera } from '@react-three/drei';
import useCameraSwitcher from '../hooks/useCameraSwitcher';

export default function MetroScene({
  playerRef,
  setDisableMovement,
  setCameraTarget
}) {
  const group = useRef();
  const metroSpotRef = useRef();
  const lightRef = useRef();
  const clock = new THREE.Clock();
  const [metroRef, setMetroRef] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [actions, setActions] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const MetroSpotMeshPosition = new Vector3(9, 0.005, -98);
  const { scene, camera } = useThree();
  const bgAudio = document.getElementById("bg-audio");
  const {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose, // 💡 추가!
  } = useCameraSwitcher();
  const [useSceneCamera, setUseSceneCamera] = useState(false);
  const [mainCameraActive, setMainCameraActive] = useState(true);


// 초기 위치 설정
// useEffect(() => {
//   setInitialCameraPose({
//     position: [-35, 18, -129],
//     lookAt: [0, 1, -120]
//   });
// }, []);

  useEffect(() => {
    const light = new PointLight('white', 50, 200, 1.5);
    light.position.set(8, 15, -105);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 5;
    lightRef.current = light;
  }, []);


  // ✅ 씬 복귀
  const restorePlayerAfterMetro = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(6.7, 0.3, -93);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    // appearPlayer(playerRef, 0.8);
    setDisableMovement(false);
    returnCameraY(camera);

    gsap.to(camera, {
      duration: 0.5,
      zoom: 30,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setCameraTarget(new Vector3(6.3, 0, -79.3));

    gsap.to(playerRef.current.scale, {
      duration: 1.2,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: "expo.in",
    });
    // if (bgAudio) bgAudio.play(); //📢

  };


  // setTimeout(() => {
  //   metroCamera = true;
  // }, 2000)

  // moveModelYPosition(metro, 1.95);

  // setTimeout(() => {
  //   metro.playAllAnimations();
  //   scene.add(metroLight)

  //   gsap.to(camera3.position, {
  //     duration: 12,
  //     x: -32,
  //     y: 10,
  //     z: -57,
  //     onUpdate: () => {
  //       camera3.lookAt(8, 1, -105); // ✅ 카메라가 이동하면서 계속 lookAt 유지
  //     },
  //   })
  // }, 1500)

  
  // ✅ 씬 시작  

  useFrame(() => {
    if (!triggered && playerRef.current) {
      const playerPosXZ = new Vector3(playerRef.current.position.x, 0, playerRef.current.position.z);
      const spotPosXZ = new Vector3(MetroSpotMeshPosition.x, 0, MetroSpotMeshPosition.z);
      const dist = playerPosXZ.distanceTo(spotPosXZ);

      if (dist < 1.5) {
        // if (bgAudio) bgAudio.pause(); //📢

        setTriggered(true);
        disappearPlayer(playerRef);
        setDisableMovement(true);
        scene.remove(scene.getObjectByName('metroSpot'));
        metroSpotRef.current.visible = false;

        gsap.to(metroRef.position, { y: 2.8, duration: 1, ease: 'none' });

        setTimeout(() => {
          if (lightRef.current) scene.add(lightRef.current);
          // activateSceneCamera(setMainCameraActive, setUseSceneCamera);
        }, 1000);

        setTimeout(() => {
          animateCamera({
            position: { x: -38.5, y: 10, z: -117 },
            lookAt: [-65, 1, -40],
            duration: 12,
          });

        }, 4000);
      
        gsap.to(camera, {
          duration: 0.5,
          zoom: 25,
          ease: "power2.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        });
        gsap.to(camera.position, {
          duration: 0.5,
          x: 4,
          y: 3,
          // z: ,
          // zoom: 30,
          ease: "power2.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        });

        setTimeout(() => {
          if (actions) {
            actions['Scene']?.reset().play();
          }
        }, 2000);
        setTimeout(() => {
          gsap.to(camera, {
            duration: 0.5,
            zoom: 30,
            ease: "power2.out",
            onUpdate: () => camera.updateProjectionMatrix(),
          });
        }, 4000);
        setTimeout(() => {
          // restoreMainCamera(setMainCameraActive, setUseSceneCamera);
          restorePlayerAfterMetro();
        }, 12000);
      }
    }

    if (mixer) mixer.update(clock.getDelta());
  });

  return (
    <group ref={group}>
         {/* 🔄 메인 카메라 Active 여부에 따라 SceneCamera 렌더 */}
         {useSceneCamera && (
        <OrthographicCamera
          ref={sceneCameraRef}
          makeDefault
          position={[1, 5, 5]}
          zoom={30}
        />
      )}

      <Metro
        position={[-7.5, -10, -110]} //  position={[-8, -10, -120]}
        rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
        scale={[1.2, 1.2, 1.2]}
        onLoaded={({ ref, mixer, actions }) => {
          setMetroRef(ref);
          setMixer(mixer);
          setActions(actions);
        }}
      />

      <mesh
        name="metroSpot"
        ref={metroSpotRef}
        position={MetroSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
