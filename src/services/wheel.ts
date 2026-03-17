export function easeOutQuartic(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function angleToIndex(angle: number, count: number): number {
  const segmentAngle = (2 * Math.PI) / count
  // Normalize: pointer is at the top (−π/2). We offset from there.
  const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const index = Math.floor(normalized / segmentAngle)
  return (count - index) % count
}

export function computeSpinAngle(
  currentAngle: number,
  targetIndex: number,
  segmentCount: number,
  extraRotations = 6,
): number {
  const segmentAngle = (2 * Math.PI) / segmentCount
  // Segment i's midpoint in wheel-local coords (east = 0, clockwise)
  const targetMid = targetIndex * segmentAngle + segmentAngle / 2
  // Pointer is at top (-π/2). After rotating by finalAngle, segment midpoint
  // must land at -π/2: finalAngle + targetMid ≡ -π/2 (mod 2π)
  const targetAbsAngle = -Math.PI / 2 - targetMid
  const targetNorm = ((targetAbsAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const currentNorm = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  let delta = targetNorm - currentNorm
  if (delta <= 0) delta += 2 * Math.PI
  return extraRotations * 2 * Math.PI + delta
}

export function buildItems(
  labels: string[],
  palette: string[],
): { id: string; label: string; color: string }[] {
  return labels.map((label, i) => ({
    id: crypto.randomUUID(),
    label,
    color: palette[i % palette.length]!,
  }))
}
