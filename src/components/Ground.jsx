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
import { getAssetUrl } from '../utils/assetUrl';

const FLOOR_TEXTURE_URL = getAssetUrl('/assets/images/floor.svg');
const ROAD_ARROW_TEXTURE_URL = getAssetUrl('/assets/images/road_arrow.png');
const STREET_SVG_URL = getAssetUrl('/assets/images/street.svg');

/** 이동 가능한 바닥과 도로 안내 텍스처를 표시하고 클릭 지점을 전달한다. */
export default function Ground({ onClickGround }) {
  const groupRef = useRef();

  // const texture = useTexture('/assets/images/grid_only2.png');
  const texture = useTexture(FLOOR_TEXTURE_URL);
  const isDragging = useRef(false);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 60;
  texture.repeat.y = 60;
  texture.premultiplyAlpha = true;

  const texture2 = useTexture(ROAD_ARROW_TEXTURE_URL);
  // texture2.colorSpace = THREE.SRGBColorSpace;
  // texture2.needsUpdate = true;
  // texture2.premultiplyAlpha = true;


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





// ✅ SVG를 geometry로 변환
useEffect(() => {
  const svgLoader = new SVGLoader();
  svgLoader.load(STREET_SVG_URL, (data) => {
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
    if (groupRef.current) groupRef.current.add(svgGroup);
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
        depthWrite={false}          // ✅ 테두리 겹침 방지
        toneMapped={false}        // ✨ 색 왜곡 방지
        blending={THREE.NormalBlending} // 또는 Additive, CustomBlending 실험 가능
        side={THREE.DoubleSide}
        opacity={0.2} // ✅ 실제 투명도 설정은 여기서!
        color={'#edd3bb'}
       />
     </mesh>

     <mesh
       rotation={[-Math.PI / 2, 0, 0]}
       position={[0, 0.002, 10]}
      //  receiveShadow
       onPointerDown={handlePointerDown}
       onPointerMove={handlePointerMove}
       onPointerUp={handlePointerUp}
     >
       <planeGeometry args={[400, 400]} />
       <meshBasicMaterial 
       map={texture2}
       transparent={true}        // ✨ PNG 알파 반영
       depthWrite={false}          // ✅ 테두리 겹침 방지
       toneMapped={false}        // ✨ 색 왜곡 방지
       blending={THREE.NormalBlending}
       side={THREE.DoubleSide}
        opacity={1} // ✅ 실제 투명도 설정은 여기서!
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
