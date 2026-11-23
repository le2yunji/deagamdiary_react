// PlayerController.jsx
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Vector3, MathUtils, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, AudioListener, Audio, AudioLoader  } from 'three';
import { Player } from './Player';
import useKeyboardControls from '../hooks/useKeyboardControls';
import * as THREE from 'three'
import { gsap } from 'gsap';
import { getAssetUrl } from '../utils/assetUrl';

const textureLoader = new TextureLoader();
const WALK_SOUND_URL = getAssetUrl('/assets/audio/walk_sound.mp3');
const FOOTPRINT_TEXTURE_URL = getAssetUrl('/assets/images/footprint.webp');

/** 플레이어 이동·애니메이션·카메라 추적·발자국 효과를 함께 제어한다. */
const PlayerController = forwardRef(({  lockCamera, destination, cameraRef, disableMovement = false, scene }, ref) => {
  const playerRef = useRef();
  const cameraOffset = new Vector3(1, 3, 5);
  const speed = 0.25;
  const isMovingRef = useRef(false);
  const currentActionRef = useRef(null);
  const lastInputRef = useRef("none");
  const prevDestinationRef = useRef(null);
  const audioListenerRef = useRef(new AudioListener());
  const audioLoaderRef = useRef(new AudioLoader());
  const actionsRef = useRef(null); // 💡 actions를 저장할 ref

  // 👣 발자국 관련 상태
  const footprints = useRef([]);
  const footprintDistanceThreshold = 1.2;
  const lastFootprintPosition = useRef(new Vector3());
  const isLeftFoot = useRef(true);

  // useImperativeHandle(ref, () => playerRef.current);


  useImperativeHandle(ref, () => ({
    ...playerRef.current,
    animations: actionsRef.current, // ✅ 안전하게 전달
  }));

  
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
    }
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.add(audioListenerRef.current);
    }
  }, [cameraRef]);
  
  const directionRef = useKeyboardControls((dir) => {
    const isKeyPressed = Object.values(dir).some(Boolean);
    if (isKeyPressed) lastInputRef.current = "keyboard";
  });

  useEffect(() => {
    const changed = destination && (!prevDestinationRef.current || destination.x !== prevDestinationRef.current.x || destination.z !== prevDestinationRef.current.z);
    if (changed) {
      lastInputRef.current = 'mouse';
      prevDestinationRef.current = destination;
    }
  }, [destination]);

  useFrame(() => {
    if (!playerRef.current || !cameraRef.current) return;

    const player = playerRef.current;
    const playerPos = player.position;
    const dir = directionRef.current;
    const moveVec = new Vector3();

    if (!disableMovement) {
      if (dir.forward) moveVec.z -= 1;
      if (dir.backward) moveVec.z += 1;
      if (dir.left) moveVec.x -= 1;
      if (dir.right) moveVec.x += 1;
    }

    const hasMoved = moveVec.length() > 0;

    if (hasMoved) {
      moveVec.normalize().multiplyScalar(speed);
      playerPos.add(moveVec);

      playerPos.x = Math.max(-150, Math.min(150, playerPos.x));
      playerPos.z = Math.max(-150, Math.min(150, playerPos.z));

      const angle = Math.atan2(moveVec.z, moveVec.x);
      player.rotation.y = -angle - Math.PI / 2;
      leaveFootprint(player);
      playAnimation(player, "Walk");
      isMovingRef.current = true;
    } else if (destination && lastInputRef.current !== "keyboard" && !disableMovement) {
      const dx = destination.x - playerPos.x;
      const dz = destination.z - playerPos.z;
      console.log(destination.x, destination.z)

      
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance < 0.1) {
        playAnimation(player, "Idle");
        isMovingRef.current = false;
      } else {
        const angle = Math.atan2(dz, dx);
        if (distance < speed) {
          playerPos.x = destination.x;
          playerPos.z = destination.z;
        } else {
          playerPos.x += Math.cos(angle) * speed;
          playerPos.z += Math.sin(angle) * speed;
        }
        // ▶ 제한 추가
        playerPos.x = Math.max(-150, Math.min(150, playerPos.x));
        playerPos.z = Math.max(-150, Math.min(150, playerPos.z));

        player.rotation.y = -angle - Math.PI / 2;
        leaveFootprint(player);
        playAnimation(player, "Walk");
        isMovingRef.current = true;
      }
    } else {
      if (isMovingRef.current) {
        playAnimation(player, "Idle");
        isMovingRef.current = false;
      }
    }

      const camPos = playerPos.clone().add(cameraOffset);
      cameraRef.current.position.lerp(camPos, 0.1);
      cameraRef.current.lookAt(playerPos);


    // fadeOutFootprints();
  });

  const playAnimation = (player, name) => {
    if (!player.animations) return;
    const action = player.animations[name];
    if (!action) return;
    if (currentActionRef.current !== action) {
      currentActionRef.current?.fadeOut(0.3);
      action.timeScale = 2;
      action.reset().fadeIn(0.3).play();
      currentActionRef.current = action;
    }
  };
  const lastStepSoundTime = useRef(0); // 마지막 발소리 시간
  const stepSoundDelay = 200; // 최소 300ms 간격 (0.3초)

  const leaveFootprint = (player) => {
    const currentPosition = player.position.clone();
    const distance = currentPosition.distanceTo(lastFootprintPosition.current);

    
    if ( distance > footprintDistanceThreshold) {
      const footOffset = 0.3;
      const angle = player.rotation.y;
      const offsetX = Math.cos(angle) * footOffset * (isLeftFoot.current ? -1 : 1);
      const offsetZ = Math.sin(angle) * footOffset * (isLeftFoot.current ? 1 : -1);
      const position = new Vector3(
        currentPosition.x + offsetX,
        0.01,
        currentPosition.z + offsetZ
      );

          // ✅ 발자국 사운드 재생
          const now = Date.now();
          if (now - lastStepSoundTime.current > stepSoundDelay) {
            lastStepSoundTime.current = now;
          
            // ✅ 발소리 재생
            audioLoaderRef.current.load(WALK_SOUND_URL, (buffer) => {
              const sound = new Audio(audioListenerRef.current);
              sound.setBuffer(buffer);
              sound.setVolume(0.04);
              sound.setLoop(false);
              if(sound) sound.play();
            });
          }
          

      textureLoader.load(FOOTPRINT_TEXTURE_URL, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        const geo = new PlaneGeometry(0.6, 0.6);
        const mat = new MeshBasicMaterial({ 
          map: texture, 
          transparent: true, 
          blending: THREE.NormalBlending, // ✅ 부드럽게 섞이게
          opacity: 0.8,     
          depthWrite: false // z-fighting 방지용
      });
        const mesh = new Mesh(geo, mat);
        mesh.position.copy(position);
        mesh.rotation.set(MathUtils.degToRad(-90), 0, 0);
        scene.add(mesh);
        footprints.current.push(mesh);

        gsap.to(mat, {
          opacity: 0,
          duration: 4,
          ease: 'power2.out',
          // ease: 'none',
          onComplete: () => {
            scene.remove(mesh);
            const index = footprints.current.indexOf(mesh);
            if (index !== -1) footprints.current.splice(index, 1);
          }
        });
      });

      lastFootprintPosition.current.copy(currentPosition);
      isLeftFoot.current = !isLeftFoot.current;

      if (footprints.current.length > 20) {
        const oldest = footprints.current.shift();
        gsap.killTweensOf(oldest.material); // 애니메이션 중단
        scene.remove(oldest); // 즉시 제거
      }
    }
  };

  return <Player
  ref={playerRef}
  onLoaded={({ actions }) => {
    actionsRef.current = actions; // ✅ actions 저장
  }}
/>
;
});

export default PlayerController;
