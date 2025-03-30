// src/utils/Common.js
import { gsap } from 'gsap';

/**
 * 감자(player) 사라지기 애니메이션
 */
export function disappearPlayer(playerRef) {
  if (!playerRef.current) return;
  gsap.to(playerRef.current.scale, {
    duration: 0.1,
    x: 0,
    y: 0,
    z: 0,
    ease: 'bounce.inOut',
  });
}

/**
 * 감자(player) 나타나기 애니메이션
 */
export function appearPlayer(playerRef, targetScale = 0.8) {
  if (!playerRef.current) return;
  gsap.to(playerRef.current.scale, {
    duration: 0.4,
    x: targetScale,
    y: targetScale,
    z: targetScale,
    ease: 'expo.easeOut',
  });
}

/**
 * 카메라 높이 낮추기 (Y축)
 */
export function downCameraY(cameraRef, targetY = 3, duration = 0.05) {
  if (!cameraRef.current) return;
  gsap.to(cameraRef.current.position, {
    duration,
    y: targetY,
  });
}

/**
 * 카메라 높이 복구 (Y축)
 */
export function returnCameraY(cameraRef, targetY = 5, duration = 1) {
  if (!cameraRef.current) return;
  gsap.to(cameraRef.current.position, {
    duration,
    y: targetY,
  });
}

/**
 * 모델 등장 시 Y 위치 애니메이션
 */
export function moveModelYPosition(ref, newY, duration = 0.5) {
  if (!ref?.current) return;
  ref.current.visible = true;
  gsap.to(ref.current.position, {
    y: newY,
    duration,
    ease: 'bounce.inOut',
  });
}


/**
 * 마우스 이벤트 등록 및 해제 유틸
 */
export function enableMouseEvents(canvas) {
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
  }
  
  export function disableMouseEvents(canvas) {
    if (!canvas) return;
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('touchstart', handleTouchStart);
  }
  
  // 내부 이벤트 핸들러 (예시)
  function handleMouseDown(e) {
    // 구현 필요 시 여기에 콜백 연결
    console.log('🖱 Mouse down:', e.clientX, e.clientY);
  }
  
  function handleTouchStart(e) {
    if (e.touches.length > 0) {
      console.log('👆 Touch start:', e.touches[0].clientX, e.touches[0].clientY);
    }
  }
  