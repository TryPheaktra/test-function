import { ref, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'

export function useRealNetwork() {
  const isOnline = ref(true)
  const rtt = ref(0)
  const downlink = ref(0)

  // 🔥 RTT Test
  const measureRTT = async () => {
    try {
      const start = performance.now()

      await fetch('https://speedtest.fiveword2.workers.dev/ping?' + Date.now(), {
        cache: 'no-store'
      })

      rtt.value = Math.round(performance.now() - start)
      isOnline.value = true
    } catch {
      isOnline.value = false
      rtt.value = 0
    }
  }

  // 🔥 Speed Test
  const measureSpeed = async () => {
    try {
      const start = performance.now()

      const res = await fetch('https://speedtest.fiveword2.workers.dev/speed-test?' + Date.now())
      const blob = await res.blob()

      const duration = (performance.now() - start) / 1000
      const bits = blob.size * 8

      downlink.value = Number((bits / duration / 1024 / 1024).toFixed(2))
    } catch {
      downlink.value = 0
    }
  }

  useIntervalFn(measureRTT, 2000)      // every 2s
  useIntervalFn(measureSpeed, 10000)   // every 10s

  const networkState = computed(() => {
    if (!isOnline.value) return 'offline'
    if (rtt.value > 500 || downlink.value < 1) return 'slow'
    return 'online'
  })

  return { isOnline, rtt, downlink, networkState }
}