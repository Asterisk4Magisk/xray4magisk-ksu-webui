import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../Dashboard.vue') },
    { path: '/setting', component: () => import('../Setting.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;