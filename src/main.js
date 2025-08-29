import { createApp } from 'vue'
import App from './App.vue'
import './css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/style.css'

const app = createApp(App)
window.vm = app.mount('#app');

