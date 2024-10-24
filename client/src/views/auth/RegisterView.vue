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
				Create your account
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" @submit.prevent="submit">
				<!-- Error message if there's an error -->
				<div v-if="errorMessage" class="text-sm text-red-500">
					{{ errorMessage }}
				</div>

				<!-- Email Input -->
				<div>
					<label
						for="email"
						class="block text-sm font-medium leading-6 text-white"
						>Email address</label
					>
					<div class="mt-2">
						<input
							v-model="registerData.email"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<!-- Password Input -->
				<div>
					<label
						for="password"
						class="block text-sm font-medium leading-6 text-white"
						>Password</label
					>
					<div class="mt-2">
						<input
							v-model="registerData.password"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						Create account
					</button>
				</div>
			</form>

			<!-- Link to Login page -->
			<p class="mt-10 text-center text-sm text-gray-400">
				Already have an account?
				<router-link
					to="/login"
					class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
				>
					Sign in
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup>
import { useAuthStore } from "../../stores/useAuthStore";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const registerData = reactive({
	email: "",
	password: "",
});

const errorMessage = ref("");

async function submit() {
	try {
		await authStore.register(registerData);
		router.replace({ name: "login" });
	} catch (err) {
		errorMessage.value = err.message;
	}
}
</script>

<style scoped>
/* Optional custom styling if needed */
</style>
