// src/components/Emotion.jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Html } from '@react-three/drei';

export default function Emotion({ targetRef, imageSrc = "/assets/images/emotion.png" }) {
  const emotionRef = useRef();

  useFrame(() => {
    if (targetRef.current && emotionRef.current) {
      const player = targetRef.current;
      const pos = player.position.clone();
      emotionRef.current.position.set(pos.x, pos.y + 2.5, pos.z); // 머리 위 고정
    }
  });

  return (
    <group ref={emotionRef} name="Emotion">
      <Html distanceFactor={20} center style={{ pointerEvents: 'none' }}>
        <img src={imageSrc} alt="emotion" width="2" />
      </Html>
    </group>
  );
}
