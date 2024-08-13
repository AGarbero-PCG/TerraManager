<!-- client/src/views/main/OwnerManager.vue -->
<template>
	<div class="owner-manager">
		<h1>Owner Manager</h1>
		
		<!-- List of Owners -->
		<div class="container">
			<div class="card card-body mt-4">
				<h5 class="card-title">All Owners</h5>
				
				<!-- Create Owner Modal Trigger -->
				<div class="d-flex justify-content-end mb-3">
					<font-awesome-icon :icon="['fas', 'user-plus']"
						data-bs-toggle="modal" 
						data-bs-target="#OwnerModal" 
						class="text-success cursor-pointer" 
						size="2x"
						@click="openModal('create')"
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
						<tr v-for="owner in owners" :key="owner.id">
							<th scope="row">{{ owner.name }}</th>
							<td>{{ owner.entity_type }}</td>
							<td>{{ owner.owner_type }}</td>
							<td>{{ owner.address }}</td>
							<td>{{ owner.total_land_holdings }}</td>

							<!-- View Land Holdings Trigger -->
							<td>
								<div>
									<font-awesome-icon :icon="['fas', 'house']" style="color: #000000;"
										data-bs-toggle="modal"
										data-bs-target="LandHoldingManagerModal"
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
										@click="openModal('update', owner)"
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
										@click="selectOwnerForDeletion(owner)"
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<!-- Include LandHoldingModal component -->
				<LandHoldingModal
					v-if="isLandHoldingModalVisible"
					:owner="selectedOwner"
					@close="isLandHoldingModalVisible = false"
				/>

				<!-- Create/Update Owner Modal -->
				<div class="modal fade" id="OwnerModal" tabindex="-1" aria-labelledby="OwnerModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="OwnerModalLabel">{{ isUpdateMode ? 'Update Owner' : 'Create Owner' }}</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<form @submit.prevent="submit">
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
										<select v-model="ownerData.owner_type" class="form-select" id="entity_type">
											<option value="Competitor">Competitor</option>
											<option value="Seller">Seller</option>
											<option value="Investor">Investor</option>
											<option value="Professional">Professional</option>
										</select>
										<label for="owner_type">Owner Type</label>
									</div>
									<!-- Address -->
									<div class="form-floating mb-3">
										<input v-model="ownerData.address" type="text" class="form-control" id="name" required>
										<label for="address">Address</label>
									</div>
									
									<!-- Total Land Holdings will automatically calculated -->
									
									<button type="submit" class="btn btn-success" data-bs-dismiss="modal">{{ isUpdateMode ? 'Update Owner' : 'Create Owner' }}</button>
								</form>
				
							</div>
						</div>
					</div>
				</div>

				<!-- Delete Owner Modal -->
				<div class="modal fade" id="deleteOwnerModal" tabindex="-1" aria-labelledby="deleteOwnerModalLabel" aria-hidden="true">
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
						<button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteOwner">Yes, Delete</button>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">
import { useOwnerStore, type OwnerData } from '../../stores/owner';
import { reactive, ref, computed, onMounted } from 'vue';
import LandHoldingModal from './LandHoldingModal.vue';
// @ts-ignore
import { FontAwesomeIcon } from '../../assets/icons';

const ownerStore = useOwnerStore();

const ownerData = reactive<OwnerData>({
	id: null, // Initialize as null since the ID will be set when updating an existing owner
	name: "",
	entity_type: "Company",
	owner_type: "Competitor",
	address: "",
	total_land_holdings: 0,
})

const errorMessage = ref<string>("")
const isUpdateMode = ref(false);
const isLandHoldingModalVisible = ref(false);
const selectedOwner = ref<OwnerData | null>(null); // For tracking the owner to delete

// Function to open Land Holding Modal
function openLandHoldingModal(owner) {
	selectedOwner.value = owner;
	isLandHoldingModalVisible.value = true;
}

// Function to open the modal in either 'create' or 'update' mode
function openModal(mode: 'create' | 'update', owner: OwnerData | null = null) {
  isUpdateMode.value = mode === 'update';
  if (isUpdateMode.value && owner) {
    // Populate form with owner data for update
	ownerData.id = owner.id; // Store the selected owner ID
    ownerData.name = owner.name;
    ownerData.entity_type = owner.entity_type;
    ownerData.owner_type = owner.owner_type;
    ownerData.address = owner.address;
    ownerData.total_land_holdings = owner.total_land_holdings;
  } else {
    // Reset form for create mode
	ownerData.id = null; // Store the selected owner ID
    ownerData.name = "";
    ownerData.entity_type = "Company";
    ownerData.owner_type = "Competitor";
    ownerData.address = "";
    ownerData.total_land_holdings = 0;
  }
}

// Function to handle form submission
async function submit() {
	const payload = ownerData;

	console.log('API payload:', JSON.stringify(payload));
	

  	if (isUpdateMode.value && ownerData.id !== null) {
		// Update Owner
		console.log('Updating owner with data:', JSON.stringify(ownerData));
		
		await ownerStore.updateOwner(ownerData)
		.then(res => {
			console.log('Owner Updated');
			ownerStore.getOwners();
		})
		.catch(err => {
			console.log('Error during update:', err);
			errorMessage.value = err.message;
		});
	} else {
		// Create Owner
		console.log('Creating owner with data:', JSON.stringify(ownerData));
		
		await ownerStore.createOwner(ownerData)
		.then(res => {
			console.log('Owner Created');
			ownerStore.getOwners();
		})
		.catch(err => {
			errorMessage.value = err.message;
		});
	}
}

// Select an owner for deletion and open the delete modal
function selectOwnerForDeletion(owner: OwnerData) {
  selectedOwner.value = owner;
}

// Delete the selected owner
async function deleteOwner() {
  if (selectedOwner.value && selectedOwner.value.id !== null && selectedOwner.value.id !== undefined) {
    await ownerStore.deleteOwner(selectedOwner.value.id)
      .then(() => {
        console.log('Owner Deleted');
        ownerStore.getOwners(); // Refresh the owner list
      })
      .catch(err => {
        console.log('Error during deletion:', err);
        errorMessage.value = err.message;
      });
  }
}

// Fetching all Owners on component mount
onMounted(async () => {
	await ownerStore.getOwners();
});

const owners = computed(() => ownerStore.owners); // Bind the store's owners to a local variable


// Updating an Owner


</script>

<style scoped>

#register .card{
	max-width:40vw;
	margin: auto;
}

</style>
