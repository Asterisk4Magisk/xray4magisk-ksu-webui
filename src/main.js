import {createApp} from 'vue'
import App from './App.vue'
import VueRouter from './router'
import i18n from './locales/i18n'

createApp(App).use(i18n).use(VueRouter).mount('#app')
