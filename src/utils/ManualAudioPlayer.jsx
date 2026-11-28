// utils/ManualAudioPlayer.jsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AudioListener, PositionalAudio, AudioLoader } from 'three';
import { useThree } from '@react-three/fiber';

/** 장면 속 한 지점에서 재생할 소리를 불러오고 외부에서 재생을 제어할 수 있게 한다. */
const ManualAudioPlayer = forwardRef(
  ({ url, volume = 1, loop = false, refDistance = 5, position = [0, 0, 0] }, ref) => {
    const { camera } = useThree();
    const listener = useRef();
    const audio = useRef();
    const audioGroup = useRef();

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
      const currentListener = new AudioListener();
      listener.current = currentListener;
      return () => currentListener.getInput().disconnect();
    }, []);

    useEffect(() => {
      const currentListener = listener.current;
      camera.add(currentListener);
      return () => camera.remove(currentListener);
    }, [camera]);

    useEffect(() => {
      const group = audioGroup.current;
      const sound = new PositionalAudio(listener.current);
      audio.current = sound;
      group.add(sound);
      let active = true;

      new AudioLoader().load(
        url,
        (buffer) => {
          if (active) sound.setBuffer(buffer);
        },
        undefined,
        (err) => {
          if (active) console.warn('Audio load failed:', err);
        }
      );

      return () => {
        active = false;
        audio.current = null;
        if (sound.isPlaying) sound.stop();
        sound.disconnect();
        sound.gain.disconnect();
        group.remove(sound);
      };
    }, [url]);

    useEffect(() => {
      const sound = audio.current;
      sound.setRefDistance(refDistance);
      sound.setLoop(loop);
      sound.setVolume(volume);
    }, [url, loop, refDistance, volume]);

    return <group ref={audioGroup} position={position} />;
  }
);

export default ManualAudioPlayer;
