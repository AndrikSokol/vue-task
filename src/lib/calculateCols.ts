export const calculateCols = (size: number) => {
  return Math.max(Math.floor((size - 260) / 300))
}
