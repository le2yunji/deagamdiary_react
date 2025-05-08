// 생략된 import 포함
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import {
  PointLight, DirectionalLight,
  Vector3,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  Raycaster,
  Clock
} from 'three';

import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  disappearPlayer,
  appearPlayer,
  createArrows,
  showArrow,
  hideAllArrows,
  animateArrows,
  setDisableMovement,
} from '../utils/Common';

import CloudEffect from '../components/CloudEffect';
import { Classroom } from '../components/Classroom';
import { Timeline } from 'gsap/gsap-core';
import { useScroll } from '@react-three/drei';
import { Onion } from '../components/Onion';
import { ClassroomGamza } from '../components/ClassroomGamza';

const slidePaths = [
  '/assets/images/ppt1.webp',
  '/assets/images/ppt2.webp',
  '/assets/images/ppt3.webp',
  '/assets/images/ppt4.webp',
  '/assets/images/ppt5.webp',
];
const talkPaths = [
  '/assets/images/talk1.webp',
  '/assets/images/talk2.webp',
  '/assets/images/talk3.webp',
  '/assets/images/talk4.webp',
];
// 화살표 위치
const arrowInfos = [
  { x: -93, y: 3, z: -69, rotationX: -40, rotationY: 0 , rotationZ: 30,}, // 슬라이드
  // { x: -89, y: 6.2, z: -65, rotationX: -10, rotationY: 8 } // 감자
];

let timeline;

