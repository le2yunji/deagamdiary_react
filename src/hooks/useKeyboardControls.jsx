// src/hooks/useKeyboardControls.js
import { useEffect, useRef } from 'react';

export default function useKeyboardControls(onDirectionChange = () => {}) {
  const directionRef = useRef({ forward: false, backward: false, left: false, right: false });

  const updateDirection = () => {
    onDirectionChange({ ...directionRef.current });
  };

  const handleKeyDown = (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        directionRef.current.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        directionRef.current.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        directionRef.current.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        directionRef.current.right = true;
        break;
      default:
        return;
    }
    updateDirection();
  };

  const handleKeyUp = (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        directionRef.current.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        directionRef.current.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        directionRef.current.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        directionRef.current.right = false;
        break;
      default:
        return;
    }
    updateDirection();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return directionRef;
}
