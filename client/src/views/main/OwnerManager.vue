<!-- client/src/views/main/OwnerManager.vue -->
<template>
	<div class="owner-manager container">
		<h1 class="text-left">Owner Manager</h1>
		
		<!-- List of Owners -->
		<div class="container">
			<div class="card card-body mt-4">
				<h5 class="card-title">All Owners</h5>

				<!-- Error Message -->
				<p v-if="errorMessage" class="error-message text-danger mb-4">{{ errorMessage }}</p>
				
				<!-- Create Owner Modal Trigger -->
				<div class="d-flex justify-content-end mb-3">
					<font-awesome-icon :icon="['fas', 'user-plus']"
						data-bs-toggle="modal" 
						data-bs-target="#OwnerModal" 
						class="text-primary cursor-pointer" 
						size="2x"
						@click="openCreateModal('create')"
					/>
				</div>

				<!--  Table of Owners -->
				<table class="table table-striped">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Entity Type</th>
							<th scope="col">Owner Type</th>
							<th scope="col">Address</th>
							<th scope="col">Total Land Holdings</th>
							<th scope="col" id="landholdingModal"></th>
							<th scope="col" id="update"></th>
							<th scope="col" id="delete"></th>
						</tr>
					</thead>
					<tbody>
						<!-- Iterate over 'owners' to display a list of owners -->
						<tr v-for="owner in owners" :key="owner._id">
							<th scope="row">{{ owner.name }}</th>
							<td>{{ owner.entity_type }}</td>
							<td>{{ owner.owner_type }}</td>
							<td>{{ owner.address }}</td>
							<td>{{ owner.total_land_holdings }}</td>

							<!-- Include LandHoldingModal component -->
							<LandHoldingModal
								v-if="isLandHoldingModalVisible"
								:owner="selectedOwner"
								@close="isLandHoldingModalVisible = false"
							/>
							<!-- View Land Holdings Trigger -->
							<td>
								<div>
									<font-awesome-icon :icon="['fas', 'house']" style="color: #000000;"
										data-bs-toggle="modal"
										data-bs-target="#LandholdingManager"
										class="cursor-pointer"
										size="2x"
										@click="openLandHoldingModal(owner)"
									/>
								</div>
							</td>
							<!-- Update Owner Modal Trigger -->
							<td>
								<div>
									<font-awesome-icon :icon="['fas', 'pen-to-square']"
										data-bs-toggle="modal" 
										data-bs-target="#OwnerModal" 
										class="cursor-pointer" 
										size="2x"
										@click="openUpdateModal(owner)"
									/>
								</div>
							</td>
							<!-- Delete Owner Modal Trigger -->
							<td>
								<div>
									<font-awesome-icon :icon="['fas', 'trash']"
										data-bs-toggle="modal" 
										data-bs-target="#deleteOwnerModal" 
										class="cursor-pointer" 
										size="2x"
										@click="openDeleteModal(owner)"
										/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>


				<!-- Create/Update Owner Modal -->
				<div
					class="modal fade" 
					id="OwnerModal"
					tabindex="-1"
					aria-labelledby="OwnerModalLabel"
					aria-hidden="true"
				>
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="OwnerModalLabel">{{ isUpdateMode ? 'Update Owner' : 'Create Owner' }}</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<form @submit.prevent="handleSubmit">
									<!-- Owner Name -->
									<div class="form-floating mb-3">
										<input v-model="ownerData.name" type="text" class="form-control" id="name" required>
										<label for="name">Name</label>
									</div>
									<!-- Entity Type -->
									<div class="form-floating mb-3">
										<select v-model="ownerData.entity_type" class="form-select" id="entity_type">
											<option value="Company">Company</option>
											<option value="Individual">Individual</option>
											<option value="Investor">Investor</option>
											<option value="Trust">Trust</option>
										</select>
										<label for="entity_type">Entity Type</label>
									</div>
									<!-- Owner Type -->
									<div class="form-floating mb-3">
										<select v-model="ownerData.owner_type" class="form-select" id="owner_type">
											<option value="Competitor">Competitor</option>
											<option value="Seller">Seller</option>
											<option value="Investor">Investor</option>
											<option value="Professional">Professional</option>
										</select>
										<label for="owner_type">Owner Type</label>
									</div>
									<!-- Address -->
									<div class="form-floating mb-3">
										<input v-model="ownerData.address" type="text" class="form-control" id="address" required>
										<label for="address">Address</label>
									</div>
									
									<!-- Total Land Holdings will automatically calculated -->
									
									<button
										type="submit"
										class="btn btn-success"
										data-bs-dismiss="modal"
									>
										{{ isUpdateMode ? 'Update Owner' : 'Create Owner' }}
									</button>
								</form>

								<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
				
							</div>
						</div>
					</div>
				</div>

				<!-- Delete Owner Modal -->
				<div
					class="modal fade"
					id="deleteOwnerModal"
					tabindex="-1"
					aria-labelledby="deleteOwnerModalLabel"
					aria-hidden="true"
				>
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="deleteOwnerModalLabel">Delete Owner</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p>Are you sure you want to delete the owner: <strong>{{ selectedOwner?.name }}</strong> ?  This will delete all related Land Holdings as well. </p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
								<button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleDeleteOwner">Yes, Delete</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup lang="js">
