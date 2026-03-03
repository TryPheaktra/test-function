import { useNetwork } from '@vueuse/core'
import { computed, watch, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useNetworkToast(minSpeed = 1.5) {
  const network = useNetwork()
  const toast = useToast()
  
  const hasShownOffline = ref(false)
  const hasShownSlow = ref(false)
  const hasShownBack = ref(false)

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)
  const isSlow = computed(() => isOnline.value && downlink.value < minSpeed)

  // 1️⃣ Offline toast
  watch(isOnline, (online) => {
    if (!online && !hasShownOffline.value) {
      toast.add({
        severity: 'error',
        summary: 'No Internet',
        detail: 'Your internet connection is offline.',
        life: 4000
      })
      hasShownOffline.value = true
      hasShownBack.value = false
    }

    if (online) {
      hasShownOffline.value = false
      // 3️⃣ show back online toast if speed is good
      if (!isSlow.value && !hasShownBack.value) {
        toast.add({
          severity: 'success',
          summary: 'Online',
          detail: 'Your internet is back to normal.',
          life: 4000
        })
        hasShownBack.value = true
      }
    }
  })

  // 2️⃣ Slow internet toast
  watch(isSlow, (slow) => {
    if (slow && !hasShownSlow.value) {
      toast.add({
        severity: 'warn',
        summary: 'Slow Internet',
        detail: `Your speed is ${downlink.value} Mb/s. Saving may take longer.`,
        life: 4000
      })
      hasShownSlow.value = true
      hasShownBack.value = false
    }

    if (!slow && isOnline.value && !hasShownBack.value) {
      toast.add({
        severity: 'success',
        summary: 'Internet is fast',
        detail: 'Your connection speed is back to normal.',
        life: 4000
      })
      hasShownSlow.value = false
      hasShownBack.value = true
    }
  })

  return { isOnline, downlink, isSlow }
}