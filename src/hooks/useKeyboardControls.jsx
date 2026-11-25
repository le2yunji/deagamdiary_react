import { useEffect, useRef } from 'react';

const DIRECTION_BY_KEY = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

/** 키보드 방향을 매 프레임 읽을 수 있게 저장하고 변경 시 호출자에게 알린다. */
export default function useKeyboardControls(onDirectionChange) {
  const directionRef = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    /** 방향키나 WASD 입력에 해당하는 이동 방향만 갱신한다. */
    const handleDirectionKey = (event) => {
      if (!Object.hasOwn(DIRECTION_BY_KEY, event.code)) return;

      const direction = DIRECTION_BY_KEY[event.code];
      directionRef.current[direction] = event.type === 'keydown';
      onDirectionChange?.({ ...directionRef.current });
    };

    window.addEventListener('keydown', handleDirectionKey);
    window.addEventListener('keyup', handleDirectionKey);
    return () => {
      window.removeEventListener('keydown', handleDirectionKey);
      window.removeEventListener('keyup', handleDirectionKey);
    };
  }, [onDirectionChange]);

  return directionRef;
}
