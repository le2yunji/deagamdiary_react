import { useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { AudioListener, AudioLoader, PositionalAudio } from 'three';

export function AudioPlayer({ url, position }) {
  const { camera } = useThree();
  const listener = new AudioListener();
  const sound = new PositionalAudio(listener);
  const audioLoader = new AudioLoader();

  useEffect(() => {
    camera.add(listener);
    audioLoader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(5); // 거리 기반 감소
      sound.setLoop(true);
      sound.setVolume(1.0);
      sound.play();
    });

    return () => camera.remove(listener);
  }, []);

  return <primitive object={sound} position={position} />;
}
