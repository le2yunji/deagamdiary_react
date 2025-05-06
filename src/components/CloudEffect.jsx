import { Cloud } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { AdditiveBlending, MeshBasicMaterial } from 'three'

const CloudEffect = ({ position = [0, 0, 0] }) => {
  const cloudRef = useRef()

  useEffect(() => {
    if (cloudRef.current) {
      // 중심에서 커지게 하기 위해 초기 스케일을 0으로 설정
      cloudRef.current.scale.set(0, 0, 0)

      // gsap으로 스케일 애니메이션
      gsap.to(cloudRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      })
      cloudRef.current.raycast = () => null  // raycaster 무시
      cloudRef.current.renderOrder = -1;               // 🎯 먼저 그리기
        // ✅ 항상 맨 위에 그리도록 설정
        cloudRef.current.renderOrder = 999
    if (cloudRef.current.material) {
      cloudRef.current.material.depthWrite = false
      cloudRef.current.material.transparent = true
    }
    }
    
  }, [])

  return (
    <group position={position}>
      <Cloud
        ref={cloudRef}
        position-x={0}
        position-z={3}
        opacity={2}
        speed={0.01}
        width={0.1}
        height={0.1}
        depth={0.2}
        segments={1}
        color="white"
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </group>
  )
}

export default CloudEffect
