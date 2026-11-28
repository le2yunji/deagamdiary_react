import { useGLTF } from "@react-three/drei";
import { getAssetUrl } from "../utils/assetUrl";

const ALBA_BOARD_MODEL_URL = getAssetUrl("/assets/models/JustBoard.glb");

/** 알바 포스터 보드 GLB를 R2에서 불러와 장면에 표시한다. */
export function AlbaBoard(props) {
  const { nodes, materials } = useGLTF(ALBA_BOARD_MODEL_URL);

  return (
    <group {...props} dispose={null}>
      <group scale={0.467}>
        <mesh
          geometry={nodes.Cube002_1.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Cube002_2.geometry}
          material={materials.Material}
        />
        <mesh
          geometry={nodes.Cube002_3.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          geometry={nodes.Cube002_4.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          geometry={nodes.Cube002_5.geometry}
          material={materials["Material.002"]}
        />
      </group>
      <group rotation={[0, 0, 0.077]} scale={0.412}>
        <mesh
          geometry={nodes.Cube004_1.geometry}
          material={materials["Material.014"]}
        />
        <mesh
          geometry={nodes.Cube004_2.geometry}
          material={materials["Material.016"]}
        />
        <mesh
          geometry={nodes.Cube004_3.geometry}
          material={materials["Material.007"]}
        />
      </group>
      <group
        position={[0, 3.074, -1.806]}
        rotation={[0.787, 0, 0]}
        scale={[0.563, 0.505, 0.417]}
      >
        <mesh
          geometry={nodes.Text001_1.geometry}
          material={materials["Material.038"]}
        />
        <mesh
          geometry={nodes.Text001_2.geometry}
          material={materials.Material}
        />
      </group>
    </group>
  );
}

useGLTF.preload(ALBA_BOARD_MODEL_URL);
