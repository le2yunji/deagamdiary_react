import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CloudEffect from "../components/CloudEffect";
import { Vector3 } from "three";
import * as THREE from "three";
import { gsap } from "gsap";

import { AlbaBoard } from "../components/AlbaBoard";
import { AlbaGamza } from "../components/AlbaGamza";
import { Posters } from "../components/AlbaPosters";
import { useSpotTexture } from "../hooks/useSceneTexture";
import ManualAudioPlayer from "../utils/ManualAudioPlayer";
import { getAssetUrl } from "../utils/assetUrl";

import { disappearPlayer, appearPlayer } from "../utils/Common";

const ALBA_TRIGGER_URL = getAssetUrl("/assets/images/albaTrigger.png");
const TULIP_URL = getAssetUrl("/assets/images/tulip.png");
const TREE_URL = getAssetUrl("/assets/images/tree.png");
const FILE_IMAGE_URL = getAssetUrl("/assets/images/file.png");
const ALBA_AHA_AUDIO_URL = getAssetUrl("/assets/audio/albaScene_aha.mp3");
const ALBA_HMM_AUDIO_URL = getAssetUrl("/assets/audio/albaScene_hmm.mp3");
const BBONG_AUDIO_URL = getAssetUrl("/assets/audio/bbong.mp3");

