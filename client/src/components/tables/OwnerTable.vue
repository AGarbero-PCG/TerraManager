<!-- client/src/components/tables/OwnerTable.vue -->
<template>
	<div class="h-full">
		<div class="min-h-full">
			<div class="bg-gray-800 pb-32">
				<header class="py-10">
					<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 class="text-3xl font-bold tracking-tight text-white">
							Owner Manager
						</h1>
					</div>
				</header>
			</div>

			<main class="-mt-32">
				<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
					<div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
						<!-------------------------------------- Table of Owners -------------------------------------->
						<div class="px-4 sm:px-6 lg:px-8">
							<div class="sm:flex sm:items-center">
								<div class="sm:flex-auto">
									<h1 class="text-base font-semibold leading-6 text-gray-900">
										All Owners
									</h1>
									<!-- Error Message -->
									<p v-if="errorMessage" class="error-message text-red-600">
										{{ errorMessage }}
									</p>
									<p class="mt-2 text-sm text-gray-700">
										A list of all the owners visible to you including their
										name, entity type, and more.
									</p>
								</div>
								<!-- Open create owner drawer -->
								<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none cursor-pointer">
									<font-awesome-icon
										:icon="['fas', 'user-plus']"
										size="2x"
										@click="openCreateDrawer('create')"
									/>
									Add Owner
								</div>
							</div>
							<div class="mt-8 flow-root">
								<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
									<div
										class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
									>
										<table class="min-w-full divide-y divide-gray-300">
											<!-- Table headers -->
											<thead>
												<tr>
													<th
														scope="col"
														class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
													>
														Name
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Entity Type
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Owner Type
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Address
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Total Land Holdings
													</th>
													<th
														scope="col"
														class="relative py-3.5 pl-3 pr-4 sm:pr-3"
														id="landholdingModal"
													></th>
													<th
														scope="col"
														class="relative py-3.5 pl-3 pr-4 sm:pr-3"
														id="update"
													></th>
													<th
														scope="col"
														class="relative py-3.5 pl-3 pr-4 sm:pr-3"
														id="delete"
													></th>
												</tr>
											</thead>
											<!-- Populated Data -->
											<tbody class="bg-white">
												<tr
													v-for="owner in owners"
													:key="owner._id"
													class="even:bg-gray-50"
												>
													<td
														class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
													>
														{{ owner.name }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ owner.entity_type }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ owner.address }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ owner.total_land_holdings }}
													</td>
													<!-- Open create landholding drawer -->
													<td
														class="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
													>
														<div>
															<font-awesome-icon
																:icon="['fas', 'house']"
																style="color: #000000"
																size="2x"
																@click="
																	openCreateUpdateLandHoldingDrawer(owner)
																"
															/>
														</div>
													</td>
													<!-- Open update owner drawer -->
													<td
														class="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
													>
														<div>
															<font-awesome-icon
																:icon="['fas', 'pen-to-square']"
																size="2x"
																@click="openUpdateDrawer(owner)"
															/>
														</div>
													</td>
													<!-- Open delete owner modal -->
													<td
														class="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
													>
														<div>
															<font-awesome-icon
																:icon="['fas', 'trash']"
																size="2x"
																@click="openDeleteModal(owner)"
															/>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<!-- create/update owner drawer component -->
							<CreateUpdateOwner
								:isVisible="isOwnerDrawerVisible"
								:mode="isUpdateMode ? 'update' : 'create'"
								:owner="selectedOwner"
								@close="closeDrawer"
							/>
							<!-- delete owner modal component -->
							<DeleteOwner
								:isVisible="isDeleteModalVisible"
								:owner="selectedOwner"
								@close="isDeleteModalVisible = false"
							/>
							<!-- create land holding drawer component -->
							<CreateLandHolding
								:isVisible="isLandHoldingDrawerVisible"
								:mode="isUpdateMode ? 'update' : 'create'"
								:owner="selectedOwner"
								:owners="owners"
								@close="isLandHoldingDrawerVisible = false"
							/>
						</div>
						<!-------------------------------------- END Table of Owners -------------------------------------->
					</div>
				</div>
			</main>
		</div>
	</div>
	<!-- </html> -->
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "../../assets/icons";
import { useOwnerStore } from "../../stores/useOwnerStore";
import CreateUpdateOwner from "../drawers/CreateUpdateOwner.vue";
import DeleteOwner from "../modals/DeleteOwner.vue";
import CreateLandHolding from "../drawers/CreateUpdateLandHolding.vue";

// Initialize store
const ownerStore = useOwnerStore();
// Computed properties
// The function inside computed() returns the 'owners' array from the ownerStore 'owner'
// The result of computed() is assigned to another variable, 'owners', a reactive reference to the owners array
// const owners = computed(() => ownerStore.owners); // Bind the store's owners to a local variable
const owners = computed(() => ownerStore.owners);

// Reactive state for the owner data
const ownerData = reactive({
	name: "",
	entity_type: "Company",
	owner_type: "Competitor",
	address: "",
	total_land_holdings: 0,
});

const errorMessage = ref(""); // Error message to show any issues during creation
const isOwnerDrawerVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isLandHoldingDrawerVisible = ref(false);
const isUpdateMode = ref(false);
const selectedOwner = ref(null); // For tracking the owner to delete

// Fetch all owners on component mount
onMounted(async () => {
	await ownerStore.getOwners();
});

// // Function to close the drawer
function closeDrawer() {
	isOwnerDrawerVisible.value = false;
}

// Function to open the Create Owner drawer
function openCreateDrawer() {
	ownerData.name = "";
	ownerData.entity_type = "Company";
	ownerData.owner_type = "Competitor";
	ownerData.address = "";
	ownerData.total_land_holdings = 0;

	isUpdateMode.value = false;
	selectedOwner.value = null;
	isOwnerDrawerVisible.value = true;
}

// Function to open the Update Owner drawer
function openUpdateDrawer(owner) {
	console.log("Inside openUpdateDrawer");
	isUpdateMode.value = true;
	isOwnerDrawerVisible.value = true;

	selectedOwner.value = owner;
	console.log("Selected Owner: ", selectedOwner.value);
}

// Select an owner for deletion and open the delete modal
function openDeleteModal(owner) {
	isDeleteModalVisible.value = true;
	// Assign the selected owner to the reactive reference
	selectedOwner.value = owner;
}

// Function to open the Land Holding drawer
function openCreateUpdateLandHoldingDrawer(owner) {
	isUpdateMode.value = false;
	selectedOwner.value = owner; // Assign the selected owner to the reactive reference
	isLandHoldingDrawerVisible.value = true;
}
</script>
