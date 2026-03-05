<script setup lang="ts">
import { computed } from 'vue'
import { useSmartNetwork } from '@/composables/useSmartNetwork'

const { isOnline, ping, signalBars, isSlow } = useSmartNetwork()

const showNetworkLoading = computed(() => {
  return !isOnline.value || isSlow.value
})
</script>
<template>

  <!-- WIFI LOADING PAGE -->
  <div
    v-if="showNetworkLoading"
    class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
  >
    <div class="flex flex-col items-center gap-6 text-center">

      <!-- WiFi Animation -->
      <div class="relative w-20 h-20 flex items-center justify-center">

        <div class="wifi wifi1"></div>
        <div class="wifi wifi2"></div>
        <div class="wifi wifi3"></div>

        <div class="dot"></div>

      </div>

      <h2 class="text-white text-lg font-semibold">
        {{ !isOnline ? 'No Internet Connection' : 'Network is Slow...' }}
      </h2>
      <p class="text-white/70 text-sm">
      Ping: {{ ping }} ms
      </p>


      <p class="text-white/70 text-sm">
        Connecting to network service...
      </p>
    </div>
  </div>

  <!-- NETWORK SIGNAL UI -->
  <div class="flex items-center space-x-3 p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 w-fit">
    <div class="flex items-end space-x-1 h-6 w-8">
      <div
        v-for="i in 4"
        :key="i"
        :style="{ height: (i * 25) + '%' }"
        :class="[
          'w-1.5 rounded-full transition-all duration-300 ease-out',
          i <= signalBars
            ? signalBars <= 1
              ? 'bg-red-500'
              : 'bg-emerald-400'
            : 'bg-black/20'
        ]"
      ></div>
    </div>

    <div class="flex flex-col">
      <span class="text-[10px] text-white/40 font-bold uppercase leading-none mb-1">
        Network
      </span>
      <span class="text-xs text-white font-mono leading-none">
        {{ isOnline ? `${ping}ms` : 'Offline' }}
      </span>
    </div>
  </div>

</template>

<style scoped>

.wifi {
  position: absolute;
  border: 4px solid transparent;
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: wifiPulse 1.5s infinite;
}

.wifi1 {
  width: 30px;
  height: 30px;
  animation-delay: 0s;
}

.wifi2 {
  width: 50px;
  height: 50px;
  animation-delay: 0.2s;
}

.wifi3 {
  width: 70px;
  height: 70px;
  animation-delay: 0.4s;
}

.dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
}

@keyframes wifiPulse {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
}

</style>