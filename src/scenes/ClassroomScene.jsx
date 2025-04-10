// 생략된 import 포함
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import {
  PointLight, DirectionalLight, RectAreaLight,
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
  setDisableMovement
} from '../utils/Common';

import CloudEffect from '../components/CloudEffect';
import { Classroom } from '../components/Classroom';
import { ClassroomGamza } from '../components/ClassroomGamza';
import { Onion } from '../components/Onion';
// import { Classmate } from '../components/Classmate';

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
  { x: -91.5, y: 14, z: -70, rotationX: -10, rotationY: 8 }, // 슬라이드
  { x: -89, y: 6.2, z: -65, rotationX: -10, rotationY: 8 } // 감자
];

export default function ClassroomScene({ playerRef, emotionRef, setCameraTarget, setDisableMovement }) {
  const { scene, gl, camera } = useThree();
  const group = useRef();
  const classroomRef = useRef();
  const classroomGamzaRef = useRef();
  const onionRef = useRef();
  const classroomSpotRef = useRef();

  const classroomGamzaActions = useRef();
  const onionActions = useRef();
  const classroomActions = useRef();

  const classroomGamzaMixer = useRef();
  const onionMixer = useRef();
  const classroomMixer = useRef();


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


  useEffect(() => {
    if (classroomRef.current) {
      classroomRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      classroomGamzaRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      onionRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      // classmateRef.current.traverse((child) => {
      //   if (child.isMesh) {
      //     child.castShadow = true;
      //   }
      // });
    }
  }, []);

  // 조명💡
  useEffect(() => {
    const classroomPointLight = new PointLight('white', 30, 80, 1.5);
    classroomPointLight.position.set(-98, 10, -78);
    classroomPointLight.castShadow = true;
    classroomPointLight.shadow.mapSize.set(1024, 1024);
    classroomPointLight.shadow.camera.near = 1;
    classroomPointLight.shadow.camera.far = 5;
    classroomPointLightRef.current = classroomPointLight;

    const classroomDirectionalLight = new DirectionalLight('white', 1);
    classroomDirectionalLight.position.set(-99, 5, -71);
    classroomDirectionalLight.rotation.y = THREE.MathUtils.degToRad(70)
    classroomDirectionalLight.target.position.set(-101, 2, -74);
    classroomDirectionalLight.castShadow = true;
    classroomDirectionalLight.shadow.mapSize.set(1024, 1024);
    classroomDirectionalLight.shadow.camera.near = 1;
    classroomDirectionalLight.shadow.camera.far = 5;
    classroomDirectionalLightRef.current = classroomDirectionalLight;

    // const classroomSunLight = new RectAreaLight('#FFF8DA', 3, 12, 5)
    // classroomSunLight.position.set(-111, 5, -75);  
    // classroomSunLight.rotation.x = THREE.MathUtils.degToRad(-90)
    // classroomSunLight.castShadow = true;
    // classroomSunLightRef.current = classroomSunLight;
  }, []);


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
        mesh.position.set(-92.3, 6.05, -69.3);
        // mesh.scale.set(1.3, 1.25, 1.3);
        mesh.visible = false;
        loader.load(path, (tex) => {
          mat.colorSpace = THREE.SRGBColorSpace;
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
        mesh.position.set(-87, 5, -65);
        mesh.rotation.set(THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(8), 0);
        mesh.visible = false;
        loader.load(path, (tex) => {
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
  clearInterval(talkInterval.current);
  talks.forEach((talk) => (talk.visible = false));
};

  

const startSlideShow = () => {
  if (!slides.length) return; // ✅ 슬라이드가 로딩되지 않으면 무시

  let index = 0;
  const animateSlide = () => {
    const slide = slides[index];
    if (!slide) return; // ✅ 안전하게 null check

    slides.forEach((s) => {
      if (s) s.visible = false;
    });

    slide.visible = true;
    slide.material.opacity = 0;

    gsap.to(slide.material, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        if (index >= slides.length - 1) {
          setShowGamzaArrow(true);
          hideAllArrows()
          // showArrow(1); // 🔥 감자 머리 위 화살표
          stopTalkBubbles(); // 말풍선 중지
          // return;
          classroomGamzaActions.current?.["Hello"].reset().play()
          setTimeout(() => restorePlayerAfterClass(), 5000)
        }

        gsap.to(slide.material, {
          opacity: 0,
          delay: 2,
          duration: 0.5,
          onComplete: () => {
            index++;
            animateSlide();
          },
        });
      },
    });
  };

  animateSlide();
};
  


// ✅ 클래스룸 인터랙션 끝 완료
const restorePlayerAfterClass = () => {

  gsap.to(camera,{
    duration: 1, 
    zoom: 30,
    ease: "power3.out",
    onUpdate: () => camera.updateProjectionMatrix(),
  })
  gsap.to(camera.position,{
    duration: 1, 
    y: 5,
    ease: "power3.out",
    onUpdate: () => camera.updateProjectionMatrix(),
  })

  setTimeout(() => {
    if (classroomGamzaRef.current) {
      gsap.to(classroomGamzaRef.current.position, {
        y: 3, duration: 1, ease: "expo.inOut"
      });
      gsap.to(classroomGamzaRef.current.scale, {
        x: 0, y: 0, z: 0, duration: 1, ease: "expo.inOut"
      });
    }
  }, 500)

  playerRef.current.visible = true;
  playerRef.current.position.set(-92, 0.3, -56);
  playerRef.current.scale.set(0.3, 0.3, 0.3);
  appearPlayer(playerRef, 1.2);
  setCameraTarget(new Vector3(-89, 0, -49));
  setDisableMovement(false);

  // if (bgAudio) bgAudio.play(); //📢

};

// 슬라이드 인터랙션
useEffect(() => {
  const raycaster = new Raycaster();
  const handleClick = (e) => {
    const mouse = {
      x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
    };
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      [classroomRef.current, ...slides],
      true
    );

    // const intersectsGamza = raycaster.intersectObject(classroomGamzaRef.current, true);

    if (intersects.length > 0 && !slideStarted.current) {
      slideStarted.current = true;
      hideAllArrows();
      startSlideShow();
      animateTalkBubbles(); // 말풍선 시작
    }

    // if (intersectsGamza.length > 0 && showGamzaArrow) {
    //   setShowGamzaArrow(false);
    //   hideAllArrows();
    //   classroomGamzaRef.current.visible = false;
    //   restorePlayerAfterClass();
    // }
  };

  gl.domElement.addEventListener('click', handleClick);
  return () => gl.domElement.removeEventListener('click', handleClick);
}, [slides, showGamzaArrow]);

const elapsedTime = clock.getElapsedTime()
// const triggered = useRef(false); // 👈 변경 (useRef로 변경)



const triggered = useRef(false); // ✅ 상태를 즉시 바꾸고 반영되도록


// ✅ 클래스룸 스팟 매쉬 도달 시 / 시작
useFrame(() => {
  if (!playerRef.current || triggered.current) return;
   
    const dist = playerRef.current.position.clone().setY(0).distanceTo(ClassroomSpotMeshPosition);
    if (dist < 1.5) {

      // if (bgAudio) bgAudio.pause(); //📢

      // setTriggered(true)
      triggered.current = true; // 👈 즉각 변경됨
      disappearPlayer(playerRef);
      setDisableMovement(true);
      scene.remove(scene.getObjectByName('classroomSpot'));
      if (classroomSpotRef.current) classroomSpotRef.current.visible = false;

      gsap.to(classroomRef.current.scale, { x: 5.5, y: 5.5, z: 5.5, duration: 0.3, ease: "power3.inOut" });


      
      classroomActions.current?.["Scene"].reset().play()

      setTimeout(() => {
        // 조명 추가
        if (classroomPointLightRef.current) scene.add(classroomPointLightRef.current);
        if (classroomDirectionalLightRef.current) scene.add(classroomDirectionalLightRef.current);
        if (classroomSunLightRef.current) scene.add(classroomSunLightRef.current);

        // onionRef.current.visible = true;
        gsap.to(onionRef.current.position, { y: 0.3, duration: 0.3, ease: "bounce.inOut" });
        gsap.to(onionRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: "power3.inOut" });

        onionActions.current?.["Idle"].reset().play()

        gsap.to(camera,{
          duration: 1, 
          zoom: 45,
          ease: "power3.out",
          onUpdate: () => camera.updateProjectionMatrix(),
        })
        gsap.to(camera.position,{
          duration: 1, 
          // x: -95,
          y: 3, 
          // z: 5.5,
          ease: "expo.inOut",
          onUpdate: () => {
            camera.updateProjectionMatrix();
          },        
        })
      }, 500);


      // 양파 교수
// 1. Idle 관망
// 2. Nope 절레절레
// 3. idle 눈썹만
// 4. NopeFace 눈썹 눈감기

// 감자
// 1. HeadTurn 양파교수 보기
// 2. Hello 인사
// 3. Shiver 떨기
// 4. Blink 끔뻑끔뻑
// 5. Closed 눈 감기
// 6. Closing / \

      setTimeout(() => {
        setShowCloudEffect(true);
        gsap.to(classroomGamzaRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        classroomGamzaActions.current?.["Shiver"].reset().play()
        classroomGamzaActions.current?.["Blink"].reset().play()
        setTimeout(() => {
          showArrow(0, elapsedTime); // 🔥 PPT 화살표 표시
        }, 500)
      }, 2000);

      setTimeout(() => setShowCloudEffect(false), 2500); // 구름 이펙트

      setTimeout(() => {
        classroomGamzaActions.current?.["Shiver"].stop()
        classroomGamzaActions.current?.["HeadTurn"].reset().play()

        onionActions.current?.["Idle"].reset().play()
        onionActions.current?.["idle"].reset().play()
      }, 5000)

      setTimeout(() => {
        classroomGamzaActions.current?.["HeadTurn"].stop()
        onionActions.current?.["Idle"].stop()
        classroomGamzaActions.current?.["Shiver"].reset().play()

        onionActions.current?.["Nope"].reset().play()
        classroomGamzaActions.current?.["Closing"].reset().play()
      }, 7000)
      
      setTimeout(() => {
        onionActions.current?.["Nope"].stop()
        onionActions.current?.["NopeFace"].reset().play()

      }, 10000)

      // setTimeout(() => restorePlayerAfterClass(), 20000)
    }
  }
);

useFrame((_, delta) => {
  classroomGamzaMixer.current?.update(delta);
  classroomMixer.current?.update(delta);
  onionMixer.current?.update(delta);
});

  return (
    <group ref={group}>
      {showCloudEffect && classroomGamzaRef.current && (
        <CloudEffect
          position={[
            classroomGamzaRef.current.position.x,
            classroomGamzaRef.current.position.y + 4,
            classroomGamzaRef.current.position.z,
          ]}
          raycast={() => null} // 이벤트 차단 방지
        />
      )}
      {/* 감자 애니메이션 이름 */}
      {/* 1. HeadTurn
          2. Hello
          3. Shiver
          4. Blink
          5. Closed
          6. Closing */}

      <Classroom
        ref={classroomRef}
        position={[-96.5, 0, -66]}
        rotation={[0, THREE.MathUtils.degToRad(-30), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
          classroomMixer.current = mixer;
          classroomActions.current = actions;
        }}        
        // onClick={() => {console.log(`click`)}}
      />

      
      <ClassroomGamza
        ref={classroomGamzaRef}
        position={[-89.5, 0.5, -65]}
        rotation={[0, THREE.MathUtils.degToRad(180), 0]}
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

      <Onion
        ref={onionRef}
        position={[-99.5, 3, -67.5]}
        rotation={[0, THREE.MathUtils.degToRad(45), 0]}
        scale={[0, 0, 0]}
        onLoaded={({ mixer, actions }) => {
          onionMixer.current = mixer;
          onionActions.current = actions;
        }}      
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
