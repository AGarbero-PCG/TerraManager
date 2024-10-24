<!-- client/src/App.vue -->
<template>
	<div id="app" class="min-h-screen h-full bg-gray-900">
		<NavBar />
		<RouterView />
	</div>
</template>

<script setup lang="js">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import NavBar from './components/NavBar.vue';

import { useAuthStore } from './stores/useAuthStore';

const router = useRouter();
onMounted(async () => {
  let authStore = useAuthStore();
	if (window.localStorage.getItem("currentUser")) {
    app.currentUser = window.localStorage.getItem("currentUser");
    authStore.user = window.localStorage.getItem("currentUser");
		authStore.isAuthenticated = true;
	}
	if(authStore.isLoggedIn){
		router.replace({name: "dashboard"})
	}
})
</script>
