<template>
	<div id="register">
		<div class="container">
			<div class="card card-body mt-4">
				<h5 class="card-title">Register</h5>
				<form @submit.prevent="submit"> <!-- When this form gets submitted, we call the "submit" function -->
					<p v-if="errorMessage" class="error-message text-danger mb-4">{{ errorMessage }}</p>
					<input
						v-model="authStore.registrationFields.first_name"
						label="First Name"
						placeholder="Enter your first name"
					/>
					<input
						v-model="authStore.registrationFields.last_name"
						label="Last Name"
						placeholder="Enter your last name"
					/>
					<input
						v-model="authStore.registrationFields.email"
						label="Email"
						placeholder="Enter your email"
					/>
					<input
						v-model="authStore.registrationFields.password"
						label="Password"
						placeholder="Enter your password"
						type="password"
					/>
					<input
						v-model="authStore.registrationFields.confirm_password"
						label="Confirm Password"
						placeholder="Confirm your password"
						type="password"
					/>
					<button type="submit" class="btn btn-primary">Register</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="js">
import { useAuthStore } from '../../stores/useAuthStore';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const errorMessage = ref("");

async function submit(){
	console.log(authStore.registrationFields.password, authStore.registrationFields.password_confirm);

	if (authStore.registrationFields.password !== authStore.registrationFields.confirm_password) {	// If the passwords do not match, we set an error message and return
    	errorMessage.value = "Passwords do not match";
    	return;
 	}

  	try {
    	await authStore.register();

    	router.replace({ name: "login" });
	} catch (err) {
		errorMessage.value = err.message;
	}
}

</script>

<style scoped>

#register .card{
	max-width:40vw;
	margin: auto;
}

</style>
