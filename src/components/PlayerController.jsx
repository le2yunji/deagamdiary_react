// PlayerController.jsx
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Vector3 } from 'three';
import { Player } from './Player';
import { PositionalAudio } from '@react-three/drei';

const PlayerController = forwardRef(({ destination, cameraRef, disableMovement = false }, ref) => {
  const playerRef = useRef();
  const cameraOffset = new Vector3(1, 4, 5); // 감자 뒤/왼쪽 위
  const speed = 0.25;
  const isMovingRef = useRef(false);
  const currentActionRef = useRef(null);
  const walkAudioRef = useRef();

  // 외부에서 playerRef 접근 가능하도록
  useImperativeHandle(ref, () => playerRef.current);
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  }, []);

  useFrame(() => {
    if (!playerRef.current || !cameraRef.current) return;

    const player = playerRef.current;
    const playerPos = player.position;
    cameraRef.current.lookAt(playerPos);
    // cameraRef.current.rotation.set(-0.6, 0.7, 0);


    
    if (disableMovement) {
      // 감자 이동 막기 (Idle로 고정)
      if (isMovingRef.current) {
        isMovingRef.current = false;
        playAnimation(playerRef.current, 'Idle');
      }
      return;
    }

    // 이동 처리
    if (destination) {
      const dx = destination.x - playerPos.x;
      const dz = destination.z - playerPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
    
      // 😀😀
      console.log(destination.x, destination.z)

      if (distance < 0.1) {
        if (isMovingRef.current) {
          isMovingRef.current = false;
          playAnimation(player, 'Idle');
            
    // // 🔇 걷기 멈추면 소리 정지
    // if (walkAudioRef.current) {
    //   walkAudioRef.current.pause();
    // }
        }
      } else {
        if (!isMovingRef.current) {
          isMovingRef.current = true;
          playAnimation(player, 'Walk');
          // 🔊 걷기 시작하면 소리 재생
            // if (walkAudioRef.current) {
            //   walkAudioRef.current.setVolume(0.7);
            //   walkAudioRef.current.play();
            // }
        }

        // 🔽 여기에 추가: 너무 가까운 경우 이동 생략
        if (distance < speed) {
        playerPos.x = destination.x;
        playerPos.z = destination.z;
        return;
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

    // // 감자 머리 위 이모션 오브젝트 위치도 따라감
    // const emotion = player.getObjectByName('Emotion');
    // if (emotion) {
    //   emotion.position.x = playerPos.x;
    //   emotion.position.y = 5
    //   emotion.position.z = playerPos.z;
    // }
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


 
  return (
    <Player ref={playerRef}>
    {/* <PositionalAudio
      ref={walkAudioRef}
      url="/assets/audio/walk_sound.mp3"
      position={[0,0 ,0]}
      distance={50}
      refDistance={1}
      rolloffFactor={1}
      loop
      volume={0.7}
    /> */}

    </Player>
  );;
});

export default PlayerController;
