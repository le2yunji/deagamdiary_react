// PlayerController.jsx
import { useFrame } from '@react-three/fiber';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Vector3 } from 'three';
import { Player } from './Player';

const PlayerController = forwardRef(({ destination, cameraRef }, ref) => {
  const playerRef = useRef();
  const cameraOffset = new Vector3(1, 5, 5); // 감자 뒤/왼쪽 위
  const speed = 0.2;
  const isMovingRef = useRef(false);
  const currentActionRef = useRef(null);

  // 외부에서 playerRef 접근 가능하도록
  useImperativeHandle(ref, () => playerRef.current);

  useFrame(() => {
    if (!playerRef.current || !cameraRef.current) return;

    const player = playerRef.current;
    const playerPos = player.position;
    cameraRef.current.lookAt(playerPos);
    // cameraRef.current.rotation.set(-0.6, 0.7, 0);

    // 이동 처리
    if (destination) {
      const dx = destination.x - playerPos.x;
      const dz = destination.z - playerPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
    
      console.log(destination.x, destination.z)
      if (distance < 0.1) {
        if (isMovingRef.current) {
          isMovingRef.current = false;
          playAnimation(player, 'Idle');
        }
      } else {
        if (!isMovingRef.current) {
          isMovingRef.current = true;
          playAnimation(player, 'Walk');
        }

        const angle = Math.atan2(dz, dx);
        playerPos.x += Math.cos(angle) * speed;
        playerPos.z += Math.sin(angle) * speed;

        player.rotation.y = -angle - Math.PI / 2;
      }
    }

    // ✅ 카메라 위치는 감자 기준 offset으로 따라가기
    const camPos = playerPos.clone().add(cameraOffset);
    cameraRef.current.position.lerp(camPos, 0.1);

    // 감자 머리 위 이모션 오브젝트 위치도 따라감
    const emotion = player.getObjectByName('Emotion');
    if (emotion) {
      emotion.position.x = playerPos.x;
      emotion.position.z = playerPos.z;
    }
  });

  const playAnimation = (player, name) => {
    if (!player.animations) return;
    const action = player.animations[name];
    if (!action) return;

    if (currentActionRef.current !== action) {
      currentActionRef.current?.fadeOut(0.3);
      action.reset().fadeIn(0.3).play();
      currentActionRef.current = action;
    }
  };

  return <Player ref={playerRef} />;
});

export default PlayerController;
