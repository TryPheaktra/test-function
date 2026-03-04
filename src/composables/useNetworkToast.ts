import { useNetwork, useIntervalFn } from '@vueuse/core'
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'

type NetworkState = 'online' | 'slow' | 'offline'

export function useNetworkToast(
  minSpeed = 1,        // Mb/s threshold
  maxRtt = 800,        // ms threshold
  interval = 3000      // check every 3 seconds
) {
  const network = useNetwork()
  const toast = useToast()

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)
  const rtt = computed(() => network.rtt.value ?? 0)

  const isSlow = computed(() => {
    return (
      isOnline.value &&
      (
        downlink.value < minSpeed ||
        rtt.value > maxRtt
      )
    )
  })

  let currentState: NetworkState = 'online'

  useIntervalFn(() => {

    // OFFLINE
    if (!isOnline.value && currentState !== 'offline') {
      toast.add({
        severity: 'error',
        summary: 'No Internet',
        detail: 'Your internet connection is offline.',
        life: 4000
      })
      currentState = 'offline'
      return
    }

    // SLOW
    if (isSlow.value && currentState !== 'slow') {
      toast.add({
        severity: 'warn',
        summary: 'Slow Internet',
        detail: `Speed: ${downlink.value} Mb/s | RTT: ${rtt.value} ms`,
        life: 4000
      })
      currentState = 'slow'
      return
    }

    // BACK TO NORMAL
    if (isOnline.value && !isSlow.value && currentState !== 'online') {
      toast.add({
        severity: 'success',
        summary: 'Internet Restored',
        detail: 'Your connection is back to normal.',
        life: 4000
      })
      currentState = 'online'
    }

  }, interval)

  return {
    isOnline,
    downlink,
    rtt,
    isSlow
  }
}