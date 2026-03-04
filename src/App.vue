<script setup lang="ts">
import { useNetwork , useInterval} from '@vueuse/core'
import { useNetworkToast } from './composables/useNetworkToast';
import { useSafeNetwork } from './composables/useSafeNetwork';
import { useRealNetwork } from './composables/useRealNetwork';
// import { onMounted, watch } from 'vue';

// const { 
//   isOnline, 
//   downlink, 
//   effectiveType, 
//   rtt, 
//   saveData 
// } = useNetwork()
// const { isOnline, downlink, rtt, effectiveType, saveData } = useSafeNetwork(1000)
const { isOnline, rtt, downlink, networkState } = useRealNetwork()
// onMounted(() => {
//   useNetworkToast(1.5) // minimum speed threshold in Mb/s
// })

useNetworkToast(1, 500, 1000) // minimum speed threshold in Mb/s, check every 1000ms (1s)
// watch(isOnline, (newStatus) => {
//   console.log(`Network status changed: ${newStatus ? 'Online' : 'Offline'}`);
//   useNetworkToast(1.5) // re-evaluate on status change
// })
</script>

<template>
  <div class="p-6 space-y-4">

    <!-- Signal Bars -->
    <div class="flex items-end space-x-1 h-10">
      <div
        v-for="n in 4"
        :key="n"
        class="w-3 rounded transition-all"
        :class="[
          n <= (networkState === 'online' ? 4 :
                networkState === 'slow' ? 2 : 0)
            ? networkState === 'online'
              ? 'bg-green-500'
              : networkState === 'slow'
              ? 'bg-yellow-400'
              : 'bg-red-500'
            : 'bg-gray-300',
          n === 1 ? 'h-3' :
          n === 2 ? 'h-5' :
          n === 3 ? 'h-7' : 'h-9'
        ]"
      />
    </div>

    <div>
      <p>Status: {{ networkState }}</p>
      <p>RTT: {{ rtt }} ms</p>
      <p>Speed: {{ downlink }} Mb/s</p>
    </div>

  </div>
</template>