/** 알바 포스터 선택 장면의 모델·카메라·오디오 진행을 제어한다. */
export default function AlbaScene({
  playerRef,
  setCameraTarget,
  setCameraActive,
  setUseSceneCamera,
  setDisableMovement,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose,
}) {
  const group = useRef();
  const albaGamzaRef = useRef();
  const albaSpotRef = useRef();

  const [triggered, setTriggered] = useState(false);
  const [cloudPosition, setCloudPosition] = useState(null);

  const { scene, camera } = useThree();

  const ahaAudioRef = useRef();
  const hmmAudioRef = useRef();
  const bbongAudioRef = useRef();

  const gamzaActions = useRef();
  const gamzaMixer = useRef();

  const [selectedPoster, setSelectedPoster] = useState(null);

  const AlbaSpotMeshPosition = new Vector3(-25.5, 0.005, -10);
  const albaTexture = useSpotTexture(ALBA_TRIGGER_URL);

  const tulip = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(TULIP_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      const mesh3 = new THREE.Mesh(geometry, material);

      mesh.position.set(-35, 0.05, -17);
      mesh3.position.set(-28.5, 0.05, -35);

      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(0);
      mesh.scale.set(3, 3, 3);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);

      mesh3.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh3.rotation.z = THREE.MathUtils.degToRad(0);
      mesh3.scale.set(4, 4, 4);
      mesh3.visible = true;
      mesh3.receiveShadow = true;
      mesh3.castShadow = true;
      scene.add(mesh3);
      tulip.current = mesh;
    });
  }, [scene]);

  const tree = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(TREE_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-15, 0.05, -18);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(0);
      mesh.scale.set(3, 3, 1);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      tree.current = mesh;
    });
  }, [scene]);

  const file = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(FILE_IMAGE_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-56.5, 0.05, -23);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(0);
      mesh.scale.set(5, 5, 1);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      file.current = mesh;
    });
  }, [scene]);

  /** 알바 상호작용을 마치고 플레이어 이동과 배경음을 복구한다. */
  const restorePlayerAfterAlba = () => {
    playerRef.current.visible = true;
    playerRef.current.position.set(-29, 0.3, -6);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    const bgAudio = document.getElementById("bg-audio");
    if (bgAudio) bgAudio.volume = 0.2;

    ahaAudioRef.current?.stop();
    hmmAudioRef.current?.stop();

    gsap.to(camera, {
      duration: 1,
      zoom: 40,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    setSelectedPoster(null); // ✅ 알바씬 끝나면 포스터 닫기

    // ✅ DOM에서 포스터 토글 닫기
    const ids = [
      "gamza-poster",
      "bakery-poster",
      "kids-poster",
      "dokseo-poster",
      "sushi-poster",
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    appearPlayer(playerRef, 1.2);
    setCameraTarget(new Vector3(-33, 0, 1));
    setDisableMovement(false);
  };

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!triggered || !selectedPoster || !gamzaActions.current) return;

    const idle = gamzaActions.current["Idle"];
    const aha = gamzaActions.current["Aha"];
    const confuse = gamzaActions.current["Confuse"];

    if (confuse) {
      confuse.timeScale = 0.63;
      confuse.setLoop(THREE.LoopRepeat, Infinity);
      confuse.clampWhenFinished = false;
    }

    if (aha) {
      aha.timeScale = 0.63;
      aha.setLoop(THREE.LoopOnce, 1);
      aha.clampWhenFinished = true;
    }

    if (idle) {
      idle.timeScale = 0.63;
      idle.setLoop(THREE.LoopRepeat, Infinity);
      idle.clampWhenFinished = false;
    }

    switch (selectedPoster) {
      case "BakeryMemo":
        idle?.stop();
        confuse?.stop();
        aha?.reset().play();
        ahaAudioRef.current?.play();
        hmmAudioRef.current?.stop();

        setTimeout(() => {
          aha?.stop();
          idle?.reset().play();
        }, 1000);
        break;
      case "GamzaMemo":
      case "SushiMemo":
      case "KidsMemo":
      case "DokseoMemo":
        aha?.stop();
        idle?.stop();
        confuse?.reset().play();
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

        break;
      case "IwannagoHomeMemo":
      case "DoNotNakseoMemo":
      case "WonesoongMemo":
        aha?.stop();
        confuse?.reset().play();
        idle?.reset().play();
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

        break;
      default:
        confuse?.stop();
        aha?.stop();
        idle?.reset().play();
        hmmAudioRef.current?.play();
        ahaAudioRef.current?.stop();

        break;
    }
  }, [triggered, selectedPoster]);

  // 🟡 🪧 알바씬 인터랙션 시작
  useFrame(() => {
    if (!triggered && playerRef.current) {
      const dist = new Vector3(
        playerRef.current.position.x,
        0,
        playerRef.current.position.z,
      ).distanceTo(
        new Vector3(AlbaSpotMeshPosition.x, 0, AlbaSpotMeshPosition.z),
      );

      const albaScript = document.getElementById("alba-script");
      albaScript.style.display = "none";

      if (dist < 15 && !triggered) {
        albaScript.style.display = "block";
      }

      if (dist < 2) {
        albaScript.style.display = "none";
        bbongAudioRef.current?.play();
        const posterClick = document.getElementById("click-poster");

        setTimeout(() => {
          posterClick.style.display = "block";
        }, 500);

        setTriggered(true);
        setDisableMovement(true);
        const bgAudio = document.getElementById("bg-audio");
        if (bgAudio) bgAudio.volume = 0.03;

        disappearPlayer(playerRef);
        scene.remove(scene.getObjectByName("albaSpot"));
        scene.remove(albaSpotRef.current);
        if (albaSpotRef.current) albaSpotRef.current.visible = false;

        // 💡 카메라 전환 (씬 전용 카메라 활성화)
        activateSceneCamera(setCameraActive, setUseSceneCamera);

        setInitialCameraPose({
          position: [-25, 7, -9],
          lookAt: [-25, 5, -9],
          zoom: 40,
        });

        // 💡 카메라 이동 + 시선 애니메이션
        animateCamera({
          position: { x: -25, y: 10, z: 5 },
          lookAt: [-25, 4, -10],
          zoom: 45,
          duration: 1.5,
        });
        const albaGamza = albaGamzaRef.current;
        if (albaGamza) {
          const { x, y, z } = albaGamza.position;
          setCloudPosition([x, y + 4, z]);
          setTimeout(() => setCloudPosition(null), 1500);

          gsap.to(albaGamza.scale, {
            x: 1.7,
            y: 1.7,
            z: 1.7,
            duration: 0.3,
            ease: "bounce.out",
          });
        }

        setTimeout(() => {
          const albaGamza = albaGamzaRef.current;
          if (albaGamza) {
            gsap.to(albaGamza.scale, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.5,
              ease: "bounce.inOut",
            });
          }
          setTimeout(() => {
            if (!hasRestoredRef.current) {
              posterClick.style.display = "none";
              restoreMainCamera(setCameraActive, setUseSceneCamera);
              restorePlayerAfterAlba();
              hasRestoredRef.current = true;
            }
          }, 1000);
        }, 25000);
      }
    }
  });
  useFrame((_, delta) => {
    gamzaMixer.current?.update(delta);
  });

  useEffect(() => {
    const handlePosterClose = () => {
      setSelectedPoster(null);
    };
    window.addEventListener("PosterClosed", handlePosterClose);
    return () => window.removeEventListener("PosterClosed", handlePosterClose);
  }, []);

  return (
    <>
      <group ref={group}>
        <AlbaBoard
          position={[-25, 0, -7.7]}
          scale={[3, 3, 3]}
          onClick={() => {}}
        />

        <AlbaGamza
          ref={albaGamzaRef}
          position={[-25, 0, -10]}
          scale={[0, 0, 0]}
          onLoaded={({ mixer, actions }) => {
            gamzaMixer.current = mixer;
            gamzaActions.current = actions;
          }}
        />
        <ManualAudioPlayer
          ref={ahaAudioRef}
          url={ALBA_AHA_AUDIO_URL}
          volume={3}
          loop={false}
          position={[-25, 2, -10]}
        />
        <ManualAudioPlayer
          ref={hmmAudioRef}
          url={ALBA_HMM_AUDIO_URL}
          volume={3}
          loop={false}
          position={[-25, 2, -10]}
        />
        <ManualAudioPlayer
          ref={bbongAudioRef}
          url={BBONG_AUDIO_URL}
          volume={3}
          loop={false}
          position={[87, 2, -16]}
        />

        {cloudPosition && <CloudEffect position={cloudPosition} />}

        <Posters setSelectedPoster={setSelectedPoster} />

        <mesh
          name="albaSpot"
          ref={albaSpotRef}
          position={AlbaSpotMeshPosition}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          receiveShadow
        >
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial
            map={albaTexture}
            transparent={true}
            alphaTest={0.5}
            depthWrite={true}
            premultipliedAlpha={true}
          />
        </mesh>
      </group>
    </>
  );
}
