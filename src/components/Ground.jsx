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
  const texture = useTexture('/assets/images/grid_only2.png');
  const isDragging = useRef(false);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 9;
  texture.repeat.y = 9;
  texture.premultiplyAlpha = true;

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
       position={[0, 0.001, 0]}
      //  receiveShadow
       onPointerDown={handlePointerDown}
       onPointerMove={handlePointerMove}
       onPointerUp={handlePointerUp}
     >
       <planeGeometry args={[400, 400]} />
       <meshBasicMaterial 
       map={texture}
       transparent={true}        // ✨ PNG 알파 반영
      alphaTest={0.01}          // ✨ 경계선 제거용
      toneMapped={false}        // ✨ 색 왜곡 방지
      blending={THREE.NormalBlending} // 또는 Additive, CustomBlending 실험 가능
      side={THREE.DoubleSide}
      opacity={0.3} // ✅ 실제 투명도 설정은 여기서!

       />
     </mesh>

  {/* 🧱 2. 그림자만 받는 바닥 */}
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 0, 0]}
    receiveShadow
  >
    <planeGeometry args={[400, 400]} />
    <meshStandardMaterial 
 />
    {/* <shadowMaterial opacity={0.35} /> */}
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