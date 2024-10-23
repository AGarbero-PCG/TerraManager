<!-- client/src/components/drawers/CreateUpdateOwners.vue -->
<template>
	<TransitionRoot as="template" :show="isVisible">
		<Dialog class="relative z-10" @close="closeDrawer">
			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
					>
						<TransitionChild
							as="template"
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enter-from="translate-x-full"
							enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leave-from="translate-x-0"
							leave-to="translate-x-full"
						>
							<DialogPanel class="pointer-events-auto w-screen max-w-md">
								<div
									class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
								>
									<div
										class="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6"
									>
										<div class="px-4 sm:px-6">
											<div class="flex items-start justify-between">
												<DialogTitle
													class="text-base font-semibold leading-6 text-gray-900"
													>{{
														mode === "create" ? "Create Owner" : "Update Owner"
													}}</DialogTitle
												>
												<div class="ml-3 flex h-7 items-center">
													<button
														type="button"
														class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
														@click="closeDrawer"
													>
														<span class="absolute -inset-2.5" />
														<span class="sr-only">Close panel</span>
														<XMarkIcon class="h-6 w-6" aria-hidden="true" />
													</button>
												</div>
											</div>
										</div>
										<div class="relative mt-6 flex-1 px-4 sm:px-6">
											<form @submit.prevent="handleSubmit">
												<!-- Owner Name -->
												<div class="form-floating mb-3">
													<input
														v-model="ownerData.name"
														type="text"
														class="form-control"
														id="name"
														required
													/>
													<label for="name">Name</label>
												</div>
												<!-- Entity Type -->
												<div class="form-floating mb-3">
													<select
														v-model="ownerData.entity_type"
														class="form-select"
														id="entity_type"
													>
														<option value="Company">Company</option>
														<option value="Individual">Individual</option>
														<option value="Investor">Investor</option>
														<option value="Trust">Trust</option>
													</select>
													<label for="entity_type">Entity Type</label>
												</div>
												<!-- Owner Type -->
												<div class="form-floating mb-3">
													<select
														v-model="ownerData.owner_type"
														class="form-select"
														id="owner_type"
													>
														<option value="Competitor">Competitor</option>
														<option value="Seller">Seller</option>
														<option value="Investor">Investor</option>
														<option value="Professional">Professional</option>
													</select>
													<label for="owner_type">Owner Type</label>
												</div>
												<!-- Address -->
												<div class="form-floating mb-3">
													<input
														v-model="ownerData.address"
														type="text"
														class="form-control"
														id="address"
														required
													/>
													<label for="address">Address</label>
												</div>

												<div class="flex flex-shrink-0 justify-end px-4 py-4">
													<button
														type="button"
														class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
														@click="closeDrawer"
													>
														Cancel
													</button>
													<button
														type="submit"
														class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
													>
														{{
															mode === "create"
																? "Create Owner"
																: "Update Owner"
														}}
													</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { reactive, ref, watch } from "vue";
import { useOwnerStore } from "../../stores/useOwnerStore";

const isUpdateMode = ref(false);
const errorMessage = ref("");

// Initialize store
const ownerStore = useOwnerStore();

// Props for mode and selected owner
const props = defineProps({
	isVisible: Boolean,
	mode: String, // 'create' or 'update'
	owner: Object,
});

// Reactive state for the owner data
const ownerData = reactive({
	name: "",
	entity_type: "Company",
	owner_type: "Competitor",
	address: "",
	total_land_holdings: 0,
});
// const ownerData = reactive({ ...props.owner });

// Emits the close event
const emit = defineEmits(["close"]);

// Watch for changes in the selected owner and update ownerData accordingly
watch(
	() => props.owner,
	(newOwner) => {
		if (newOwner) {
			ownerData._id = newOwner._id;
			ownerData.name = newOwner.name;
			ownerData.entity_type = newOwner.entity_type;
			ownerData.owner_type = newOwner.owner_type;
			ownerData.address = newOwner.address;
			ownerData.total_land_holdings = newOwner.total_land_holdings;
		}
	},
	{ immediate: true } // Ensures that the initial value is also caught
);

// Function to close the drawer
function closeDrawer() {
	emit("close");
}

// Handle form submit
async function handleSubmit() {
	if (props.mode === "create") {
		console.log("Creating owner...");
		await handleCreateOwner();
	} else {
		console.log("Updating owner...");
		await handleUpdateOwner();
	}
	closeDrawer();
}

// Function to handle Create Owner form submission
async function handleCreateOwner() {
	try {
		await ownerStore.createOwner(ownerData);
		console.log("Owner created successfully!: ", ownerData);

		errorMessage.value = ""; // Reset error message

		// Reset the form fields after successful creation
		ownerData.name = "";
		ownerData.entity_type = "Company";
		ownerData.owner_type = "Competitor";
		ownerData.address = "";
		ownerData.total_land_holdings = 0;
	} catch (error) {
		console.error("Error creating owner:" + error.message);
		errorMessage.value = "Failed to create owner. Please try again.";
	}
}

// Function to handle Update Owner form submission
async function handleUpdateOwner() {
	if (!ownerData._id) {
		console.error("No owner ID found for update");
		errorMessage.value = "No owner ID found for update";
		return;
	}

	try {
		// Call the updateOwner method from the store
		await ownerStore.updateOwner(ownerData);
		console.log("Owner updated successfully!");
		await ownerStore.getOwners(); // Refresh the owner list
	} catch (error) {
		console.error("Error updating owner:" + error.message);
		errorMessage.value = "Failed to update owner. Please try again.";
	}
}
</script>
