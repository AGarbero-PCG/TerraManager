<!-- client/src/views/LoginView.vue -->
<template>
	<div
		class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				class="mx-auto h-10 w-auto"
				src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
				alt="Your Company"
			/>
			<h2
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white"
			>
				Sign in to your account
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<!-- Login Form -->
			<form class="space-y-6" @submit.prevent="submit">
				<div>
					<label
						for="email"
						class="block text-sm font-medium leading-6 text-white"
						>Email address</label
					>
					<div class="mt-2">
						<input
							v-model="loginData.email"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="block text-sm font-medium leading-6 text-white"
							>Password</label
						>
						<div class="text-sm">
							<a
								href="#"
								class="font-semibold text-indigo-400 hover:text-indigo-300"
								>Forgot password?</a
							>
						</div>
					</div>
					<div class="mt-2">
						<input
							v-model="loginData.password"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<!-- Error Message (if any) -->
				<div v-if="errorMessage" class="text-sm text-red-500">
					{{ errorMessage }}
				</div>

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						Sign in
					</button>
				</div>
			</form>

			<!-- Redirect to register page -->
			<p class="mt-10 text-center text-sm text-gray-400">
				Not a member?
				<router-link
					to="/register"
					class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
					>Register</router-link
				>
			</p>
		</div>
	</div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// Create reactive data for login credentials
const loginData = reactive({
	email: "",
	password: "",
});

// Reactive state for the error message
const errorMessage = ref("");

// Access authentication store and router
const authStore = useAuthStore();
const router = useRouter();

// Submit login form
async function submit() {
	try {
		// Attempt to log the user in
		await authStore.login(loginData);
		// Redirect to the dashboard (or other authenticated route)
		router.replace({ name: "dashboard" });
	} catch (error) {
		// Display any login errors
		errorMessage.value = error.message;
	}
}
</script>
