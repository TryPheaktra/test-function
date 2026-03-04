import { useNetwork, useIntervalFn } from '@vueuse/core'
import { ref, computed } from 'vue'

export function useSafeNetwork(checkInterval = 1000) {
  const network = useNetwork()

  const isOnline = ref(true)
  const downlink = ref(0)
  const rtt = ref(0)
  const effectiveType = ref('unknown')
  const saveData = ref(false)
  const isSlow = ref(false)

  useIntervalFn(() => {
    isOnline.value = network.isOnline.value ?? false
    downlink.value = network.downlink.value ?? 0
    rtt.value = network.rtt.value ?? 0
    effectiveType.value = network.effectiveType.value ?? 'unknown'
    saveData.value = network.saveData.value ?? false

    isSlow.value =
      downlink.value < 1 ||
      effectiveType.value === '2g' ||
      effectiveType.value === 'slow-2g'
  }, checkInterval)

  return { isOnline, downlink, rtt, effectiveType, saveData, isSlow }
}