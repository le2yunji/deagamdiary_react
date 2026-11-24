import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  Vector3,
} from "three";

import * as THREE from "three";
import { gsap } from "gsap";
import { disappearPlayer, appearPlayer } from "../utils/Common";

import CloudEffect from "../components/CloudEffect";
import { Classroom } from "../components/Classroom";
import { Onion } from "../components/Onion";
import { ClassroomGamza } from "../components/ClassroomGamza";
import ManualAudioPlayer from "../utils/ManualAudioPlayer";
import { getAssetUrl } from "../utils/assetUrl";

const slidePaths = [
  getAssetUrl("/assets/images/ppt1.webp"),
  getAssetUrl("/assets/images/ppt2.webp"),
  getAssetUrl("/assets/images/ppt3.webp"),
  getAssetUrl("/assets/images/ppt4.webp"),
  getAssetUrl("/assets/images/ppt5.webp"),
];
const talkPaths = [
  getAssetUrl("/assets/images/talk1.webp"),
  getAssetUrl("/assets/images/talk2.webp"),
  getAssetUrl("/assets/images/talk3.webp"),
  getAssetUrl("/assets/images/talk4.webp"),
];
const CLASS_TRIGGER_URL = getAssetUrl("/assets/images/classTrigger.png");
const CLASS_ZZAL_URL = getAssetUrl("/assets/images/class_zzal.png");
const CLASS_ZZAL_SECOND_URL = getAssetUrl("/assets/images/class_zzal2.png");
const PPT_CLICK_URL = getAssetUrl("/assets/images/ppt_click.png");
const CLASS_BGM_URL = getAssetUrl("/assets/audio/classScene_bgm.mp3");
const CLASS_GAMZA_AUDIO_URL = getAssetUrl(
  "/assets/audio/classScene_daegam_talk.mp3",
);
const CLASS_ONION_AUDIO_URL = getAssetUrl(
  "/assets/audio/classScene_onion_daegam.mp3",
);
const BBONG_AUDIO_URL = getAssetUrl("/assets/audio/bbong.mp3");

