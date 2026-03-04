<script setup lang="ts">
import { useNetwork , useInterval} from '@vueuse/core'
import { useNetworkToast } from './composables/useNetworkToast';
import { useSafeNetwork } from './composables/useSafeNetwork';
// import { onMounted, watch } from 'vue';

// const { 
//   isOnline, 
//   downlink, 
//   effectiveType, 
//   rtt, 
//   saveData 
// } = useNetwork()
const { isOnline, downlink, rtt, effectiveType, saveData } = useSafeNetwork(1000)
// onMounted(() => {
//   useNetworkToast(1.5) // minimum speed threshold in Mb/s
// })

useNetworkToast(1, 800, 3000) // minimum speed threshold in Mb/s, check every 1000ms (1s)
// watch(isOnline, (newStatus) => {
//   console.log(`Network status changed: ${newStatus ? 'Online' : 'Offline'}`);
//   useNetworkToast(1.5) // re-evaluate on status change
// })
</script>

<template>
  <Toast />
  <div class="p-4 space-y-2">
    <p>Status: 
      <span :class="isOnline ? 'text-green-500' : 'text-red-500'">
        {{ isOnline ? 'Online' : 'Offline' }}
      </span>
    </p>

    <p>Connection Type: {{ effectiveType }}</p>
    <p>Speed (Downlink): {{ downlink }} Mb/s</p>
    <p>Latency (RTT): {{ rtt }} ms</p>
    <p>Save Data Mode: {{ saveData }}</p>
  </div>
</template>