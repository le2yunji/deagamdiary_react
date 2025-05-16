// index.jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Scene } from './Scene';
import './index.css';
import styled from "styled-components";
import gsap from 'gsap';
import * as THREE from 'three'
import useCameraSwitcher from './hooks/useCameraSwitcher'; // 경로 맞게 조정

const AppWithStartScreen = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const playerRef = useRef(); // 🎯 Player에 접근할 ref
  const [destination, setDestination] = useState(null); // 🎯 목적지 상태
  const [lockCamera, setLockCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);         // 메인 카메라 활성화 여부
  const [useSceneCamera, setUseSceneCamera] = useState(false);    // 전용 카메라 활성화 여부
  const [showStartButton, setShowStartButton] = useState(false);

  const {
    sceneCameraRef,
    activateSceneCamera,
    restoreMainCamera,
    animateCamera,
    setInitialCameraPose,
    restoreMainCameraSmoothly, 
  } = useCameraSwitcher();

  const cameraRef = useRef();


  useEffect(() => {
    const startBtn = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const bgAudio = document.getElementById("bg-audio");
    const soundStopBtn = document.getElementById('sound-on');
    const soundPlayBtn = document.getElementById('sound-off');

    const startGuide1 = document.getElementById('start-guide1');
    const startGuide2 = document.getElementById('start-guide2');
    const startGuideBtn1 = document.getElementById('start-guide-btn1');
    const startGuideBtn2 = document.getElementById('start-guide-btn2');


    const startVideo = document.getElementById("start-video");

    
    if (startBtn && startScreen) {
      startBtn.style.display = 'none';  // 시작 버튼 없애기
    

      startBtn.addEventListener("click", () => { // 시작 버튼 누르면
        startScreen.style.display = "none"; // 시작 화면 없앰

        startVideo.muted = true;
        startVideo.volume = 0;
        startVideo.pause();


        setShowCanvas(true);
        setLockCamera(true); // 🔒 카메라 잠금

        // ✅ 감자 이동 목적지를 지금 설정
       
        setDestination(new THREE.Vector3(8, 0, -112));
    

        if (bgAudio) {
          bgAudio.volume = 0.2;
          bgAudio.play();
        }

        const endingVideo = document.getElementById('ending-video');
        if (endingVideo) {
          endingVideo.muted = false;
          endingVideo.volume = 1.0;
        }
      });
    }

    if (startGuideBtn1) { // 시작 가이드 버튼
      startGuideBtn1.addEventListener("click", () => {
        startGuide1.style.display = "none";
        startGuideBtn1.style.display = "none";

        startGuide2.style.display = 'block';
        startGuideBtn2.style.display = 'block';
      });
    }

    if (startGuideBtn2) { // 시작 가이드 버튼
      startGuideBtn2.addEventListener("click", () => {
        startGuide2.style.display = "none";
        startGuideBtn2.style.display = "none";

        soundStopBtn.style.display = "block"; // 🎯 씬 완전 시작
       

        // if (cameraRef.current) {
        //   const targetLookAt = playerRef.current.position.clone()
        //   cameraRef.current.lookAt(targetLookAt)
        //   cameraRef.current.updateProjectionMatrix()
        // }


        // // 3초 대기 후 부드러운 메인 카메라 전환
        // setTimeout(() => {
        //   restoreMainCameraSmoothly({
        //     mainCameraRef: cameraRef,
        //     targetPosition: new THREE.Vector3(1, 4, 5),
        //     targetLookAt: playerRef.current.position.clone(),
        //     zoom: 30,
        //     duration: 1.5,
        //     setCameraActive,
        //     setUseSceneCamera,
        //   });
        // }, 2000);
      });
    }

    const endingVideo = document.getElementById('ending-video');
    if (endingVideo) {
      endingVideo.addEventListener("play", () => {
        if (bgAudio) {
          bgAudio.pause();
          bgAudio.currentTime = 0;
        }
      });
    }

    if (soundStopBtn) {
      soundStopBtn.addEventListener("click", () => {
        bgAudio.pause();
        soundStopBtn.style.display = "none";
        soundPlayBtn.style.display = "block";
      });
    }
    if (soundPlayBtn) {
      soundPlayBtn.addEventListener("click", () => {
        bgAudio.play();
        soundPlayBtn.style.display = "none";
        soundStopBtn.style.display = "block";
      });
    }

    // 시작 전 버튼
    const beforeStartBtn = document.getElementById("start-screen-btn");
    if (beforeStartBtn) {
      beforeStartBtn.addEventListener("click", () => {
        beforeStartBtn.style.display = "none";

        if (startVideo) {
          startVideo.muted = false;
          startVideo.volume = 1.0;
          startVideo.play();

          // 10초 후 start-button 보이기 (React 상태 활용)
          setTimeout(() => {
            setShowStartButton(true);
              startBtn.style.display = "block"; // 시작 버튼 보임
              startBtn.classList.add("blinking"); // 시작 버튼 깜빡임
          }, 11000);
        }
      });
    }

  }, []);

  return (
    <RecoilRoot>
      <Wrapper>
        {/* {showCanvas &&  */}
        <Scene 
          lockCamera={lockCamera}            // ✅ 이거 반드시 필요!
          playerRef={playerRef} 
          destination={destination}
          cameraRef={cameraRef}
          setCameraActive={setCameraActive}
          setUseSceneCamera={setUseSceneCamera}
          setDestination={setDestination}
          onPlayerArrived={() => {
            const guide1 = document.getElementById('start-guide1');
            const guideBtn1 = document.getElementById('start-guide-btn1');
            setLockCamera(false); // 🔓 도착 후 카메라 복구
            setTimeout(() => {
              if (guide1 && guideBtn1) {
                guide1.style.display = 'block';
                guideBtn1.style.display = 'block';
              }
            }, 2000)
          }}
        />
        {/* } */}

      </Wrapper>
    </RecoilRoot>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithStartScreen />
  </React.StrictMode>
);

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
