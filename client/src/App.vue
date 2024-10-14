<template>
  <div id="app">
	<NavBar />
	<RouterView />
  </div>
</template>

<script setup lang="js">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import NavBar from './components/NavBar.vue';

import { useAuthStore } from './stores/auth';

onMounted(async () => {
  let authStore = useAuthStore();
	if (window.localStorage.getItem("currentUser")) {
    app.currentUser = window.localStorage.getItem("currentUser");
    authStore.user = window.localStorage.getItem("currentUser");
		authStore.isAuthenticated = true;
	}
	if(authStore.isLoggedIn){
		router.replace({name: "owner-manager"})
	}
})
</script>