// components/Ground.jsx
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSetRecoilState } from 'recoil';
import { IsEnteredAtom } from '../stores';
// Ground.jsx
export default function Ground({ onClickGround }) {
    const texture = useTexture('/assets/images/street.webp');
  
    const handleClick = (event) => {
      const point = event.point.clone();
      point.y = 0.3;
      onClickGround(point); // ⛔️ 여기서 setIsEntered 제거
    };
  
    return (
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={handleClick}
        onPointerMove={(e) => {
          if (e.buttons === 1) handleClick(e);
        }}
      >
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    );
  }
  