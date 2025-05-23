// EscalatorScene.jsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree,  } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';

import CloudEffect from '../components/CloudEffect';
import { Escalator } from "../components/Escalator";
import { useTexture } from '@react-three/drei';
import ManualAudioPlayer from '../utils/ManualAudioPlayer';

import {
  disappearPlayer,
} from '../utils/Common';

export default function EscalatorScene({
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
  const gamzaRef = useRef();
  const gamRef = useRef();

  const { scene, camera } = useThree();
  const clock = new THREE.Clock();

  const escalatorRef = useRef();
  const escalatorMixer = useRef();
  const escalatorActions = useRef();

  const escalatorSpotRef = useRef();
  const bbongAudioRef = useRef();

  const [triggered, setTriggered] = useState(false);
  const [showCloudEffect, setShowCloudEffect] = useState(false);

  const EscalatorSpotMeshPosition = new Vector3(43.5, 0.005, 120);
  const escalatorTexture = useTexture('/assets/images/houseTrigger.png');

  const hasEnded = useRef(false); // ✅ 한 번만 실행

  useEffect(() => {
    if (escalatorTexture) {
      escalatorTexture.colorSpace = THREE.SRGBColorSpace;
      escalatorTexture.anisotropy = 16;
      escalatorTexture.flipY = false;
      escalatorTexture.needsUpdate = true;
    }
  }, [escalatorTexture]);


  const gotoendAudio = document.getElementById("bg-audio2");
  const escalatorAudioRef = useRef();
       

  // ⚪️ 구름 이펙트
  const triggerCloudEffect = () => {
    setShowCloudEffect(true);
    setTimeout(() => setShowCloudEffect(false), 500);
  };

  useEffect(() => {
    if (gamzaRef.current) {
      gamzaRef.current.visible = false; // 처음엔 안 보이게
    }
    if (gamRef.current) {
        gamRef.current.visible = false; // 처음엔 안 보이게
      }
  }, []);
  

  // ✅ 플레이어 도달 → 초기 애니메이션 재생
  useFrame(() => {
    const delta = clock.getDelta();
    escalatorMixer.current?.update(delta);

    if (!triggered && playerRef.current) {
      const dist = playerRef.current.position.clone().setY(0).distanceTo(EscalatorSpotMeshPosition);

      const houseScript = document.getElementById('house-script')
      houseScript.style.display = 'none'
  
      if (dist < 50 && !triggered) {
        houseScript.style.display = 'block'
      }

      if (dist < 3.5) {
        bbongAudioRef.current?.play()

        houseScript.style.display = 'none'
        setTriggered(true);
        triggerCloudEffect()
        disappearPlayer(playerRef);
        setDisableMovement(true);
        scene.remove(scene.getObjectByName('escalatorSpot'));
        escalatorSpotRef.current.visible = false;

        if (gotoendAudio) gotoendAudio.volume = 0.15; //📢

        escalatorAudioRef.current?.play();


            setTimeout(() => {
         

                if (gamzaRef.current) {
                    gamzaRef.current.visible = true;
                    gamRef.current.visible = true;

                    gamzaRef.current.traverse(child => {
                      if (child.isMesh) {
                        child.visible = true;
                        if (child.material) {
                          child.material.opacity = 1;
                          child.material.transparent = false;
                        }
                      }
                    });

                    gamRef.current.traverse(child => {
                        if (child.isMesh) {
                          child.visible = true;
                          if (child.material) {
                            child.material.opacity = 1;
                            child.material.transparent = false;
                          }
                        }
                      });

                  }                
                const escalatorAnim = escalatorActions.current?.["Scene"]
                escalatorAnim.reset().play();
                escalatorAnim.timeScale = 0.3;
                
            }, 2500)

            // setTimeout(() => {
            //  gsap.to(gamzaRef.current.position, {
            //     duration: 4,
            //     y: 0,
            //     ease: 'steps(20)'
            //  })
            // }, 13000)

        setTimeout(() => {
          activateSceneCamera(setCameraActive, setUseSceneCamera);

          setInitialCameraPose({
            position: [28, 10, 150],
            lookAt: [27, 0, 140],
            zoom: 45,
            near: -100,  // ✅ 추가
            far: 50,    // ✅ 추가
          });

                setTimeout(() => {
                    animateCamera({
                        position: { x: 28, y: 12, z: 150},
                        lookAt: [27, 0, 140],
                        zoom: 30,
                        duration: 2,
                        near: -100,
                        far: 50,
                    });

                    setTimeout(() => {
                        animateCamera({
                            position: { x: 26, y: 8, z: 150},
                            lookAt: [27, 0, 140],
                            zoom: 40,
                            duration: 4,
                            near: -100,
                            far: 50,
                        });
                    }, 2000)

                    setTimeout(() => {
                        // gamzaRef.current.visible = false;
                        setTimeout(() => {
                            animateCamera({
                                position: { x: 34, y: 7, z: 157},// { x: 34, y: 7, z: 157},
                                lookAt: [27, 0, 140],
                                zoom: 55,
                                duration: 3,
                                near: -100,
                                far: 50,
                            });
                            
                            setTimeout(() => {
                                animateCamera({
                                    position: { x: 35, y: 8, z: 155},
                                    lookAt: [27, 0, 140],
                                    zoom: 75,
                                    duration: 3,
                                    near: -100,
                                    far: 50,
                                });
                            }, 3000)
                        }, 1000)
                    
                    }, 9000)

                }, 100)

        }, 1000)


        const endingScreen = document.getElementById('ending-screen');
        const endingVideo = document.getElementById('ending-video'); // ✅ 여기에 선언 추가!

        setTimeout(() => {
            // 🖤 화면 어두워지게 만들기
                const blackoutOverlay = document.getElementById('blackout-overlay');
                if (blackoutOverlay) {
                    blackoutOverlay.style.opacity = '1'; // 서서히 검정화
                    gotoendAudio.volume = 0
                    gotoendAudio.pause()
                }
                setTimeout(() => {
                    if (endingScreen) {
                        hasEnded.current = true; // ✅ 한 번만 실행
                        endingScreen.style.display = 'block'; // 끝 화면 보이기
                                
                            // 페이드 인 효과
                            endingScreen.classList.add('fade-in');
                
                            if (endingVideo) {
                            endingVideo.muted = false; // 혹시 모르니 재확인
                            endingVideo.play().catch((e) => {
                                console.warn('Ending video playback failed:', e);
                            });
                            }

                            setTimeout(() => {
    
                                if (endingScreen) {
                                            
                                // 페이드 인 효과
                                endingScreen.classList.add('fade-out');
                    
                                    setTimeout(() => {
                                        blackoutOverlay.style.opacity = '0.7'; // 서서히 검정화
                                        endingScreen.style.display = 'none'; // 끝 화면 보이기

                                        const endedWeb = document.getElementById('after-game')
                                        endedWeb.style.display = "block"

                                    }, 1500)
                                }
                            
                            }, 123000); // 123000
                    }
                }, 2000)
        
        }, 17000);

      }
    }
  });





  return (
    <group ref={group}>
      <Escalator
        ref={escalatorRef}
        onGamzaRef={(ref) => { gamzaRef.current = ref }}
        onGamRef={(ref) => { gamRef.current = ref }}
        position={[24, 6.2, 143]}
        rotation={[0, THREE.MathUtils.degToRad(-45), 0]}
        scale={[8, 8, 8]}
        onLoaded={({ actions, mixer }) => {
          escalatorActions.current = actions;
          escalatorMixer.current = mixer;
        }}  
        // innerWallMaterial={innerWallMaterial} // ✅ 전달
      />

        {/* <EscalatorGamza
            ref={escalatorGamzaRef}
            // onGamzaRef={(ref) => { gamzaRef.current = ref }}
            position={[24, 6.2, 143]}
            rotation={[0, THREE.MathUtils.degToRad(-45), 0]}
            scale={[0, 0, 0]}
            onLoaded={({ actions, mixer }) => {
            escalatorGamzaActions.current = actions;
            escalatorGamzaMixer.current = mixer;
            }}  
            // innerWallMaterial={innerWallMaterial} // ✅ 전달
        /> */}

      <ManualAudioPlayer
        ref={escalatorAudioRef}
        url="/assets/audio/escalatorScene.mp3"
        volume={3}
        loop={false}
        position={[30, 2, -38]}
      />


      {showCloudEffect && (
            <CloudEffect 
            position={[
            playerRef.current.position.x + 0.3, 
            playerRef.current.position.y + 2,
            playerRef.current.position.z + 0.8
            ]}
        />      
        )}
        {/* {showCloudEffect && (
        <CloudEffect
          position={[ 30, 0, 152]}
        />
      )} */}

        <ManualAudioPlayer
        ref={bbongAudioRef}
        url="/assets/audio/bbong.mp3"
        volume={3}
        loop={false}
        position={[30, 2, -38]}
      />

      <mesh
        name="escalatorSpot"
        ref={escalatorSpotRef}
        position={EscalatorSpotMeshPosition}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial  
          map={escalatorTexture}
          transparent={true}
          alphaTest={0.5}
          depthWrite={true}
          premultipliedAlpha={true} // ✅ 핵심 옵션!
          />
      </mesh>
    </group>
  );
}
