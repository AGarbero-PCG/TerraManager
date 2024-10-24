<template>
	<header class="bg-gray-900">
		<nav
			class="flex items-center justify-between p-6 lg:px-8"
			aria-label="Global"
		>
			<div class="flex lg:flex-1">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Terra Manager</span>
					<img
						class="h-8 w-auto"
						src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
						alt="Terra Manager Logo"
					/>
				</a>
			</div>
			<div class="flex lg:hidden">
				<button
					type="button"
					class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
					@click="mobileMenuOpen = true"
				>
					<span class="sr-only">Open main menu</span>
					<Bars3Icon class="h-6 w-6" aria-hidden="true" />
				</button>
			</div>
			<!-- Desktop Menu -->
			<div class="hidden lg:flex lg:gap-x-12">
				<a
					v-for="item in filteredNavigation"
					:key="item.name"
					:href="item.href"
					class="text-sm font-semibold leading-6 text-white"
					>{{ item.name }}</a
				>
			</div>
			<div class="hidden lg:flex lg:flex-1 lg:justify-end">
				<router-link
					v-if="!isAuthenticated"
					to="/login"
					class="text-sm font-semibold leading-6 text-white"
					>Login <span aria-hidden="true">&rarr;</span></router-link
				>
				<router-link
					v-if="!isAuthenticated"
					to="/register"
					class="ml-4 text-sm font-semibold leading-6 text-white"
					>Register</router-link
				>
				<a
					v-if="isAuthenticated"
					href="#"
					class="text-sm font-semibold leading-6 text-white"
					@click.prevent="logout"
					>Logout <span aria-hidden="true">&rarr;</span></a
				>
			</div>
		</nav>

		<!-- Mobile Menu -->
		<Dialog
			@close="mobileMenuOpen = false"
			:open="mobileMenuOpen"
			class="lg:hidden"
		>
			<div class="fixed inset-0 z-50" />
			<DialogPanel
				class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
			>
				<div class="flex items-center justify-between">
					<a href="/" class="-m-1.5 p-1.5">
						<span class="sr-only">Terra Manager</span>
						<img
							class="h-8 w-auto"
							src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
							alt="Terra Manager Logo"
						/>
					</a>
					<button
						type="button"
						class="-m-2.5 rounded-md p-2.5 text-gray-400"
						@click="mobileMenuOpen = false"
					>
						<span class="sr-only">Close menu</span>
						<XMarkIcon class="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div class="mt-6 flow-root">
					<div class="-my-6 divide-y divide-gray-500/25">
						<div class="space-y-2 py-6">
							<a
								v-for="item in filteredNavigation"
								:key="item.name"
								:href="item.href"
								class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
								>{{ item.name }}</a
							>
						</div>
						<div class="py-6">
							<router-link
								v-if="!isAuthenticated"
								to="/login"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
								>Login</router-link
							>
							<router-link
								v-if="!isAuthenticated"
								to="/register"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
								>Register</router-link
							>
							<a
								v-if="isAuthenticated"
								href="#"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
								@click.prevent="logout"
								>Logout</a
							>
						</div>
					</div>
				</div>
			</DialogPanel>
		</Dialog>
	</header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

// Navigation items for both authenticated and unauthenticated users
const navigationUnauthenticated = [{ name: "Home", href: "/" }];

const navigationAuthenticated = [
	{ name: "Home", href: "/" },
	{ name: "Owner Manager", href: "/dashboard" },
];

// Reactive state for mobile menu
const mobileMenuOpen = ref(false);

// Access authentication store
const authStore = useAuthStore();

// Access router for redirection
const router = useRouter();

// Computed property for authentication status
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Filtered navigation based on auth status
const filteredNavigation = computed(() => {
	return isAuthenticated.value
		? navigationAuthenticated
		: navigationUnauthenticated;
});

// Logout function with redirection
const logout = async () => {
	await authStore.logout();
	router.push("/login"); // Redirect to login page after logout
};
</script>
