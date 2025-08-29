import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/bootstrap.min.css'
import './css/style.css'
import './css/cb99d2ce.css'
import './css/c06c2e0b.css'
import './css/3f3b9e93.css'
import './css/7eee21da.css'
import './css/cbd01b6b.css'
import './css/eeb9aef7.css'

// 기본코드
// createApp(App).mount('#app')

// 개발자도구 디버깅용 코드
const app = createApp(App)
window.vm = app.mount('#app');
