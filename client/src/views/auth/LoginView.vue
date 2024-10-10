<template>
	<div id="login">
		<div class="container">
			<div class="card card-body mt-4">
				<h5 class="card-title">Login</h5>
				<form @submit.prevent="submit">
					<div class="mb-3">
						<label for="email" class="form-label">Email address</label>
						<input
							v-model="authStore.registrationFields.email"
							type="email"
							class="form-control"
							id="email"
							autocomplete="off"
						/>
					</div>
					<div class="mb-3">
						<label for="password" class="form-label">Password</label>
						<input
							v-model="authStore.registrationFields.password"
							type="password"
							class="form-control"
							id="password"
						/>
					</div>
					<button type="submit" class="btn btn-primary">Login</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="js">
import { useAuthStore } from '../../stores/useAuthStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const errorMessage = ref("");

async function submit(){

	console.log(authStore.registrationFields.email, authStore.registrationFields.password);

	try {
		console.log("Logging in with email: ", authStore.registrationFields.email, " and password: ", authStore.registrationFields.password)

		await authStore.login({
			email: authStore.registrationFields.email,
			password: authStore.registrationFields.password,
		})
		
		if (authStore.isAuthenticated) {
			console.log("${user} logged in successfully, redirecting...");
			router.replace({name: "owner-manager"})
		} else {
			console.log("Login failed, user is not authenticated");
		}
	} catch(err) {
			errorMessage.value = err.message
	}
}

</script>

<style scoped>

#login .card{
	max-width:40vw;
	margin: auto;
}

</style>
