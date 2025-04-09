// import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three';
// import { useMemo } from 'react';

// export default function Emotion({ textureUrl, position }) {
//   const validUrl = useMemo(() => textureUrl ?? '/assets/images/happy.webp', [textureUrl]);
//   const texture = useLoader(TextureLoader, validUrl);

//   return (
//     <mesh position={position}>
//       <planeGeometry args={[1.2, 1.2]} />
//       <meshBasicMaterial map={texture} transparent alphaTest={0.5} />
//     </mesh>
//   );
// }
