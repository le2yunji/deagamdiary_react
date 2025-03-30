// SceneContent.jsx
import { OrthographicCamera } from '@react-three/drei';
import Ground from './components/Ground';
import PlayerController from './components/PlayerController';
import { useState, useRef, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import MetroScene from './components/MetroScene';
import { Loader } from './components/Loader';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IsEnteredAtom } from './stores';
import Emotion from './components/Emotion';


export default function SceneContent() {
  const [destination, setDestination] = useState(null);
  const cameraRef = useRef();
  const playerRef = useRef();
  const emotionRef = useRef();
  const isEntered = useRecoilValue(IsEnteredAtom)
  const setIsEntered = useSetRecoilState(IsEnteredAtom);

  useEffect(() => {
    if (destination) {
      setIsEntered(true); // ✅ destination이 바뀌면 Loader 종료
    }
  }, [destination]);

  if (isEntered) {
  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={[1, 5, 5]}
        zoom={25}
        near={-1000}
        far={1000}
      />

      {/* 빛 */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 10, 5]}
        castShadow
        intensity={2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 클릭 처리 + 이동 좌표 전달 */}
      <Ground onClickGround={(point) => setDestination(point)} />

      {/* 캐릭터 */}
      <PlayerController ref={playerRef} destination={destination} cameraRef={cameraRef} />
      <Emotion targetRef={playerRef} imageSrc="/assets/images/happy.webp" />

      {/* <Suspense fallback={<Loader/>}>

      </Suspense> */}

      <MetroScene
          playerRef={playerRef}
          emotionRef={emotionRef}
          setPlayerVisible={(v) => (playerRef.current.visible = v)}
          setCameraTarget={(pos) => setDestination(pos)}
      />

    </>
  );
}

return <Loader isCompleted />
}
