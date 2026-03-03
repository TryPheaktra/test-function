import { useNetwork } from '@vueuse/core'
import { computed, watch, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useNetworkToast(minSpeed = 1.5) {
  const network = useNetwork()
  const toast = useToast()
  
  const hasShownOffline = ref(false)
  const hasShownSlow = ref(false)

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)
  const isSlow = computed(() => isOnline.value && downlink.value < minSpeed)

  // Show offline toast
  watch(isOnline, (online) => {
    if (!online && !hasShownOffline.value) {
      toast.add({
        severity: 'error',
        summary: 'No Internet',
        detail: 'Your internet connection is offline.',
        life: 4000
      })
      hasShownOffline.value = true
    }

    if (online) {
      hasShownOffline.value = false
    }
  })

  // Show slow toast
  watch(isSlow, (slow) => {
    if (slow && !hasShownSlow.value) {
      toast.add({
        severity: 'warn',
        summary: 'Slow Internet',
        detail: `Your speed is ${downlink.value} Mb/s. Saving may take longer.`,
        life: 4000
      })
      hasShownSlow.value = true
    }

    if (!slow) {
      hasShownSlow.value = false
    }
  })

  return { isOnline, downlink, isSlow }
}