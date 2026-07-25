export function formatARS(value: number): string {
  return `$${value.toLocaleString("es-AR")}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString("es-AR")
}