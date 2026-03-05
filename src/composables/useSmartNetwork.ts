import { ref, computed } from 'vue'
import { useNetwork, useIntervalFn } from '@vueuse/core'

export function useSmartNetwork() {

  const { isOnline } = useNetwork()

  const ping = ref(0)
  const signalBars = ref(0)
  const speed = ref(0)

  const connection = (navigator as any).connection

  const updateNetwork = async () => {

    if (!isOnline.value) {
      signalBars.value = 0
      return
    }

    // ⚡ Layer 1: Instant Browser API
    if (connection) {

      ping.value = connection.rtt || 0
      speed.value = connection.downlink || 0

    } 
    else {

      // fallback ping test
      const start = performance.now()

      try {

        await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-store'
        })

        ping.value = Math.round(performance.now() - start)

      } catch {
        ping.value = 999
      }
    }

    // 📡 Signal calculation
    if (ping.value < 120) signalBars.value = 4
    else if (ping.value < 300) signalBars.value = 3
    else if (ping.value < 700) signalBars.value = 2
    else signalBars.value = 1

  }

  useIntervalFn(updateNetwork, 1000, { immediate: true })

  const isSlow = computed(() => ping.value > 700)

  return {
    isOnline,
    ping,
    speed,
    signalBars,
    isSlow
  }

}