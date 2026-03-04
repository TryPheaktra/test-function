// composables/useNetworkSpeed.ts
import { ref } from 'vue'
import type { UseNetworkSpeedOptions, UseNetworkSpeedReturn, SpeedTestResult } from '@/types/network'

export function useNetworkSpeed(options: UseNetworkSpeedOptions = {}): UseNetworkSpeedReturn {
  const {
    testUrl = 'https://example.com/test-file.bin',
    fileSize = 1_000_000,
    autoTest = false,
    maxRetries = 3,
    timeout = 30_000
  } = options

  const speed = ref<number | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const progress = ref<number>(0)
  const retries = ref<number>(0)
  const result = ref<SpeedTestResult | null>(null)

  const testSpeed = async (): Promise<void> => {
    loading.value = true
    error.value = null
    speed.value = null
    progress.value = 0

    const startTime = performance.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(testUrl, {
        cache: 'no-store',
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentLength = response.headers.get('content-length')
      const expectedSize = contentLength ? parseInt(contentLength, 10) : fileSize

      const reader = response.body?.getReader()
      if (!reader) throw new Error('ReadableStream not supported')

      let loaded = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        loaded += value.length
        progress.value = Math.min(100, Math.round((loaded / expectedSize) * 100))
      }

      clearTimeout(timeoutId)
      const endTime = performance.now()
      const durationInSeconds = (endTime - startTime) / 1000
      const bitsLoaded = loaded * 8
      const speedBps = bitsLoaded / durationInSeconds
      const speedMbps = Number((speedBps / (1024 * 1024)).toFixed(2))

      speed.value = speedMbps
      result.value = {
        speedMbps,
        duration: Number(durationInSeconds.toFixed(3)),
        bytesLoaded: loaded,
        timestamp: Date.now()
      }
      retries.value = 0
    } catch (err) {
      clearTimeout(timeoutId)
      const message = err instanceof Error ? err.message : 'Unknown error'

      if (retries.value < maxRetries && message !== 'The operation was aborted') {
        retries.value++
        await new Promise(resolve => setTimeout(resolve, 1000 * retries.value))
        return testSpeed()
      }

      error.value = message
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    speed.value = null
    loading.value = false
    error.value = null
    progress.value = 0
    retries.value = 0
    result.value = null
  }

  if (autoTest) {
    testSpeed()
  }

  return { speed, loading, error, progress, retries, result, testSpeed, reset }
}