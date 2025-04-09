// components/Ground.jsx
import { useTexture } from '@react-three/drei';
import { useState, useRef } from 'react';
import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  Vector3,
  SRGBColorSpace
} from 'three';
import * as THREE from 'three';

export default function Ground({ onClickGround }) {
  const texture = useTexture('/assets/images/street.webp');
  const isDragging = useRef(false);
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.x = 30;
  // texture.repeat.y = 30;

  const handlePointerDown = (event) => {
    isDragging.current = true;
    handleMove(event);
  };

  const handlePointerMove = (event) => {
    if (isDragging.current && event.buttons === 1) {
      handleMove(event);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleMove = (event) => {
    const point = event.point.clone();
    point.y = 0.3;
    onClickGround(point);
  };
 // ✅ 이미지 텍스처 로드
 const textureLoader = new TextureLoader();
 const gsuTexture = textureLoader.load('/assets/images/gsu.webp');
 const anTexture = textureLoader.load('/assets/images/an.webp');

 [gsuTexture, anTexture].forEach((texture) => {
   texture.colorSpace = SRGBColorSpace;
   texture.needsUpdate = true;
 });

 // ✅ 이미지 plane 설정
 const imagePlanes = [
   {
     texture: gsuTexture,
     position: new Vector3(-90, 3, -83),
     rotation: [0, THREE.MathUtils.degToRad(10), 0],
     size: [15, 15],
   },
   {
     texture: anTexture,
     position: new Vector3(-118, 3, -68),
     rotation: [0, THREE.MathUtils.degToRad(30), 0],
     size: [10, 10],
   },
 ];

 return (
   <group>
     {/* 🟦 바닥 메쉬 */}
     <mesh
       rotation={[-Math.PI / 2, 0, 0]}
       position={[0, 0, 0]}
       receiveShadow
       onPointerDown={handlePointerDown}
       onPointerMove={handlePointerMove}
       onPointerUp={handlePointerUp}
     >
       <planeGeometry args={[400, 400]} />
       <meshStandardMaterial map={texture} />
     </mesh>

     {/* 🖼 이미지 plane 렌더링 */}
     {/* {imagePlanes.map((info, i) => (
       <mesh
       receiveShadow
         castShadow
         key={i}
         position={info.position}
         rotation={info.rotation}
       >
         <planeGeometry args={info.size} />
         <meshStandardMaterial
           map={info.texture}
           transparent
           opacity={1}
           toneMapped={false}
         />
       </mesh>
     ))} */}
   </group>
 );
}