export default function ClassroomScene({ 
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
  const { scene, gl, camera } = useThree();
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


  const classroomPointLightRef = useRef();
  const classroomDirectionalLightRef = useRef();
  const classroomSunLightRef = useRef();

  const loader = new TextureLoader();
  const ClassroomSpotMeshPosition = new Vector3(-99, 0.005, -70);
  const talkInterval = useRef(null);
  const [showCloudEffect, setShowCloudEffect] = useState(false);
  // const [triggered, setTriggered] = useState(false);
  const [slides, setSlides] = useState([]);
  const [talks, setTalks] = useState([]);
  const [timerMesh, setTimerMesh] = useState(null);
  const clock = useRef(new Clock()).current;
  const [showGamzaArrow, setShowGamzaArrow] = useState(false);
  const slideStarted = useRef(false)
  const bgAudio = document.getElementById("bg-audio");


  const cloudRef = useRef()

  useEffect(() => {
    if (cloudRef.current) {
      // 중심에서 커지게 하기 위해 초기 스케일을 0으로 설정
      cloudRef.current.scale.set(0, 0, 0)

      // gsap으로 스케일 애니메이션
      gsap.to(cloudRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      })
      cloudRef.current.raycast = () => null  // raycaster 무시
      cloudRef.current.renderOrder = -1;               // 🎯 먼저 그리기
        // ✅ 항상 맨 위에 그리도록 설정
        cloudRef.current.renderOrder = 999
    if (cloudRef.current.material) {
      cloudRef.current.material.depthWrite = false
      cloudRef.current.material.transparent = true
    }
    }
  }, [])




  // 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 1000);
  };

  useEffect(() => {
    createArrows(scene, arrowInfos);
    hideAllArrows()
    // showArrow(0); // ppt 위 화살표 표시
  }, []);

  // 피피티, 슬라이드 
    useEffect(() => {
      const geometry = new PlaneGeometry(10, 5.7);
      setSlides(
        slidePaths.map((path, i) => {
          const mat = new MeshBasicMaterial({ transparent: true, opacity: 0 });
          const mesh = new Mesh(geometry, mat);
          mesh.rotation.y = THREE.MathUtils.degToRad(-30);
          mesh.position.set(-92, 6.55, -70); // ppt 위치
          // mesh.scale.set(1.3, 1.25, 1.3);
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
        })
      );
    }, []);


  // 발표 말풍선 💬
  useEffect(() => {
    const geometry = new PlaneGeometry(2, 2);
    setTalks(
      talkPaths.map((path) => {
        const mat = new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 });
        const mesh = new Mesh(geometry, mat);
        mesh.position.set(-87, 5.8, -65); // 말풍선 위치
        mesh.rotation.set(THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(8), 0);
        mesh.visible = false;
        loader.load(path, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
        });
        scene.add(mesh);
        return mesh;
      })
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
    animateTalkBubbles();
    let index = 0;
    hideAllArrows();

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
          // ✅ 마지막 슬라이드면 fade-out 하지 않고 유지
          // if (index === slides.length - 1) {
          //   return;
          // }
          slideStarted.current = true // 슬라이드 시작됨

          gsap.to(slide.material, {
            opacity: 0,
            delay: 3,
            duration: 0.5,
            onComplete: () => {
              index++; //
              if(index == 4) {
                stopTalkBubbles();
              }
              if (index >= slides.length) {
                hideAllArrows();
                triggerCloudEffect()
                gsap.to(classroomGamzaRef.current.position, { 
                  x: -90,
                  y: 2,
                  z: -68, 
                  duration: 0.3, 
                  ease: "power3.inOut" 
                });
                              
                gsap.to(classroomGamzaRef.current.scale, {
                  x: 0, y: 0, z: 0, 
                  duration: 0.3,
                  ease: "power3.inOut"
                });

                const onionAnimation = onionActions.current["Scene"]
                onionAnimation.timeScale = 0.65;
                onionAnimation.play()
                
                setTimeout(() => {
                  animateCamera({
                    position: { x: -95, y: 8, z: -60},
                    lookAt: [-99, 4, -68],
                    zoom: 68,
                    duration: 1,
                    near: -100,
                    far: 50,
                  });
                  setTimeout(() => {
                    animateCamera({
                      position: { x: -95, y: 7, z: -60},
                      lookAt: [-99, 4, -68],
                      zoom: 76,
                      duration: 3,
                      near: -100,
                      far: 50,
                    });
                  }, 1000) 
                }, 500)
             

                  restorePlayerAfterClass()

                  setTimeout(() => {
                    restoreMainCamera(setCameraActive, setUseSceneCamera);
                  }, 5000)    

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

    playerRef.current.visible = true;
    playerRef.current.position.set(-82, 0, -33);
    playerRef.current.scale.set(0.3, 0.3, 0.3);
    appearPlayer(playerRef, 1.2);
    setCameraTarget(new Vector3(-82, 0, -25.3));
    setDisableMovement(false);

    if (bgAudio) bgAudio.play(); //📢
  };

  const elapsedTime = clock.getElapsedTime()

  const triggered = useRef(false); // ✅ 상태를 즉시 바꾸고 반영되도록
  const Entered = useRef(false); 
  const pausedGamzaAction = useRef(null); // 👉 현재 일시정지한 액션 저장용
  const pausedOnionAction = useRef(null); // 👉 현재 일시정지한 액션 저장용

  // ✅ 클래스룸 스팟 매쉬 도달 시 / 시작
  useFrame(() => {
    if (!playerRef.current || triggered.current) return;
    
      const dist = playerRef.current.position.clone().setY(0).distanceTo(ClassroomSpotMeshPosition);
      if (dist < 1.5 && !triggered.current) {

        // Entered.current = true
        if (bgAudio) bgAudio.pause(); //📢

        // setTriggered(true)
        triggered.current = true; // 👈 즉각 변경됨
        disappearPlayer(playerRef);
        triggerCloudEffect()
        setDisableMovement(true);
        scene.remove(scene.getObjectByName('classroomSpot'));
        if (classroomSpotRef.current) classroomSpotRef.current.visible = false;

        gsap.to(classroomRef.current.scale, { 
          x: 5.5, 
          y: 5.5, 
          z: 5.5, 
          duration: 0.3, 
          ease: "power3.inOut" 
        });

        setTimeout(() => {
          gsap.to(classroomGamzaRef.current.scale, { 
            x: 5.6, 
            y: 5.6, 
            z: 5.6, 
            duration: 0.3, 
            ease: "power3.inOut" 
          });
          gsap.to(onionRef.current.scale, { 
            x: 5.6, 
            y: 5.6, 
            z: 5.6, 
            duration: 0.3, 
            ease: "power3.inOut" 
          });
          
          const onionAnimation = onionActions.current["Scene"]
          onionAnimation.timeScale = 0.65;
          onionAnimation.reset().play()
    
          const gamzaAnimation = classroomGamzaActions.current["Scene"]
          gamzaAnimation.timeScale = 0.65;
          gamzaAnimation.reset().play()

          // 🔥 1초 동안 재생하고 pause
          setTimeout(() => {
            gamzaAnimation.paused = true; // stop()❌ pause()⭕
            pausedGamzaAction.current = gamzaAnimation; // 나중에 클릭시 이어서 play하기 위해 저장

            onionAnimation.paused = true; // stop()❌ pause()⭕
            pausedOnionAction.current = onionAnimation; // 나중에 클릭시 이어서 play하기 위해 저장

          }, 1000); // 1초

        }, 500)

        const animation = classroomActions.current["Scene"]
        animation.timeScale = 0.7;
        animation.reset().play()

        setTimeout(() => {
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [-95, 6, -60],
            lookAt: [-96.5, 3, -66],
            zoom: 30,
            near: -100,  // ✅ 추가
            far: 50,    // ✅ 추가
          });

          animateCamera({
            position: { x: -95, y: 6, z: -60},
            lookAt: [-96.5, 3, -66],
            zoom: 50,
            duration: 3,
            near: -100,
            far: 50,
          });

        }, 200)

        setTimeout(() => {
          setTimeout(() => {
            showArrow(0, elapsedTime); // 🔥 PPT 화살표 표시
          }, 500)
        }, 2000);
      
      }
    }
  );

  useFrame((_, delta) => {
    classroomMixer.current?.update(delta);
    onionMixer.current?.update(delta);
    classroomGamzaMixer.current?.update(delta);
  });

  // ✅ 클래스룸 클릭 이벤트 
  function handleClassroomClick() {
    hideAllArrows();
    startSlideShow();

    // 애니메이션 이어서 재생
    if (pausedGamzaAction.current && pausedOnionAction.current ) {
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
          position={[
            -90,
            gamzaCloudPosition.current.y + 2,
            -67.5,
          ]}
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
        // onClick={() => {
        //   console.log(!showGamzaArrow)
        //   if (!showGamzaArrow) return;
        //   console.log('감자클릭')
        //   setShowGamzaArrow(false);
        //   hideAllArrows();

        //   const hiAction = classroomGamzaActions.current?.["Hello"];
        //   if (hiAction) {
        //     hiAction.reset().play();
        //     hiAction.clampWhenFinished = true;
        //     hiAction.loop = THREE.LoopOnce;
        //     hiAction.getMixer().addEventListener('finished', () => {
        //       restorePlayerAfterClass();
        //     });
        //   } else {
        //     restorePlayerAfterClass(); // fallback
        //   }

        //   classroomGamzaRef.current.visible = false;
        // }}
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
        onClick={ handleClassroomClick }
      />

      <mesh
        name="classroomSpot"
        ref={classroomSpotRef}
        position={ClassroomSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="skyblue" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}
