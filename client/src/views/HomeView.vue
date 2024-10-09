<script setup lang="js">
</script>

<template>
  	<main>
		<div class="home-page container">
		<div class="welcome-section text-center mt-5">
		<h1 class="display-4">Welcome to Terra Manager</h1>
		<p class="lead mt-3">Your all-in-one solution for managing land holdings and ownership details efficiently.</p>
		<hr class="my-4">
		<div class="mt-4">
			<router-link to="/owner-manager" class="btn btn-primary btn-lg me-3">Get Started</router-link>
		</div>
		</div>
		</div>
  	</main>
</template>

<style scoped>

.home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	text-align: center;
}

</style>
