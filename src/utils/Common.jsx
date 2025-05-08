// src/utils/Common.js
import { gsap } from 'gsap';
import * as THREE from 'three';

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
 * 카메라 높이 낮추기 (Y축)
 */

export const downCameraY = (camera) => {
  if (camera) {
    gsap.to(camera.position, {
      duration: 1,
      y: 3,
      ease: "power1.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  } else {
    console.error('downCameraY 호출 시 camera가 잘못 전달되었습니다.');
  }
};

/**
 * 카메라 높이 복구 (Y축)
 */
// export function returnCameraY(cameraRef, targetY = 5, duration = 1) {
//   if (!cameraRef.current) return;
//   gsap.to(cameraRef.current.position, {
//     duration,
//     y: targetY,
//   });
// }

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

/*
  모델 등장 시 Y 위치 애니메이션
*/
export function moveModelYPosition(refOrObj, newY, duration = 0.5) {
  const target = refOrObj?.current ?? refOrObj;
  if (!target) return;
  target.visible = true;
  gsap.to(target.position, {
    y: newY,
    duration,
    ease: 'bounce.inOut',
  });
}


///////// 지워야 할 부분. 오류땜에 임시로 놔둠 ///////////////////
/**
 * 마우스 이벤트 등록 및 해제 유틸
 */
export function enableMouseEvents() {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.pointerEvents = 'auto';
    console.log('✅ 마우스 입력 활성화');
  }
}

export function disableMouseEvents() {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.pointerEvents = 'none';
    console.log('🛑 마우스 입력 비활성화');
  }
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


  //////////////////
  
  // 감자 이동만 막기 위한 이벤트 제거
export function disablePlayerControlEvents() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  canvas.removeEventListener('mousedown', handlePlayerMove); // 👈 이동 관련 이벤트만 제거
  canvas.removeEventListener('touchstart', handleTouchMove);
}

// 다시 등록
export function enablePlayerControlEvents() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  canvas.addEventListener('mousedown', handlePlayerMove);
  canvas.addEventListener('touchstart', handleTouchMove);
}

// 아래는 감자 이동을 실제 담당하는 함수
function handlePlayerMove(e) {
  console.log('감자 이동 🥔', e.clientX, e.clientY);
}

function handleTouchMove(e) {
  console.log('감자 터치 이동', e.touches[0].clientX, e.touches[0].clientY);
}

// ⬇️⬇️⬇️ 화살표 인터랙션
/**
 * 🧭 사용자 인터랙션 유도 화살표 생성 유틸
 */

// ✅ utils/Common.js (추가된 부분)

let arrowMeshInstances = [];

export function createArrows(scene, arrowInfos) {
  const texture = new THREE.TextureLoader().load('/assets/images/arrow.webp');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.5,
  });

  arrowMeshInstances = arrowInfos.map(info => {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(info.x, info.y, info.z);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(info.rotationX),
      THREE.MathUtils.degToRad(info.rotationY),
      0
    );
    mesh.visible = false;
    mesh.originalY = info.y;
    mesh.originalZ = info.z;
    scene.add(mesh);
    return mesh;
  });
}

export function showArrow(index, elapsedTime) {
  arrowMeshInstances.forEach((arrow, i) => {
    arrow.visible = i === index;
    if (arrow.visible) {
      arrow.position.y = arrow.originalY + Math.sin(elapsedTime * 3) * 0.5;
      arrow.position.z = arrow.originalZ - Math.sin(elapsedTime * 3) * 0.5;
    }
  });
}

export function hideAllArrows() {
  arrowMeshInstances.forEach(arrow => (arrow.visible = false));
}
