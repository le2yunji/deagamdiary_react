import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { Html } from '@react-three/drei';

const posters = [
  { name: 'SushiMemo', y: 1, image: '/assets/images/SushiMemo.webp' },
  { name: 'WonesoongMemo', y: 2.5, image: '/assets/images/WonesoongMemo.webp' },
  { name: 'KidsMemo', y: 4, image: '/assets/images/KidsMemo.webp' },
  { name: 'BakeryMemo', y: 5.5, image: '/assets/images/BakeryMemo.webp' },
  { name: 'DokseoMemo', y: 7, image: '/assets/images/DokseoMemo.webp' },
  { name: 'DoNotNakseoMemo', y: 8.5, image: '/assets/images/DoNotNakseoMemo.webp' },
  { name: 'GamzaMemo', y: 10, image: '/assets/images/GamzaMemo.webp' },
  { name: 'IwannagoHomeMemo', y: 11.5, image: '/assets/images/IwannagohomeMemo.webp' },
];

export function Posters() {
  const models = {
    SushiMemo: useLoader(GLTFLoader, '/assets/models/SushiMemo.glb'),
    WonesoongMemo: useLoader(GLTFLoader, '/assets/models/WonesoongMemo.glb'),
    KidsMemo: useLoader(GLTFLoader, '/assets/models/KidsMemo.glb'),
    BakeryMemo: useLoader(GLTFLoader, '/assets/models/BakeryMemo.glb'),
    DokseoMemo: useLoader(GLTFLoader, '/assets/models/DokseoMemo.glb'),
    DoNotNakseoMemo: useLoader(GLTFLoader, '/assets/models/DoNotNakseoMemo.glb'),
    GamzaMemo: useLoader(GLTFLoader, '/assets/models/GamzaMemo.glb'),
    IwannagoHomeMemo: useLoader(GLTFLoader, '/assets/models/IwannagoHomeMemo.glb'),
  };

  const [hoveredPoster, setHoveredPoster] = useState(null);

  return (
    <group>
      {posters.map(({ name, y, image }) => (
        <primitive
          key={name}
          object={models[name].scene}
          position={[-35, 0.9, -24]}
          scale={[1.6, 1.6, 1.6]}
          onClick={() => console.log(`${name} clicked`)}
          onPointerOver={() => setHoveredPoster(image)}
          onPointerOut={() => setHoveredPoster(null)}
        />
      ))}

      {hoveredPoster && (
        <Html fullscreen>
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.95)',
              padding: '8px 16px',
              borderRadius: '12px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            }}
          >
            <img
              src={hoveredPoster}
              alt="포스터 설명"
              style={{ width: '200px', height: 'auto' }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}
