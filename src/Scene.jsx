import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';

export default function App() {
  return (
    <Canvas shadows>
      <color attach="background" args={['white']} />
      <SceneContent />
    </Canvas>
  );
}

