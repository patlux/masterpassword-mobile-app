export function insertItem<T>(array: T[], index: number, item: T) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

export function updateItem<T>(array: T[], index: number, item: T) {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export function removeItem<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
