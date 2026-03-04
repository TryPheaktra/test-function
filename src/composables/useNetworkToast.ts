import { useNetwork, useIntervalFn } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useNetworkToast(minSpeed = 1.5, checkInterval = 1000) {
  const network = useNetwork()
  const toast = useToast()

  const hasShownOffline = ref(false)
  const hasShownSlow = ref(false)
  const hasShownBack = ref(false)

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)
  const isSlow = computed(() => isOnline.value && downlink.value < minSpeed)

  // Use VueUse interval to check every `checkInterval` ms
  useIntervalFn(() => {
    // Offline check
    if (!isOnline.value && !hasShownOffline.value) {
      toast.add({
        severity: 'error',
        summary: 'No Internet',
        detail: 'Your internet connection is offline.',
        life: 4000
      })
      hasShownOffline.value = true
      hasShownBack.value = false
    }

    // Online again
    if (isOnline.value && !isSlow.value && !hasShownBack.value) {
      toast.add({
        severity: 'success',
        summary: 'Online',
        detail: 'Your internet is back to normal.',
        life: 4000
      })
      hasShownOffline.value = false
      hasShownBack.value = true
    }

    // Slow internet check
    if (isSlow.value && !hasShownSlow.value) {
      toast.add({
        severity: 'warn',
        summary: 'Slow Internet',
        detail: `Your speed is ${downlink.value} Mb/s. Saving may take longer.`,
        life: 4000
      })
      hasShownSlow.value = true
      hasShownBack.value = false
    }

    // Speed back to normal
    if (!isSlow.value && isOnline.value && !hasShownBack.value) {
      toast.add({
        severity: 'success',
        summary: 'Internet fast',
        detail: 'Connection speed is back to normal.',
        life: 4000
      })
      hasShownSlow.value = false
      hasShownBack.value = true
    }

  }, checkInterval) // check every 2000ms (2s) by default

  return { isOnline, downlink, isSlow }
}