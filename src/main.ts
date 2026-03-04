import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';


import App from './App.vue'
import router from './router'


// Remove initial loader after mount
const loader = document.getElementById("initial-loader")
if (loader) loader.remove()
    
const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false,
        }
    }
});

app.use(createPinia())
app.use(router)
app.use(ToastService)

app.mount('#app')
