import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/HomeView.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/auth/LoginView.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/auth/RegisterView.vue')
		},
		{
			path: '/user',
			name: 'user',
			component: () => import('../views/auth/UserView.vue')
		}
	]
})

export default router