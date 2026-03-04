import { ref, type Ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'

// Define network states
export type NetworkState = 'online' | 'slow' | 'offline'

export function useDeviceNetwork(BASE_URL: string) {
  const isOnline: Ref<boolean> = ref(true)
  const rtt: Ref<number> = ref(0)
  const downlink: Ref<number> = ref(0)
  const networkState: Ref<NetworkState> = ref('online')

  // Ping Test → RTT
  const measureRTT = async (): Promise<void> => {
    try {
      const start = performance.now()
      await fetch(`${BASE_URL}/ping?${Date.now()}`, { cache: 'no-store' })
      rtt.value = Math.round(performance.now() - start)
      isOnline.value = true
    } catch {
      isOnline.value = false
      rtt.value = 0
    }
  }

  // Download Speed Test → downlink in Mb/s
  const measureDownlink = async (): Promise<void> => {
    try {
      const start = performance.now()
      const res = await fetch(`${BASE_URL}/speed-test?${Date.now()}`)
      const blob = await res.blob()
      const duration = (performance.now() - start) / 1000
      const bits = blob.size * 8
      downlink.value = Number((bits / duration / 1024 / 1024).toFixed(2))
    } catch {
      downlink.value = 0
    }
  }

  // Determine network state
  const updateNetworkState = (): void => {
    if (!isOnline.value) networkState.value = 'offline'
    else if (rtt.value > 500 || downlink.value < 1) networkState.value = 'slow'
    else networkState.value = 'online'
  }

  // Run every 5 seconds
  useIntervalFn(async () => {
    await measureRTT()
    await measureDownlink()
    updateNetworkState()
  }, 5000)

  return { isOnline, rtt, downlink, networkState }
}