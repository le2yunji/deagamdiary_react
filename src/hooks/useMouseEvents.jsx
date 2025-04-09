// src/hooks/useMouseEvents.js
import { useCallback } from 'react';

export default function useMouseEvents(canvasRef, onClick = () => {}) {
  const mouse = { x: 0, y: 0 };

  const calculateMousePosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handleMouseDown = (e) => {
    calculateMousePosition(e);
    onClick(mouse);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      calculateMousePosition(e.touches[0]);
      onClick(mouse);
    }
  };

  const enableMouseEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
  }, [canvasRef]);

  const disableMouseEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('touchstart', handleTouchStart);
  }, [canvasRef]);

  return { enableMouseEvents, disableMouseEvents, mouse };
}
