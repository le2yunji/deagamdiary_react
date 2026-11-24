import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CloudEffect from "../components/CloudEffect";
import { Vector3 } from "three";
import * as THREE from "three";
import { gsap } from "gsap";
import { useTexture } from "@react-three/drei";
import { Html } from "@react-three/drei";

import { MailBox } from "../components/MailBox";
import { MailGamza } from "../components/MailGamza";
import { File } from "../components/File";
import ManualAudioPlayer from "../utils/ManualAudioPlayer";
import { getAssetUrl } from "../utils/assetUrl";

import {
  returnCameraY,
  disappearPlayer,
  appearPlayer,
} from "../utils/Common";

const MAIL_TRIGGER_URL = getAssetUrl("/assets/images/mailTrigger.png");
const MAIL_ZZAL_URL = getAssetUrl("/assets/images/mail_zzal.png");
const FIRECRACKER_URL = getAssetUrl("/assets/images/firecracker.gif");
const MAIL_AUDIO_URL = getAssetUrl("/assets/audio/mail.mp3");
const BBONG_AUDIO_URL = getAssetUrl("/assets/audio/bbong.mp3");

/** 우편 장면의 모델·카메라·축하 이미지·오디오 진행을 제어한다. */
export default function MailScene({
  playerRef, // 감자 모델 참조
  setCameraTarget, // 카메라가 다시 따라가야 할 타겟
  setDisableMovement,
}) {
  const group = useRef();
  const [triggered, setTriggered] = useState(false); // 씬 시작됐는지 여부

  const mailGamzaRef = useRef(); // ✅ useState 대신
  const mailBoxRef = useRef(); // ✅ useState 대신
  const fileRef = useRef(); // ✅ useState 대신

  const mailgamzaMixer = useRef();
  const mailgamzaActions = useRef();

  const fileMixer = useRef();
  const fileActions = useRef();

  const clock = new THREE.Clock(); // 애니메이션용 시간

    const { scene, camera } = useThree();
    const mailSpotRef = useRef();

  const [showCloudEffect, setShowCloudEffect] = useState(false);
  const bgAudio = document.getElementById("bg-audio");
  const gotoendAudio = document.getElementById("bg-audio2");

  const mailAudioRef = useRef();
  const bbongAudioRef = useRef();

  const mailSpotMeshPosition = new Vector3(111, 0.005, 25); // 감자가 도달해야 할 스팟 위치
  const mailTexture = useTexture(MAIL_TRIGGER_URL);

  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    if (mailTexture) {
      mailTexture.colorSpace = THREE.SRGBColorSpace;
      mailTexture.anisotropy = 16;
      mailTexture.flipY = false;
      mailTexture.needsUpdate = true;
    }
  }, [mailTexture]);

  const mailZzal = useRef();
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(MAIL_ZZAL_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(1.3, 1.2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(99, 0.05, 44);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(20);
      mesh.scale.set(8, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      mailZzal.current = mesh;
    });
  }, []);

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1500);
  };

  // 알바 구하기 이벤트 완료 후 감자 복귀
  const restorePlayerAfterMail = () => {
    gsap.to(camera, {
      duration: 1,
      zoom: 35,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    playerRef.current.visible = true;
    playerRef.current.position.set(107, 0.3, 26);
    playerRef.current.scale.set(0.3, 0.3, 0.3);

    appearPlayer(playerRef, 1.2); // 부드럽게 다시 나타남
    returnCameraY();
    // 카메라가 다시 감자를 따라가도록 플레이어 타겟 위치 설정
    setCameraTarget(new Vector3(99, 0, 25));
    setDisableMovement(false);
    if (bgAudio) bgAudio.pause(); //📢
    if (gotoendAudio) gotoendAudio.play(); //📢
  };

  // 🎮 매 프레임마다 실행
  useFrame(() => {
    const delta = clock.getDelta();
    fileMixer.current?.update(delta);
    mailgamzaMixer.current?.update(delta);

    if (!triggered && playerRef.current) {
      // 감자와 스팟 간 거리 계산
      const playerPosXZ = new Vector3(
        playerRef.current.position.x,
        0,
        playerRef.current.position.z,
      );
      const spotPosXZ = new Vector3(
        mailSpotMeshPosition.x,
        0,
        mailSpotMeshPosition.z,
      );
      const dist = playerPosXZ.distanceTo(spotPosXZ);

      const mailScript = document.getElementById("mail-script");
      mailScript.style.display = "none";

      if (dist < 15 && !triggered) {
        mailScript.style.display = "block";
      }
      // 일정 거리 이내에 도달하면 이벤트 트리거
      if (dist < 1.5) {
        mailScript.style.display = "none";

        bbongAudioRef.current?.play();

        setTriggered(true);
        setDisableMovement(true);
        triggerCloudEffect();
        disappearPlayer(playerRef); // 감자 작아지며 사라짐
        scene.remove(scene.getObjectByName("mailSpot"));
        scene.remove(mailSpotRef.current); // ✅ 정확하게 제거됨
        mailSpotRef.current.visible = false;

        // ✅ mail 모델 스케일 애니메이션
        if (mailGamzaRef.current) {
          setTimeout(() => setShowCloudEffect(false), 1500);

          gsap.to(camera, {
            duration: 1,
            zoom: 55,
            ease: "power2.out",
            onUpdate: () => camera.updateProjectionMatrix(),
          });
          gsap.to(camera.position, {
            duration: 1,
            y: 3.5, // ↑ 카메라를 좀 더 위로 올림
            ease: "expo.inOut",
            onUpdate: () => {
              const target = playerRef.current.position.clone();
              target.y += 0.4; // 👀 눈 높이쯤을 바라보게
              camera.lookAt(target);
              camera.updateProjectionMatrix();
            },
          });

          gsap.to(mailGamzaRef.current.scale, {
            x: 1.7,
            y: 1.7,
            z: 1.7,
            duration: 1,
            ease: "back.out",
          });

          gsap.to(fileRef.current.scale, {
            x: 1.7,
            y: 1.7,
            z: 1.7,
            duration: 1,
            ease: "power3.inOut",
          });

          setTimeout(() => {
            const mailGamzaAnim = mailgamzaActions.current?.["Bone"];
            mailGamzaAnim.timeScale = 0.6;
            mailGamzaAnim.reset().play();
            const fileAnim = fileActions.current?.["Folder"];
            fileAnim.timeScale = 0.6;
            fileAnim.reset().play();
            // 🔥 Three.js 이벤트에서 GIF 오버레이 실행

            setTimeout(() => {
              mailAudioRef.current.play();
            }, 2500);

            setTimeout(() => {
              setShowGif(true);
              setTimeout(() => setShowGif(false), 3000);

              gsap.to(fileRef.current.position, {
                x: 114,
                y: -3,
                z: 23,
                duration: 0.5,
                ease: "power3.inOut",
              });
              gsap.to(fileRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: "expo.inOut",
              });
            }, 3000);
          }, 500);

        }

        // 감자 다시 등장
        setTimeout(() => {
          triggerCloudEffect();
          if (mailGamzaRef.current) {
            gsap.to(mailGamzaRef.current.position, {
              y: 2,
              duration: 0.7,
              ease: "expo.inOut",
            });
            gsap.to(mailGamzaRef.current.scale, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.7,
              ease: "expo.inOut",
            });
          }
          setTimeout(() => {
            restorePlayerAfterMail();
          }, 1000);
        }, 6000);
      }
    }

  });

  return (
    <>
      {showGif && (
        <Html position={[113, 6, 24]} transform occlude>
          <img
            src={FIRECRACKER_URL}
            alt="과제 제출 완료 폭죽"
            style={{
              width: "400px",
              pointerEvents: "none",
            }}
          />
        </Html>
      )}
      <group ref={group}>
        <MailBox
          ref={mailBoxRef}
          position={[114, 0, 23.5]}
          rotation={[0, THREE.MathUtils.degToRad(40), 0]}
          //   rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
          onLoaded={({ ref }) => (mailBoxRef.current = ref)}
        />

        <MailGamza
          ref={mailGamzaRef}
          position={[111, 0.5, 24.7]}
          rotation={[0, THREE.MathUtils.degToRad(-20), 0]}
          scale={[0, 0, 0]}
          onLoaded={({ actions, mixer }) => {
            mailgamzaActions.current = actions;
            mailgamzaMixer.current = mixer;
          }}
        />
        <File
          ref={fileRef}
          position={[111, 0.5, 24.7]}
          rotation={[0, THREE.MathUtils.degToRad(20), 0]}
          scale={[0, 0, 0]}
          onLoaded={({ actions, mixer }) => {
            fileActions.current = actions;
            fileMixer.current = mixer;
          }}
        />

        {/* ✅ 구름 이펙트 */}
        {showCloudEffect && mailGamzaRef.current && (
          <CloudEffect
            position={[
              mailGamzaRef.current?.position?.x ?? 0,
              (mailGamzaRef.current?.position?.y ?? 0) + 4,
              mailGamzaRef.current?.position?.z ?? 0,
            ]}
          />
        )}
        <ManualAudioPlayer
          ref={mailAudioRef}
          url={MAIL_AUDIO_URL}
          volume={1}
          loop={false}
          position={[111, 0.5, 24.7]}
        />
        <ManualAudioPlayer
          ref={bbongAudioRef}
          url={BBONG_AUDIO_URL}
          volume={1}
          loop={false}
          position={[111, 0.5, 24.7]}
        />

        {/* ✅ 바닥 클릭 지점 */}
        <mesh
          name="albaSpot"
          ref={mailSpotRef} // ✅ ref 연결
          position={mailSpotMeshPosition}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          receiveShadow
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            map={mailTexture}
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
