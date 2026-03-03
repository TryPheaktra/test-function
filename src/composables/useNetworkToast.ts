import { useNetwork } from '@vueuse/core'
import { computed, watch, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useNetworkToast(minSpeed = 1.5) {
  const network = useNetwork()
  const toast = useToast()

  const hasShown = ref(false)

  const isOnline = computed(() => network.isOnline.value ?? false)
  const downlink = computed(() => network.downlink.value ?? 0)

  const isSlow = computed(() => isOnline.value && downlink.value < minSpeed)

  watch(isSlow, (slow) => {
    if (slow && !hasShown.value) {
      toast.add({
        severity: 'warn',
        summary: 'Slow Internet',
        detail: `Your speed is ${downlink.value} Mb/s. Saving may take longer.`,
        life: 4000
      })
      hasShown.value = true
    }

    if (!slow) {
      hasShown.value = false
    }
  })

  return { isOnline, isSlow }
}