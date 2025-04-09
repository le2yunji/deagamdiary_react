// src/Scene.jsx
import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';

export default function App() {
  return (
  <Canvas shadows dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance" }}>
      <color attach="background" args={['white']} />
      <SceneContent />
    </Canvas>
  );
}

