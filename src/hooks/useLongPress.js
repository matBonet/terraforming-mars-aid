import { useRef, useCallback, useState } from 'react';

const DELAY = 500;
const MOVE_THRESHOLD = 8; // px — cancel if finger moves more than this

export function useLongPress(onLongPress) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  const start = useCallback((e) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setPressing(false);
      navigator.vibrate?.(12);
      onLongPress();
    }, DELAY);
  }, [onLongPress]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    setPressing(false);
    startRef.current = null;
  }, []);

  const move = useCallback((e) => {
    if (!startRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    if (dx * dx + dy * dy > MOVE_THRESHOLD * MOVE_THRESHOLD) {
      cancel();
    }
  }, [cancel]);

  return {
    pressing,
    handlers: {
      onTouchStart: start,
      onTouchEnd: cancel,
      onTouchMove: move,
      onContextMenu: (e) => e.preventDefault(),
    },
  };
}
