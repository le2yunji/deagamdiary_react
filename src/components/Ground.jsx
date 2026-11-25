import { useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useConfiguredTexture } from '../hooks/useSceneTexture';
import { getAssetUrl } from '../utils/assetUrl';
import { getAspectFitHeight } from '../utils/planeGeometry';

const FLOOR_TEXTURE_URL = getAssetUrl('/assets/images/floor.svg');
const ROAD_ARROW_TEXTURE_URL = getAssetUrl('/assets/images/road_arrow.png');
const STREET_SVG_URL = getAssetUrl('/assets/images/street.svg');
const FLOOR_PLANE_SIZE = 1200;
const ROAD_ARROW_PLANE_WIDTH = 800;
const ROAD_ARROW_IMAGE_WIDTH = 5000;
const ROAD_ARROW_IMAGE_HEIGHT = 4167;
const ROAD_ARROW_PLANE_HEIGHT = getAspectFitHeight(
  ROAD_ARROW_PLANE_WIDTH,
  ROAD_ARROW_IMAGE_WIDTH,
  ROAD_ARROW_IMAGE_HEIGHT
);
const SHADOW_PLANE_SIZE = 800;

/** 넓은 바닥에 타일이 이어지도록 반복과 투명도 처리를 설정한다. */
function configureFloorTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(200, 200);
  texture.premultiplyAlpha = true;
}

/** 로컬에서 조정한 바닥 크기를 유지하며 R2의 바닥과 이동 경로를 표시한다. */
export default function Ground({ onClickGround }) {
  const groupRef = useRef();

  const texture = useConfiguredTexture(FLOOR_TEXTURE_URL, configureFloorTexture);
  const isDragging = useRef(false);

  const texture2 = useTexture(ROAD_ARROW_TEXTURE_URL);


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
       <planeGeometry args={[FLOOR_PLANE_SIZE, FLOOR_PLANE_SIZE]} />
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
       <planeGeometry args={[ROAD_ARROW_PLANE_WIDTH, ROAD_ARROW_PLANE_HEIGHT]} />
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
    <planeGeometry args={[SHADOW_PLANE_SIZE, SHADOW_PLANE_SIZE]} />
    <meshStandardMaterial 
 />
  </mesh>
   </group>
 );
}
