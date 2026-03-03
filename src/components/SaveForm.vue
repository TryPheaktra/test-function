<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const toast = useToast()
const loading = ref(false)

const saveData = async () => {
  try {
    loading.value = true

    await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'Test',
      body: 'Save form example'
    }, { timeout: 8000 }) // timeout in ms

    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Data saved successfully',
      life: 3000
    })

  } catch (error: any) {

    // network / timeout error
    if (!error.response) {
      toast.add({
        severity: 'error',
        summary: 'Network Error',
        detail: 'Saving failed. Please check your connection.',
        life: 4000
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form">
    <h2>Create Data</h2>
    <Button 
      label="Save" 
      :loading="loading"
      @click="saveData"
    />
  </div>
</template>