/** 교실 발표 장면의 슬라이드·대화·모델·카메라·오디오 진행을 제어한다. */
export default function ClassroomScene({
  playerRef,
  setDisableMovement,
  setCameraTarget,
  setCameraActive,
  setUseSceneCamera,
  activateSceneCamera,
  animateCamera,
  restoreMainCamera,
  setInitialCameraPose,
}) {
  const { scene } = useThree();
  const group = useRef();
  const classroomSpotRef = useRef();

  const classroomRef = useRef();
  const classroomActions = useRef();
  const classroomMixer = useRef();

  const classroomGamzaRef = useRef();
  const classroomGamzaActions = useRef();
  const classroomGamzaMixer = useRef();

  const onionRef = useRef();
  const onionActions = useRef();
  const onionMixer = useRef();

  const loader = new TextureLoader();
  const talkInterval = useRef(null);
  const [showCloudEffect, setShowCloudEffect] = useState(false);
  const [slides, setSlides] = useState([]);
  const [talks, setTalks] = useState([]);
  const slideStarted = useRef(false);

  const bgAudio = document.getElementById("bg-audio");
  const classAudioRef = useRef();
  const presentAudioRef = useRef();
  const bbongAudioRef = useRef();
  const bbyongAudioRef = useRef();

  const cloudRef = useRef();

  const ClassroomSpotMeshPosition = new Vector3(-99, 0.005, -70);
  const classTexture = useTexture(CLASS_TRIGGER_URL);

  const classZzal = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(CLASS_ZZAL_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 1.2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-80, 0.05, -70);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.scale.set(5, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;

      scene.add(mesh);
      classZzal.current = mesh;
    });
  }, []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(CLASS_ZZAL_SECOND_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 1.2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-110, 0.05, -50);
      mesh.rotation.x = THREE.MathUtils.degToRad(-90);
      mesh.rotation.z = THREE.MathUtils.degToRad(30);
      mesh.scale.set(5, 10, 5);
      mesh.visible = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;

      scene.add(mesh);
      classZzal.current = mesh;
    });
  }, []);

  const pptClickRef = useRef();
  const pptClickMeshPosition = new Vector3(-92.1, 6.8, -69.5);
  const pptClickTexture = useTexture(PPT_CLICK_URL);

  useEffect(() => {
    if (classTexture) {
      classTexture.colorSpace = THREE.SRGBColorSpace;
      classTexture.anisotropy = 16;
      classTexture.flipY = false;
      classTexture.needsUpdate = true;
    }
    if (pptClickTexture) {
      pptClickTexture.colorSpace = THREE.SRGBColorSpace;
      pptClickTexture.anisotropy = 16;
      pptClickTexture.flipY = false;
      pptClickTexture.needsUpdate = true;
    }
  }, [classTexture, pptClickTexture]);

  useEffect(() => {
    if (cloudRef.current) {
      // 중심에서 커지게 하기 위해 초기 스케일을 0으로 설정
      cloudRef.current.scale.set(0, 0, 0);

      // gsap으로 스케일 애니메이션
      gsap.to(cloudRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      });
      cloudRef.current.raycast = () => null; // raycaster 무시
      cloudRef.current.renderOrder = -1; // 🎯 먼저 그리기
      // ✅ 항상 맨 위에 그리도록 설정
      cloudRef.current.renderOrder = 999;
      if (cloudRef.current.material) {
        cloudRef.current.material.depthWrite = false;
        cloudRef.current.material.transparent = true;
      }
    }
  }, []);

  // 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1000);
  };

  // 피피티, 슬라이드
  useEffect(() => {
    const geometry = new PlaneGeometry(10, 5.7);
    setSlides(
      slidePaths.map((path) => {
        const mat = new MeshBasicMaterial({ transparent: true, opacity: 0 });
        const mesh = new Mesh(geometry, mat);
        mesh.rotation.y = THREE.MathUtils.degToRad(-30);
        mesh.position.set(-92, 6.55, -70); // ppt 위치
        mesh.visible = false;
        loader.load(path, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.opacity = 1;
          mat.needsUpdate = true;
        });
        scene.add(mesh);
        return mesh;
      }),
    );
  }, []);

  // 발표 말풍선 💬
  useEffect(() => {
    const geometry = new PlaneGeometry(2, 2);
    setTalks(
      talkPaths.map((path) => {
        const mat = new MeshBasicMaterial({
          transparent: true,
          alphaTest: 0.5,
        });
        const mesh = new Mesh(geometry, mat);
        mesh.position.set(-87, 5.8, -65); // 말풍선 위치
        mesh.rotation.set(
          THREE.MathUtils.degToRad(-10),
          THREE.MathUtils.degToRad(8),
          0,
        );
        mesh.visible = false;
        loader.load(path, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
        });
        scene.add(mesh);
        return mesh;
      }),
    );
  }, []);

  // 💬 감자 발표 말풍선 재생 함수
  const animateTalkBubbles = () => {
    let currentIndex = 0;

    if (talks.length === 0) return;

    talkInterval.current = setInterval(() => {
      talks.forEach((talk, index) => {
        talk.visible = index === currentIndex;
      });
      currentIndex = (currentIndex + 1) % talks.length;
    }, 500); // 0.5초 간격으로 순환
  };

  // 💬⛔️ 감자 발표 말풍선 멈춤 함수
  const stopTalkBubbles = () => {
    if (talkInterval.current) {
      clearInterval(talkInterval.current);
      talkInterval.current = null;
    }
    talks.forEach((talk) => {
      if (talk) {
        talk.visible = false;
        if (talk.material) {
          talk.material.opacity = 0;
        }
      }
    });
  };

  // 🌈 🪧 슬라이드 쇼 시작
  const startSlideShow = () => {
    if (!slides.length) return;
    classAudioRef.current?.play();
    presentAudioRef.current?.play();
    pptClickRef.current.visible = false;
    animateTalkBubbles();
    let index = 0;
    const animateSlide = () => {
      const slide = slides[index];
      if (!slide) return;

      slides.forEach((s) => {
        if (s) s.visible = false;
      });

      slide.visible = true;
      slide.material.opacity = 0;

      gsap.to(slide.material, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          slideStarted.current = true; // 슬라이드 시작됨

          gsap.to(slide.material, {
            opacity: 0,
            delay: 3,
            duration: 0.5,
            onComplete: () => {
              index++; //
              if (index === 4) {
                stopTalkBubbles();
              }
              if (index >= slides.length) {
                triggerCloudEffect();
                gsap.to(classroomGamzaRef.current.position, {
                  x: -90,
                  y: 2,
                  z: -68,
                  duration: 0.3,
                  ease: "power3.inOut",
                });

                gsap.to(classroomGamzaRef.current.scale, {
                  x: 0,
                  y: 0,
                  z: 0,
                  duration: 0.3,
                  ease: "power3.inOut",
                });

                const onionAnimation = onionActions.current["Scene"];
                onionAnimation.timeScale = 0.65;
                onionAnimation.play();

                setTimeout(() => {
                  animateCamera({
                    position: { x: -95, y: 8, z: -61 },
                    lookAt: [-99, 4, -68],
                    zoom: 58,
                    duration: 1,
                    near: -100,
                    far: 50,
                  });
                  setTimeout(() => {
                    animateCamera({
                      position: { x: -95, y: 7, z: -61 },
                      lookAt: [-99, 4, -68],
                      zoom: 66,
                      duration: 3,
                      near: -100,
                      far: 50,
                    });
                  }, 1000);
                }, 1000);
                playerRef.current.visible = false;
                playerRef.current.position.set(-94, 0, -48);
                playerRef.current.scale.set(0.3, 0.3, 0.3);

                setTimeout(() => {
                  restorePlayerAfterClass();
                }, 10000);

                return; // ✅ 종료
              }
              animateSlide(); // 다음 슬라이드 호출
            },
          });
        },
      });
    };

    animateSlide();
  };

  // ✅ 클래스룸 인터랙션 끝 완료
  const restorePlayerAfterClass = () => {
    classAudioRef.current.stop();
    bbongAudioRef.current.stop();
    presentAudioRef.current.stop();

    restoreMainCamera(setCameraActive, setUseSceneCamera);
    playerRef.current.visible = true;

    appearPlayer(playerRef, 1.2);
    setCameraTarget(new Vector3(-99.5, 0, -35.5));
    setDisableMovement(false);

    if (bgAudio) bgAudio.play(); //📢
  };

  const triggered = useRef(false); // ✅ 상태를 즉시 바꾸고 반영되도록
  const pausedGamzaAction = useRef(null); // 👉 현재 일시정지한 액션 저장용
  const pausedOnionAction = useRef(null); // 👉 현재 일시정지한 액션 저장용

  // ✅ 클래스룸 스팟 매쉬 도달 시 / 시작
  useFrame(() => {
    const classroomScript = document.getElementById("classroom-script");
    if (!triggered.current && playerRef.current)
      classroomScript.style.display = "none";

    if (!playerRef.current || triggered.current) return;
    const dist = playerRef.current.position
      .clone()
      .setY(0)
      .distanceTo(ClassroomSpotMeshPosition);

    if (dist < 25 && !triggered.current) {
      classroomScript.style.display = "block";
    }

    if (dist < 3 && !triggered.current) {
      classroomScript.style.display = "none";
      bbyongAudioRef.current?.play();

      if (bgAudio) bgAudio.pause(); //📢

      // setTriggered(true)
      triggered.current = true; // 👈 즉각 변경됨
      disappearPlayer(playerRef);
      triggerCloudEffect();
      setDisableMovement(true);
      scene.remove(scene.getObjectByName("classroomSpot"));
      if (classroomSpotRef.current) classroomSpotRef.current.visible = false;

      gsap.to(classroomRef.current.scale, {
        x: 5.5,
        y: 5.5,
        z: 5.5,
        duration: 0.3,
        ease: "power3.inOut",
      });

      setTimeout(() => {
        bbongAudioRef.current?.play();
        gsap.to(classroomGamzaRef.current.scale, {
          x: 5.6,
          y: 5.6,
          z: 5.6,
          duration: 0.3,
          ease: "power3.inOut",
        });
        setTimeout(() => {
          bbongAudioRef.current?.play();
          gsap.to(onionRef.current.scale, {
            x: 5.6,
            y: 5.6,
            z: 5.6,
            duration: 0.3,
            ease: "power3.inOut",
          });
        }, 500);

        const onionAnimation = onionActions.current["Scene"];
        onionAnimation.timeScale = 0.65;
        onionAnimation.reset().play();

        const gamzaAnimation = classroomGamzaActions.current["Scene"];
        gamzaAnimation.timeScale = 0.65;
        gamzaAnimation.reset().play();

        // 🔥 1초 동안 재생하고 pause
        setTimeout(() => {
          gamzaAnimation.paused = true; // stop()❌ pause()⭕
          pausedGamzaAction.current = gamzaAnimation; // 나중에 클릭시 이어서 play하기 위해 저장

          onionAnimation.paused = true; // stop()❌ pause()⭕
          pausedOnionAction.current = onionAnimation; // 나중에 클릭시 이어서 play하기 위해 저장
        }, 1000); // 1초
      }, 500);

      const animation = classroomActions.current["Scene"];
      animation.timeScale = 0.7;
      animation.reset().play();

      setTimeout(() => {
        activateSceneCamera(setCameraActive, setUseSceneCamera);

        setInitialCameraPose({
          position: [-95, 6, -60],
          lookAt: [-96.5, 3, -66],
          zoom: 40,
          near: -100,
          far: 50,
        });

        animateCamera({
          position: { x: -95, y: 6, z: -60 },
          lookAt: [-96.5, 3, -66],
          zoom: 50,
          duration: 3,
          near: -100,
          far: 50,
        });
      }, 200);

      setTimeout(() => {
        setTimeout(() => {
          // 2. 등장 애니메이션 (0 → 1)
          gsap.to(pptClickRef.current.scale, {
            duration: 0.5,
            x: 1,
            y: 1,
            z: 1,
            ease: "expo.out",
            onComplete: () => {
              // 3. 깜빡임 애니메이션 (0.8 ↔ 1.1 반복)
              gsap.to(pptClickRef.current.scale, {
                duration: 0.6,
                x: 0.8,
                y: 0.8,
                z: 0.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                repeatDelay: 0.1,
              });
              // → 처음 값을 0.8로 낮추는 트릭
              pptClickRef.current.scale.set(1.1, 1.1, 1.1);
            },
          });
        }, 500);
      }, 2000);
    }
  });

  useFrame((_, delta) => {
    classroomMixer.current?.update(delta);
    onionMixer.current?.update(delta);
    classroomGamzaMixer.current?.update(delta);
  });

  // ✅ 클래스룸 클릭 이벤트
  function handleClassroomClick() {
    if (slideStarted.current) return;

    slideStarted.current = true; // ✅ 클릭 순간 바로 막음

    startSlideShow();
    // 애니메이션 이어서 재생
    if (pausedGamzaAction.current && pausedOnionAction.current) {
      pausedGamzaAction.current.paused = false; // 다시 play
      pausedOnionAction.current.paused = false;
    }
  }

  const gamzaCloudPosition = useRef(new THREE.Vector3());

  // 구름 이펙트를 띄우기 전에 위치 저장
  if (classroomGamzaRef.current) {
    gamzaCloudPosition.current.copy(classroomGamzaRef.current.position);
  }

  return (
    <group ref={group}>
      {showCloudEffect && (
        <CloudEffect
          position={[-90, gamzaCloudPosition.current.y + 2, -67.8]}
          raycast={() => null}
        />
      )}

      <Onion
        ref={onionRef}
        position={[-96, 0.8, -66]}
        rotation={[0, THREE.MathUtils.degToRad(-30), 0]}
        scale={[0, 0, 0]}
        // scale={[1, 1, 1]}
        onLoaded={({ mixer, actions }) => {
          onionMixer.current = mixer;
          onionActions.current = actions;
        }}
      />

      <ClassroomGamza
        ref={classroomGamzaRef}
        position={[-95.5, 0.8, -66.3]}
        rotation={[0, THREE.MathUtils.degToRad(-30), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
          classroomGamzaMixer.current = mixer;
          classroomGamzaActions.current = actions;
        }}
      />
      <Classroom
        ref={classroomRef}
        position={[-96, 0.8, -66]}
        rotation={[0, THREE.MathUtils.degToRad(-30), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
          classroomMixer.current = mixer;
          classroomActions.current = actions;
        }}
        onClick={handleClassroomClick}
      />

      <ManualAudioPlayer
        ref={classAudioRef}
        url={CLASS_BGM_URL}
        volume={1}
        loop={false}
        position={[-96, 2, -66]}
      />
      <ManualAudioPlayer
        ref={presentAudioRef}
        url={CLASS_GAMZA_AUDIO_URL}
        volume={2}
        loop={false}
        position={[-96, 2, -66]}
      />
      <ManualAudioPlayer
        ref={bbongAudioRef}
        url={CLASS_ONION_AUDIO_URL}
        volume={1}
        loop={false}
        position={[-96, 2, -66]}
      />
      <ManualAudioPlayer
        ref={bbyongAudioRef}
        url={BBONG_AUDIO_URL}
        volume={3}
        loop={false}
        position={[-96, 2, -66]}
      />

      <mesh
        name="classroomSpot"
        ref={classroomSpotRef}
        position={ClassroomSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
          map={classTexture}
          transparent={true}
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true}
        />
      </mesh>

      <mesh
        name="pptClick"
        ref={pptClickRef}
        scale={[0, 0, 0]}
        position={pptClickMeshPosition}
        rotation={[0, -Math.PI / 13, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial
          map={pptClickTexture}
          transparent={true}
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true}
        />
      </mesh>
    </group>
  );
}
