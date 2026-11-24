import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { Scene } from "./Scene";
import "./index.css";
import styled from "styled-components";
import * as THREE from "three";
import { applyAssetStyleVariables } from "./utils/assetStyles";

/** 시작 화면의 DOM 이벤트와 3D 장면 진입 상태를 연결한다. */
const AppWithStartScreen = () => {
  const playerRef = useRef(); // 🎯 Player에 접근할 ref
  const [destination, setDestination] = useState(null); // 🎯 목적지 상태
  const [lockCamera, setLockCamera] = useState(false);

  useEffect(() => {
    const startBtn = document.getElementById("start-button");
    const startScreen = document.getElementById("start-screen");
    const bgAudio = document.getElementById("bg-audio");
    const soundStopBtn = document.getElementById("sound-on");
    const soundPlayBtn = document.getElementById("sound-off");

    const startGuide1 = document.getElementById("start-guide1");
    const startGuide2 = document.getElementById("start-guide2");
    const startGuideBtn1 = document.getElementById("start-guide-btn1");
    const startGuideBtn2 = document.getElementById("start-guide-btn2");

    const startVideo = document.getElementById("start-video");

    if (startBtn && startScreen) {
      startBtn.style.display = "none"; // 시작 버튼 없애기

      startBtn.addEventListener("click", () => {
        // 시작 버튼 누르면
        startScreen.style.display = "none"; // 시작 화면 없앰

        startVideo.muted = true;
        startVideo.volume = 0;
        startVideo.pause();

        setLockCamera(true); // 🔒 카메라 잠금

        // ✅ 감자 이동 목적지를 지금 설정

        setDestination(new THREE.Vector3(8, 0, -112));

        if (bgAudio) {
          bgAudio.volume = 0.2;
          bgAudio.play();
        }

        const endingVideo = document.getElementById("ending-video");
        if (endingVideo) {
          endingVideo.muted = false;
          endingVideo.volume = 0.8;
        }
      });
    }

    if (startGuideBtn1) {
      // 시작 가이드 버튼
      startGuideBtn1.addEventListener("click", () => {
        startGuide1.style.display = "none";
        startGuideBtn1.style.display = "none";

        startGuide2.style.display = "block";
        startGuideBtn2.style.display = "block";
      });
    }

    if (startGuideBtn2) {
      // 시작 가이드 버튼
      startGuideBtn2.addEventListener("click", () => {
        startGuide2.style.display = "none";
        startGuideBtn2.style.display = "none";

        soundStopBtn.style.display = "block"; // 🎯 씬 완전 시작
      });
    }

    const endingVideo = document.getElementById("ending-video");
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

          // 영상이 재생된 뒤 시작 버튼을 표시한다.
          setTimeout(() => {
            startBtn.style.display = "block";
            startBtn.classList.add("blinking");
          }, 11000);
        }
      });
    }
  }, []);

  return (
    <RecoilRoot>
      <Wrapper>
        <Scene
          lockCamera={lockCamera}
          playerRef={playerRef}
          destination={destination}
          setDestination={setDestination}
          onPlayerArrived={() => {
            const guide1 = document.getElementById("start-guide1");
            const guideBtn1 = document.getElementById("start-guide-btn1");
            setLockCamera(false); // 🔓 도착 후 카메라 복구
            setTimeout(() => {
              if (guide1 && guideBtn1) {
                guide1.style.display = "block";
                guideBtn1.style.display = "block";
              }
            }, 2000);
          }}
        />
      </Wrapper>
    </RecoilRoot>
  );
};

applyAssetStyleVariables();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppWithStartScreen />
  </React.StrictMode>,
);

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
