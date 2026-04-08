export function useIsMobile(): boolean {
  const isSmallScreen = window.innerWidth < 1024;
  const isTouchDevice = window.navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  return isSmallScreen && isTouchDevice;
}
