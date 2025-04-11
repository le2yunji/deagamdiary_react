import { useEffect, useRef } from 'react';
import { AudioListener, PositionalAudio, AudioLoader } from 'three';
import { useThree, useFrame } from '@react-three/fiber';

export function AudioTimelinePlayer({ mixer, action, timeline = [], position }) {
  const { camera } = useThree();
  const listenerRef = useRef(new AudioListener());
  const audioLoader = useRef(new AudioLoader());
  const audioRefs = useRef([]); // 사운드 인스턴스 저장
  const hasPlayed = useRef(timeline.map(() => false));

  useEffect(() => {
    camera.add(listenerRef.current);

    // 각 사운드 로딩 및 세부 설정 반영
    timeline.forEach(({ url, volume = 1.0, loop = false, refDistance = 5 }, index) => {
      audioLoader.current.load(url, (buffer) => {
        const sound = new PositionalAudio(listenerRef.current);
        sound.setBuffer(buffer);
        sound.setRefDistance(refDistance);
        sound.setLoop(loop);
        sound.setVolume(volume);
        audioRefs.current[index] = sound;
      });
    });

    return () => camera.remove(listenerRef.current);
  }, [timeline]);

 // 타임라인 따라 시간 체크 후 재생 및 stop 제어
useFrame(() => {
  if (!mixer || !action) return;
  const currentTime = action.time;

  timeline.forEach(({ time: start, duration }, i) => {
    const sound = audioRefs.current[i];
    const end = start + (duration || 999); // duration 없으면 무제한

    if (!sound || !sound.buffer) return;

    // 🔊 재생 조건
    if (currentTime >= start && currentTime < end && !hasPlayed.current[i]) {
      sound.stop(); // 혹시라도 이미 재생 중이면 멈춤
      sound.play();
      hasPlayed.current[i] = true;
    }

    // ⏹️ 정지 조건: 재생 중이면 무조건 stop
    if (currentTime >= end && hasPlayed.current[i]) {
      sound.stop();
      hasPlayed.current[i] = false; // 상태 초기화
    }
  });

  // 🧹 애니메이션 끝나면 전체 상태 초기화
  if (currentTime >= action.getClip().duration) {
    audioRefs.current.forEach((sound) => sound?.stop());
    hasPlayed.current = timeline.map(() => false);
  }
});


  return (
    <>
      {audioRefs.current.map((sound, i) =>
        sound ? <primitive key={i} object={sound} position={position} /> : null
      )}
    </>
  );
}
