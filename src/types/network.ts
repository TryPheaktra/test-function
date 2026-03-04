import type { Ref } from "vue"

// types/network.ts
export interface NetworkState {
  online: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export interface SpeedTestResult {
  speedMbps: number
  duration: number
  bytesLoaded: number
  timestamp: number
}

export interface UseNetworkSpeedOptions {
  testUrl?: string
  fileSize?: number
  autoTest?: boolean
  maxRetries?: number
  timeout?: number
}

export interface UseNetworkSpeedReturn {
  speed: Ref<number | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  progress: Ref<number>
  retries: Ref<number>
  result: Ref<SpeedTestResult | null>
  testSpeed: () => Promise<void>
  reset: () => void
}