import { reactive, ref, computed, onMounted } from 'vue';
import { useOwnerStore} from '../../stores/useOwnerStore';
import { FontAwesomeIcon } from '../../assets/icons';
import LandHoldingModal from './LandHoldingModal.vue';

// Initialize store
const ownerStore = useOwnerStore();
// Computed properties
// The function inside computed() returns the 'owners' array from the ownerStore 'owner'
// The result of computed() is assigned to another variable, 'owners', a reactive reference to the owners array
// const owners = computed(() => ownerStore.owners); // Bind the store's owners to a local variable
const owners = computed(() => ownerStore.owners);

// Reactive state for the owner data
const ownerData = reactive({
	name: '',
	entity_type: 'Company',
	owner_type: 'Competitor',
	address: '',
	total_land_holdings: 0,
});

const errorMessage = ref('') // Error message to show any issues during creation
const isUpdateMode = ref(false);
const selectedOwner = ref(null); // For tracking the owner to delete
const isLandHoldingModalVisible = ref(false);

// Fetch all owners on component mount
onMounted(async () => {
	await ownerStore.getOwners();
});

// Function to handle form submission
async function handleSubmit() {
	if (isUpdateMode.value) {
		await handleUpdateOwner();
	} else {
		await handleCreateOwner();
	}
}

// Function to open the Create Owner modal
function openCreateModal() {
	isUpdateMode.value = false;
}

// Function to handle Create Owner form submission
async function handleCreateOwner() {
	try {
		await ownerStore.createOwner(ownerData);
		console.log('Owner created successfully!: ', ownerData);
		
		errorMessage.value = ''; // Reset error message

		// Reset the form fields after successful creation
		ownerData.name = "";
		ownerData.entity_type = "Company";
		ownerData.owner_type = "Competitor";
		ownerData.address = "";
		ownerData.total_land_holdings = 0;
	} catch (error) {
		console.error('Error creating owner:' + error.message);
		errorMessage.value = 'Failed to create owner. Please try again.';
	}
}

// Function to open the Update Owner modal
function openUpdateModal(owner) {
	isUpdateMode.value = true;

	if (isUpdateMode.value && owner) {
		// Populate form with owner data for update
	ownerData._id = owner._id; // Store the selected owner ID
    ownerData.name = owner.name;
    ownerData.entity_type = owner.entity_type;
    ownerData.owner_type = owner.owner_type;
    ownerData.address = owner.address;
    ownerData.total_land_holdings = owner.total_land_holdings;
	}

	// Populate ownerData with the selected owner's data
	Object.assign(ownerData, owner);
}

// Function to handle Update Owner form submission
async function handleUpdateOwner() {
	if (!ownerData._id) {
		console.error('No owner ID found for update');
		errorMessage.value = 'No owner ID found for update';
		return;
	}

	try {
		// Call the updateOwner method from the store
		await ownerStore.updateOwner(ownerData);
		console.log('Owner updated successfully!');
		await ownerStore.getOwners(); // Refresh the owner list
	} catch (error) {
		console.error('Error updating owner:' + error.message);
		errorMessage.value = 'Failed to update owner. Please try again.';
	}
}

// Select an owner for deletion and open the delete modal
function openDeleteModal(owner) {
	// Assign the selected owner to the reactive reference
  	selectedOwner.value = owner;

  	// Populate ownerData with the selected owner's data
  	Object.assign(ownerData, owner);
}

// Delete the selected owner
async function handleDeleteOwner() {
	if (!ownerData._id) {
		console.error('No owner ID found for update');
		errorMessage.value = 'No owner ID found for update';
		return;
	}
		try {
			await ownerStore.deleteOwner(ownerData);
			console.log('Owner deleted successfully!');
			await ownerStore.getOwners(); // Refresh the owner list
		} catch (error) {
			console.error('Error deleting owner:' + error.message);
			errorMessage.value = 'Failed to delete owner. Please try again.';
		}
}

// Function to open Land Holding Modal
function openLandHoldingModal(owner) {
	selectedOwner.value = owner;
	isLandHoldingModalVisible.value = true;
}



</script>

<style scoped>

.owner-manager {
	margin-left: auto;
	margin-right: auto;
	padding: 20px;
}

.error {
	color: red;
	margin-top: 10px;
}

</style>


