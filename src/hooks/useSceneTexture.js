import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { SRGBColorSpace } from 'three';

/** 이미지 캐시는 공유하고, 장면별 설정은 별도 텍스처에 적용한다. */
export function useConfiguredTexture(url, configure) {
  const source = useTexture(url);
  const texture = useMemo(() => {
    const configured = source.clone();
    configure(configured);
    configured.needsUpdate = true;
    return configured;
  }, [source, configure]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

/** 이동 지점 표시가 기존 색과 방향으로 보이도록 설정한다. */
function configureSpotTexture(texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 16;
  texture.flipY = false;
}

/** 이동 지점 이미지들을 같은 텍스처 설정으로 표시한다. */
export function useSpotTexture(url) {
  return useConfiguredTexture(url, configureSpotTexture);
}
