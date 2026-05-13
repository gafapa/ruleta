export function randomInt(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive must be a positive safe integer')
  }

  const maxUint = 0xffffffff
  const limit = maxUint - (maxUint % maxExclusive)
  const value = new Uint32Array(1)

  do {
    crypto.getRandomValues(value)
  } while (value[0]! >= limit)

  return value[0]! % maxExclusive
}

export function randomFloat(): number {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0]! / 0x100000000
}
