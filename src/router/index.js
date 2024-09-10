import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../Dashboard.vue') },
    { path: '/setting', component: () => import('../Setting.vue') },
    { path: '/manage', component: () => import('../Manage.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;