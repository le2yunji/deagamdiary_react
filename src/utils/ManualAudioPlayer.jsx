// utils/ManualAudioPlayer.jsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AudioListener, PositionalAudio, AudioLoader } from 'three';
import { useThree } from '@react-three/fiber';

const ManualAudioPlayer = forwardRef(({ url, volume = 1, loop = false, refDistance = 5, position = [0, 0, 0] }, ref) => {
  const { camera } = useThree();
  const listener = useRef();
  const audio = useRef();
  const loader = useRef(new AudioLoader());

  // 외부에서 play(), stop() 제어 가능하게
  useImperativeHandle(ref, () => ({
    play: () => {
      if (audio.current?.buffer && !audio.current.isPlaying) {
        audio.current.play();
      }
    },
    stop: () => {
      if (audio.current?.isPlaying) {
        audio.current.stop();
      }
    },
    isPlaying: () => audio.current?.isPlaying ?? false
  }));

  useEffect(() => {
    listener.current = new AudioListener();
    camera.add(listener.current);

    const sound = new PositionalAudio(listener.current);
    audio.current = sound;

    loader.current.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(refDistance);
      sound.setLoop(loop);
      sound.setVolume(volume);
    });

    return () => {
      camera.remove(listener.current);
    };
  }, [url, camera]);

  return audio.current ? (
    <primitive object={audio.current} position={position} />
  ) : null;
});

export default ManualAudioPlayer;
