export const CONFIG = Object.freeze({
  cols: 20,
  rows: 20,
  cellSize: 20,
  moveInterval: 150,
  initialLength: 3
});

export const COLORS = Object.freeze({
  grid: '#262a40',
  head: '#7bed9f',
  body: '#2ed573',
  apple: '#ff4757'
});

export const DIRECTIONS = Object.freeze({
  ArrowUp: Object.freeze({ x: 0, y: -1 }),
  ArrowDown: Object.freeze({ x: 0, y: 1 }),
  ArrowLeft: Object.freeze({ x: -1, y: 0 }),
  ArrowRight: Object.freeze({ x: 1, y: 0 })
});
