import { useMediaQuery, useWindowSize } from "@uidotdev/usehooks";

export function usePlatform() {
  const isMobile = useMediaQuery("(hover: none) and (pointer: coarse)");
  const { width, height } = useWindowSize();
  const isHorizontal = width >= 1.3 * height;
  return { isMobile, isHorizontal };
}
