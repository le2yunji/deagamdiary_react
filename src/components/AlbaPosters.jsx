import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';

const posters = [
  'SushiMemo', 'WonesoongMemo', 'KidsMemo', 'BakeryMemo',
  'DokseoMemo', 'DoNotNakseoMemo', 'GamzaMemo', 'IwannagoHomeMemo',
];

export function Posters({selectedPoster, setSelectedPoster}) {
  const gltfs = useLoader(
    GLTFLoader,
    posters.map((name) => `/assets/models/${name}.glb`)
  );

  const models = useMemo(() => {
    const result = {};
    posters.forEach((name, i) => {
      result[name] = gltfs[i];
    });
    return result;
  }, [gltfs]);

  const [hoveredPoster, setHoveredPoster] = useState(null);
  // const [selectedPoster, setSelectedPoster] = useState(null);
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {posters.map((name, i) => (
        <primitive
        key={name}
        name={name}
        object={models[name]?.scene}
        position={[-35, 0.9, -24]}
        scale={[1.6, 1.6, 1.6]}
        onClick={() => {
          // console.log('클릭됨:', name);
          setSelectedPoster(prev => prev === name ? null : name);
        }}
      />
      
      ))}

      {hoveredPoster && (
        <Html fullscreen>
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '90%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
          }}
        >
          <p style={{ marginBottom: '10px' }}>이미지 표시 중: {selectedPoster}</p>
          <img
            src={`/assets/images/${selectedPoster}.webp`}
            style={{ width: '300px', height: 'auto' }}
            alt={selectedPoster}
          />
        </div>
      </Html>
   
      )}

    {selectedPoster && (
      <Html position={[-30, 5, -20]}>
      <div style={{ background: 'white', padding: '20px', zIndex: 9999 }}
                onClick={() => setSelectedPoster(null)} // 바깥 클릭 시 닫기
                >
        {/* <p>{selectedPoster}</p> */}
        <img
          src={`/assets/images/${selectedPoster}.webp`}
          style={{ width: '300px' }}
          alt={selectedPoster}
          onClick={() => setSelectedPoster(null)} // 바깥 클릭 시 닫기
        />
      </div>
    </Html>
    )}


    </group>
  );
}
