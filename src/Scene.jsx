// src/Scene.jsx
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap } from 'three';
import SceneContent from './SceneContent';
import  React, { useEffect } from 'react';
import { Loader } from './components/Loader';
import ScrollZoomController from './components/ScrollZoomController';
import {  ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { GUI } from 'dat.gui'; //

// function CameraControl() {
//   const { camera } = useThree();
  
//   // dat.GUI 사용
//   useEffect(() => {
//     const gui = new GUI();
//     const cameraFolder = gui.addFolder('Camera');
    
//     // 카메라 zoom 조절
//     cameraFolder.add(camera, 'zoom', 10, 50 , 0.001)
//       .name('Zoom')
//       .onChange(() => {
//         camera.updateProjectionMatrix(); // zoom 변경 후 업데이트 필요
//       });

//     cameraFolder.open();

//     return () => {
//       gui.destroy(); // 컴포넌트 언마운트 시 GUI를 정리
//     };
//   }, [camera]);

//   return null;
// }


// export default function App() {
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
//       if (keys.includes(e.key)) {
//         e.preventDefault(); // ⛔️ 키보드 스크롤 막기
//       }
//     };
  
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);
  
//   return (

//       <Canvas shadows dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance" }}>
//         <color attach="background" args={['white']} />
//         <ScrollControls pages={1} damping={0} >
//               <Suspense fallback={<Loader />}>
//                 <SceneContent />
//               </Suspense>  
//               {/* <ScrollZoomController active={true} /> */}
//         </ScrollControls>
//       </Canvas>
//   );
// }

export const Scene = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
      if (keys.includes(e.key)) {
        e.preventDefault(); // ⛔️ 키보드 스크롤 막기
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
      <Canvas shadows dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance"}}>
        <color attach="background" args={['white']} />
        {/* <ScrollControls pages={1} damping={0} > */}
              {/* <Suspense fallback={<Loader />}> */}
                <SceneContent />
              {/* </Suspense>   */}
              {/* <ScrollZoomController active={true} /> */}
        {/* </ScrollControls> */}
      </Canvas>
  );
}
