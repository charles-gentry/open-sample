export function useIsMobile(): boolean {
  return window.navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
}
