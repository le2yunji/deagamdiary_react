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
export function appearPlayer(playerRef, targetScale = 1.2) {
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
 * 카메라 높이 복구 (Y축)
 */
export const returnCameraY = (camera) => {
  if (camera) {
    gsap.to(camera.position, {
      duration: 1,
      y: 5,
      ease: "power1.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  } else {
    console.error('downCameraY 호출 시 camera가 잘못 전달되었습니다.');
  }
};
