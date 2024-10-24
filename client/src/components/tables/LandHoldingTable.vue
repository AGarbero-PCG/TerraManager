<!-- client/src/components/tables/LandHoldingTable.vue -->
<template>
	<div class="h-full">
		<div class="min-h-full">
			<div class="bg-gray-800 pb-32">
				<header class="py-10">
					<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1
							v-if="owner"
							class="text-3xl font-bold tracking-tight text-white"
						>
							Land Holding Manager for {{ owner?.name }}
						</h1>
					</div>
				</header>
			</div>

			<main class="-mt-32">
				<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
					<div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
						<!-------------------------------------- Table of Land Holdings -------------------------------------->
						<div class="px-4 sm:px-6 lg:px-8">
							<div class="sm:flex sm:items-center">
								<div class="sm:flex-auto">
									<h1 class="text-base font-semibold leading-6 text-gray-900">
										{{ owner?.name }}'s Landholdings
									</h1>
									<!-- Error Message -->
									<p v-if="errorMessage" class="error-message text-red-600">
										{{ errorMessage }}
									</p>
									<p class="mt-2 text-sm text-gray-700">
										A list of all the landholdings visible to
										{{ owner?.name }} including their name, legal entity, net
										mineral acres, and more.
									</p>
								</div>
								<!-- Open create land holding drawer -->
								<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none cursor-pointer">
									<font-awesome-icon
										:icon="['fas', 'square-plus']"
										size="2x"
										@click="openCreateDrawer('create')"
									/>
									Add Land Holding
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
														Legal Entity
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Net Mineral Acres
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Mineral Owner Royalty
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Section Name
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Section
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Township
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Range
													</th>
													<th
														scope="col"
														class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Title Source
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
													v-for="landholding in landHoldingStore.landholdings"
													:key="landholding._id"
													class="even:bg-gray-50"
												>
													<td
														class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
													>
														{{ landholding.name }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.legal_entity }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.net_mineral_acres }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.mineral_owner_royalty }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.section_name }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.section }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.township }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.range }}
													</td>
													<td
														class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
													>
														{{ landholding.title_source }}
													</td>

													<!-- Open update land holding drawer -->
													<td
														class="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
													>
														<div>
															<font-awesome-icon
																:icon="['fas', 'pen-to-square']"
																size="2x"
																@click="openUpdateDrawer(landholding)"
															/>
														</div>
													</td>
													<!-- Open delete landholding modal -->
													<td
														class="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
													>
														<div>
															<font-awesome-icon
																:icon="['fas', 'trash']"
																size="2x"
																@click="openDeleteModal(landholding)"
															/>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<!-- Create/Update land holding drawer component -->
							<CreateUpdateLandHolding
								:isVisible="isLandHoldingDrawerVisible"
								:mode="isUpdateMode ? 'update' : 'create'"
								:landholding="selectedLandHolding"
								:owner="owner"
								@close="closeDrawer"
							/>
							<!-- Delete land holding modal component -->
							<DeleteLandHolding
								:isVisible="isDeleteModalVisible"
								:landholding="selectedLandHolding"
								:owner="owner"
								@close="isDeleteModalVisible = false"
							/>
						</div>
						<!-------------------------------------- END Table of Land Holdings -------------------------------------->
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
import { useRoute } from "vue-router";
import { useOwnerStore } from "../../stores/useOwnerStore";
import { useLandHoldingStore } from "../../stores/useLandHoldingStore";
import CreateUpdateLandHolding from "../drawers/CreateUpdateLandHolding.vue";
import DeleteLandHolding from "../modals/DeleteLandHolding.vue";

const route = useRoute(); // Access the current route to get the owner._id

// Initialize store
const ownerStore = useOwnerStore();
const landHoldingStore = useLandHoldingStore();

const ownerId = route.params.ownerId; // Get the owner's ID from the route

// Reactive state for the land holding data
const landHoldingData = reactive({
	name: "",
	owner: "",
	legal_entity: "",
	net_mineral_acres: 0,
	mineral_owner_royalty: 0,
	section: "",
	township: "",
	range: "",
	title_source: "",
});
const owner = ref(null); // Owner data
const errorMessage = ref(""); // Error message to show any issues during creation
const isLandHoldingDrawerVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isUpdateMode = ref(false);
const selectedLandHolding = ref(null); // For tracking the land holding to delete

// Fetch all land holdings on component mount
onMounted(async () => {
	try {
		const ownerId = route.params.ownerId; // Get the ownerId from the route params

		// Fetch the owner by ID
		owner.value = await ownerStore.getOwnerById(ownerId);

		if (!owner.value) {
			throw new Error("Owner not found");
		}
	} catch (error) {
		console.error("Error fetching owner: ", error);
	}
	try {
		await landHoldingStore.getLandHoldings(ownerId);
		console.log("Land Holdings: ", landHoldingStore.landholdings);
	} catch (error) {
		errorMessage.value = "Error fetching land holdings";
	}
});

// // Function to close the drawer
function closeDrawer() {
	isLandHoldingDrawerVisible.value = false;
}

// Function to open the Create Land Holding table
function openCreateDrawer() {
	isUpdateMode.value = false;
	selectedLandHolding.value = null;
	isLandHoldingDrawerVisible.value = true;
}

// Function to open the Update Land Holding table
function openUpdateDrawer(landholding) {
	console.log("Inside openUpdateDrawer");
	isUpdateMode.value = true;
	isLandHoldingDrawerVisible.value = true;

	selectedLandHolding.value = landholding;
	console.log("Selected Land Holding: ", selectedLandHolding.value);
}

// Select an land holding for deletion and open the delete modal
function openDeleteModal(landholding) {
	isDeleteModalVisible.value = true;
	// Assign the selected LandHolding to the reactive reference
	selectedLandHolding.value = landholding;
}
</script>
