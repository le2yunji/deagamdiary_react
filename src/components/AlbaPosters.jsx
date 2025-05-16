import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const posters = [
  'SushiMemo', 'KidsMemo', 'BakeryMemo',
  'DokseoMemo',  'GamzaMemo'
];
export function Posters({ selectedPoster, setSelectedPoster }) {
  const gltfs = useLoader(GLTFLoader, posters.map((name) => `/assets/models/${name}.glb`));

  const models = useMemo(() => {
    const result = {};
    posters.forEach((name, i) => {
      result[name] = gltfs[i];
    });
    return result;
  }, [gltfs]);

  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {posters.map((name, i) => (
        <primitive
          key={name}
          object={models[name]?.scene}
          position={[-25, 0.5, -13.5]}
          scale={[1.3, 1.3, 1.3]}
          onClick={() => {

            const targetId = `${name.toLowerCase().replace('memo', '')}-poster`;
            const targetEl = document.getElementById(targetId);

              // ✅ 상태도 변경
            setSelectedPoster(prev => prev === name ? null : name);

            // 모두 숨기고
            posters.forEach(p => {
              const el = document.getElementById(`${p.toLowerCase().replace('memo', '')}-poster`);
              if (el) el.style.display = 'none';
            });

            // 클릭한 포스터만 보이게
            if (targetEl) {
              const isVisible = targetEl.style.display === 'block';
              targetEl.style.display = isVisible ? 'none' : 'block';
            }
          }}
        />
      ))}
    </group>
  );
}
