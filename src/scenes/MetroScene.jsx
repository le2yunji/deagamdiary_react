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


export default function MetroScene({
  playerRef,
  setDisableMovement,
  setCameraTarget,
  setCameraActive,         // 💡 추가
  setUseSceneCamera,       // 💡 추가
  useSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose
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
      ease: "power1.in",
    });
    // if (bgAudio) bgAudio.play(); //📢

  };

  
  // ✅ 씬 시작  
  const hasRestoredRef = useRef(false);

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
        }, 1000);

        setTimeout(() => {
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [-28, 10, -124],
            lookAt: [-1.5, 3, -120],
            zoom: 60
          });

          setTimeout(() => {
            animateCamera({
              position: { x: -25, y: 8, z: -93 },
              lookAt: [-10.5, 4, -95.5],
              zoom: 65,
              duration: 10,
            });
          }, 5000);
       
        }, 5000);
      

        setTimeout(() => {
          const sceneAction = actions['Scene'];
          if (sceneAction) {
            sceneAction.timeScale = 0.4;
            sceneAction.reset().play();
          }
        }, 2000);
    
        setTimeout(() => {
          if (!hasRestoredRef.current) {
            restoreMainCamera(setCameraActive, setUseSceneCamera);
            restorePlayerAfterMetro();
            hasRestoredRef.current = true;
          }
        }, 20000);
      }
    }

    if (mixer) mixer.update(clock.getDelta());
  });

  return (
    <group ref={group}>

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
