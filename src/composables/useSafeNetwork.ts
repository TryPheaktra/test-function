import { useNetwork } from '@vueuse/core'
import { computed } from 'vue'

export function useSafeNetwork() {
  const network = useNetwork()

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)
  const rtt = computed(() => network.rtt.value ?? 0)
  const effectiveType = computed(() => network.effectiveType.value ?? 'unknown')

  const isSlow = computed(() => {
    return (
      downlink.value < 1 ||
      effectiveType.value === '2g' ||
      effectiveType.value === 'slow-2g'
    )
  })

  return {
    isOnline,
    downlink,
    rtt,
    effectiveType,
    isSlow,
  }
}