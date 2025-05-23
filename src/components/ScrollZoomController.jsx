// src/components/ScrollZoomController.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function ScrollZoomController({ active = true }) {
  const scroll = useScroll();
  const { camera } = useThree();

  const minZoom = 30;
  const maxZoom = 50;

  useFrame(() => {
    if (!active || !camera) return;

    const offset = scroll.offset ?? 0;

    // 부드러운 곡선으로 확대/축소 반영 (중간에서 가장 확대됨)
    const curve = Math.sin(offset * Math.PI);
    const targetZoom = THREE.MathUtils.lerp(minZoom, maxZoom, curve);

    camera.zoom = targetZoom;
    camera.updateProjectionMatrix();
  });

  return null;
}
