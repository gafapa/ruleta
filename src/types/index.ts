export interface WheelItem {
  id: string
  label: string
  color: string
}

export interface SavedWheel {
  id: string
  name: string
  items: WheelItem[]
  createdAt: number
}

export interface SpinResult {
  item: WheelItem
  segmentIndex: number
  /** Color from the active wheel style (may differ from item.color) */
  displayColor: string
}

export interface AppState {
  items: WheelItem[]
  wheelName: string
  isSpinning: boolean
  result: SpinResult | null
}

export type AppAction =
  | { type: 'SET_ITEMS'; payload: WheelItem[] }
  | { type: 'SET_WHEEL_NAME'; payload: string }
  | { type: 'SET_SPINNING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: SpinResult | null }
  | { type: 'ELIMINATE_RESULT' }
  | { type: 'LOAD_WHEEL'; payload: { items: WheelItem[]; name: string } }
