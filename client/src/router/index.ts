import { useAuthStore } from '@/stores/auth'
import { useOwnerStore } from '@/stores/owner'
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
			component: () => import('../views/auth/LoginView.vue'),
			meta: { requiresGuest: true } // Only allows guest users to enter login route.
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/auth/RegisterView.vue'),
			meta: { requiresGuest: true }  // Only allows guest users to enter register route.
		},
		{
			path: '/user',
			name: 'user',
			component: () => import('../views/auth/UserView.vue'),
			meta: { requiresAuth: true } // Only allows authenticated users to enter user route.
		},
		{
			path: '/owner-manager',
			name: 'owner-manager',
			component: () => import('../views/main/OwnerManager.vue'),
			meta: { requiresAuth: true } // Only allows authenticated users to enter user route.
		},
		{
			path: '/land-holding-manager',
			name: 'land-holding-manager',
			component: () => import('../views/main/LandHoldingModal.vue'),
			props: true,
			meta: { requiresAuth: true } // Only allows authenticated users to enter user route.
		}
	]
})

router.beforeEach((to, from) => {

	const store = useAuthStore() // Necessary to access authenticated user for check below

	if (to.meta.requiresAuth && !store.isAuthenticated) {
		// If the route requires authentication and the user is NOT authenticated, redirect to login page
		return { name: 'login', query: { redirect: to.fullPath } } // Save the previous URL and if we login, we can come back to the route
	} else if (to.meta.requiresGuest && store.isAuthenticated) { // If no...
		// If the route requires the user to be a guest, redirect to home page
		return { name: 'home' }
	}
})

export default router
