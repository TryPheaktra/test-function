<script setup lang="ts">
import { useNetworkToast } from '@/composables/useNetworkToast'
useNetworkToast(1.5) // minimum speed threshold
</script>

<template>
  <Toast />
  <slot />
</template>