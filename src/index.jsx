// src/index.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import './index.css';
import Scene from './Scene';
import styled from "styled-components"; // ✅ 올바른 스타일 임포트

const AppWithStartScreen = () => {
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const startBtn = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const bgAudio = document.getElementById("bg-audio");

    if (startBtn && startScreen) {
      setTimeout(() => {
        startBtn.style.display = "block";
      }, 10000);

      startBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        setShowCanvas(true); // 🎯 버튼 클릭 시 캔버스 렌더 시작
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
    } else {
      console.error("시작 버튼 또는 시작 화면 요소를 찾을 수 없습니다.");
    }
// 엔딩 비디오가 시작되면 배경 음악 멈추기
const endingVideo = document.getElementById('ending-video');
if (endingVideo) {
  endingVideo.addEventListener("play", () => {
    // 엔딩 비디오가 재생되기 시작하면 배경 음악 멈추기
    if (bgAudio) {
      bgAudio.pause();
      bgAudio.currentTime = 0; // 음악을 처음부터 멈추도록 설정
    }
  });
}



  }, []);

  
  return (
    <RecoilRoot>
      <Wrapper>
      {showCanvas && <Scene />} {/* ✅ 클릭 후에만 Canvas 생성 */}
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
`