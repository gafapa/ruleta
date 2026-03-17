export type WheelStyleId =
  | 'clasica'
  | 'neon'
  | 'pastel'
  | 'oceano'
  | 'otono'
  | 'galaxia'
  | 'caramelo'
  | 'bosque'
  | 'fuego'
  | 'retro'
  | 'cebra'
  | 'aurora'

export interface WheelStyleDef {
  id: WheelStyleId
  name: string
  emoji: string
  colors: string[]
  /** Dark canvas background (null = transparent/white) */
  canvasBg: string | null
  /** Outer ring gradient: [left, center, right] */
  ringColors: [string, string, string]
  /** Hub radial gradient stops */
  hubInner: string
  hubMid: string
  hubOuter: string
  /** Border between segments */
  borderColor: string
  /** Tick marks on outer rim */
  tickColor: string
  /** Whether to add glow effect on segment fills and labels */
  glowSegments: boolean
}

export const WHEEL_STYLES: WheelStyleDef[] = [
  {
    id: 'clasica',
    name: 'Clásica',
    emoji: '🎨',
    colors: [
      '#7C3AED', '#0EA5E9', '#EC4899', '#F59E0B',
      '#10B981', '#EF4444', '#8B5CF6', '#06B6D4',
      '#F97316', '#84CC16', '#A855F7', '#14B8A6',
    ],
    canvasBg: null,
    ringColors: ['#7c3aed', '#06b6d4', '#ec4899'],
    hubInner: 'rgba(255,255,255,0.95)',
    hubMid: 'rgba(200,200,255,0.6)',
    hubOuter: 'rgba(124,58,237,0.2)',
    borderColor: 'rgba(0,0,0,0.25)',
    tickColor: 'rgba(0,0,0,0.12)',
    glowSegments: false,
  },
  {
    id: 'neon',
    name: 'Neón',
    emoji: '⚡',
    colors: [
      '#FF0080', '#9B00FF', '#00F5FF', '#FF8C00',
      '#00FF88', '#FF2040', '#FF00FF', '#00CFFF',
      '#FFE000', '#00FF44', '#FF5500', '#BB00FF',
    ],
    canvasBg: '#07071a',
    ringColors: ['#FF0080', '#9B00FF', '#00F5FF'],
    hubInner: '#18182a',
    hubMid: '#2a1850',
    hubOuter: '#FF0080',
    borderColor: 'rgba(255,255,255,0.08)',
    tickColor: 'rgba(255,255,255,0.25)',
    glowSegments: true,
  },
  {
    id: 'galaxia',
    name: 'Galaxia',
    emoji: '🌌',
    colors: [
      '#6D28D9', '#1E40AF', '#BE185D', '#0E7490',
      '#5B21B6', '#1D4ED8', '#9D174D', '#0369A1',
      '#4C1D95', '#1E3A8A', '#831843', '#164E63',
    ],
    canvasBg: '#050512',
    ringColors: ['#6D28D9', '#1D4ED8', '#BE185D'],
    hubInner: '#0d0d2a',
    hubMid: '#1a1040',
    hubOuter: '#6D28D9',
    borderColor: 'rgba(200,200,255,0.15)',
    tickColor: 'rgba(200,200,255,0.3)',
    glowSegments: true,
  },
  {
    id: 'fuego',
    name: 'Fuego',
    emoji: '🔥',
    colors: [
      '#DC2626', '#EA580C', '#D97706', '#B91C1C',
      '#F97316', '#EF4444', '#C2410C', '#FBBF24',
      '#991B1B', '#FB923C', '#B45309', '#F59E0B',
    ],
    canvasBg: '#160800',
    ringColors: ['#DC2626', '#EA580C', '#FBBF24'],
    hubInner: '#1c0500',
    hubMid: '#3d0c00',
    hubOuter: '#DC2626',
    borderColor: 'rgba(255,150,0,0.2)',
    tickColor: 'rgba(255,150,50,0.4)',
    glowSegments: true,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌅',
    colors: [
      '#F472B6', '#818CF8', '#34D399', '#FB923C',
      '#A78BFA', '#4ADE80', '#F9A8D4', '#60A5FA',
      '#86EFAC', '#FCA5A5', '#C4B5FD', '#6EE7B7',
    ],
    canvasBg: '#0a0f1a',
    ringColors: ['#F472B6', '#818CF8', '#34D399'],
    hubInner: '#0f1525',
    hubMid: '#1a1f35',
    hubOuter: '#818CF8',
    borderColor: 'rgba(255,255,255,0.1)',
    tickColor: 'rgba(255,255,255,0.2)',
    glowSegments: true,
  },
  {
    id: 'pastel',
    name: 'Pastel',
    emoji: '🍬',
    colors: [
      '#F9A8D4', '#FCA5A5', '#FCD34D', '#A7F3D0',
      '#BAE6FD', '#C4B5FD', '#FDBA74', '#D9F99D',
      '#E0E7FF', '#FEF3C7', '#FCE7F3', '#D1FAE5',
    ],
    canvasBg: null,
    ringColors: ['#f9a8d4', '#c4b5fd', '#bae6fd'],
    hubInner: 'rgba(255,255,255,0.98)',
    hubMid: 'rgba(249,168,212,0.35)',
    hubOuter: 'rgba(196,181,253,0.2)',
    borderColor: 'rgba(0,0,0,0.07)',
    tickColor: 'rgba(0,0,0,0.07)',
    glowSegments: false,
  },
  {
    id: 'caramelo',
    name: 'Caramelo',
    emoji: '🍭',
    colors: [
      '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
      '#FF922B', '#845EF7', '#20C997', '#FA5252',
      '#FCC419', '#51CF66', '#339AF0', '#FF6B81',
    ],
    canvasBg: null,
    ringColors: ['#FF6B6B', '#FFD93D', '#4D96FF'],
    hubInner: 'rgba(255,255,255,0.98)',
    hubMid: 'rgba(255,107,107,0.25)',
    hubOuter: 'rgba(77,150,255,0.2)',
    borderColor: 'rgba(255,255,255,0.7)',
    tickColor: 'rgba(0,0,0,0.1)',
    glowSegments: false,
  },
  {
    id: 'bosque',
    name: 'Bosque',
    emoji: '🌿',
    colors: [
      '#166534', '#15803D', '#16A34A', '#14532D',
      '#3F6212', '#4D7C0F', '#365314', '#1A4731',
      '#065F46', '#064E3B', '#4A7C59', '#2D6A4F',
    ],
    canvasBg: null,
    ringColors: ['#166534', '#15803D', '#3F6212'],
    hubInner: 'rgba(255,255,255,0.95)',
    hubMid: 'rgba(22,163,74,0.3)',
    hubOuter: 'rgba(22,101,52,0.2)',
    borderColor: 'rgba(255,255,255,0.35)',
    tickColor: 'rgba(0,0,0,0.15)',
    glowSegments: false,
  },
  {
    id: 'oceano',
    name: 'Océano',
    emoji: '🌊',
    colors: [
      '#0EA5E9', '#06B6D4', '#14B8A6', '#3B82F6',
      '#6366F1', '#0891B2', '#0284C7', '#2563EB',
      '#0F766E', '#155E75', '#1D4ED8', '#0E7490',
    ],
    canvasBg: null,
    ringColors: ['#0ea5e9', '#06b6d4', '#14b8a6'],
    hubInner: 'rgba(255,255,255,0.95)',
    hubMid: 'rgba(14,165,233,0.35)',
    hubOuter: 'rgba(6,182,212,0.2)',
    borderColor: 'rgba(0,0,0,0.22)',
    tickColor: 'rgba(0,0,0,0.12)',
    glowSegments: false,
  },
  {
    id: 'otono',
    name: 'Otoño',
    emoji: '🍂',
    colors: [
      '#D97706', '#DC2626', '#92400E', '#B45309',
      '#7C2D12', '#F59E0B', '#EF4444', '#78350F',
      '#C2410C', '#A16207', '#9A3412', '#B91C1C',
    ],
    canvasBg: null,
    ringColors: ['#d97706', '#dc2626', '#92400e'],
    hubInner: 'rgba(255,255,255,0.95)',
    hubMid: 'rgba(217,119,6,0.35)',
    hubOuter: 'rgba(220,38,38,0.2)',
    borderColor: 'rgba(0,0,0,0.28)',
    tickColor: 'rgba(0,0,0,0.14)',
    glowSegments: false,
  },
  {
    id: 'retro',
    name: 'Retro',
    emoji: '📻',
    colors: [
      '#C47B2B', '#7B3F00', '#D4A853', '#8B6914',
      '#C17D3C', '#6B4226', '#E8C275', '#964B00',
      '#A0522D', '#CD853F', '#8B4513', '#D2691E',
    ],
    canvasBg: '#1a0f00',
    ringColors: ['#C47B2B', '#D4A853', '#8B6914'],
    hubInner: '#1a0f00',
    hubMid: '#3d2200',
    hubOuter: '#C47B2B',
    borderColor: 'rgba(255,200,100,0.2)',
    tickColor: 'rgba(255,200,100,0.3)',
    glowSegments: true,
  },
  {
    id: 'cebra',
    name: 'Cebra',
    emoji: '🦓',
    colors: [
      '#1a1a1a', '#f0f0f0', '#2d2d2d', '#e5e5e5',
      '#111111', '#d9d9d9', '#3a3a3a', '#cccccc',
      '#222222', '#ebebeb', '#444444', '#c0c0c0',
    ],
    canvasBg: null,
    ringColors: ['#333333', '#888888', '#cccccc'],
    hubInner: 'rgba(255,255,255,0.95)',
    hubMid: 'rgba(150,150,150,0.4)',
    hubOuter: 'rgba(50,50,50,0.3)',
    borderColor: 'rgba(100,100,100,0.4)',
    tickColor: 'rgba(0,0,0,0.2)',
    glowSegments: false,
  },
]

export const DEFAULT_STYLE_ID: WheelStyleId = 'clasica'

export function getStyle(id: WheelStyleId): WheelStyleDef {
  return WHEEL_STYLES.find((s) => s.id === id) ?? WHEEL_STYLES[0]!
}
