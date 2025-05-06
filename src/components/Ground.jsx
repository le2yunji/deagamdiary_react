// components/Ground.jsx
import { useTexture } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  Vector3,
  SRGBColorSpace
} from 'three';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export default function Ground({ onClickGround }) {
  const groupRef = useRef();

  // const texture = useTexture('/assets/images/grid_only2.png');
  const texture = useTexture('/assets/images/street.svg');
  const isDragging = useRef(false);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 14;
  texture.repeat.y = 14;
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

// ✅ SVG를 geometry로 변환
useEffect(() => {
  const svgLoader = new SVGLoader();
  svgLoader.load('/assets/images/street.svg', (data) => {
    const paths = data.paths;
    const svgGroup = new THREE.Group();

    for (const path of paths) {
      const material = new THREE.MeshBasicMaterial({
        color: path.color || '#000000',
        side: THREE.DoubleSide,
        toneMapped: false,
        depthWrite: false,
      });

      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        svgGroup.add(mesh);
      }
    }

    svgGroup.scale.set(0.1, 0.1, 0.1);       // 사이즈 조정
    svgGroup.rotation.x = -Math.PI / 2;      // 바닥에 눕히기
    svgGroup.position.set(0, 0.01, 0);        // 살짝 띄우기
    groupRef.current.add(svgGroup);
  });
}, []);




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
        opacity={0.2} // ✅ 실제 투명도 설정은 여기서!

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