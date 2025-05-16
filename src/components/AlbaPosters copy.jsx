
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const posters = [
  'SushiMemo', 'KidsMemo', 'BakeryMemo',
  'DokseoMemo',  'GamzaMemo'
];

export function Posters({selectedPoster, setSelectedPoster}) {

  const bakeryPoster = document.getElementById('bakery-poster')
  const gamzaPoster = document.getElementById('gamza-poster')

  const gltfs = useLoader(
    GLTFLoader,
    posters.map((name) => /assets/models/${name}.glb)
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
        position={[-25, 0.5, -13.5]}
        scale={[1.3, 1.3, 1.3]}
        onClick={() => {
          // console.log('클릭됨:', name);
          setSelectedPoster(prev => prev === name ? null : name);
        }}
      /> 
      ))}

{/* {selectedPoster && (
  <Html
    position={[-38.5, 12, -13]}
    transform={false}
    portal={{ current: document.body }}  // ✔ 반드시 추가
  >
    <div
      onClick={() => setSelectedPoster(null)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <img
        src={/assets/images/${selectedPoster}.webp}
        alt={selectedPoster}
        style={{
          width: '300px',
          height: 'auto',
          borderRadius: '12px',
        }}
      />
    </div>
  </Html>
)} */}


    </group>
  );
}