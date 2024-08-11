<template>
	<div class="owner-management">
		<h1>Management Dashboard</h1>
		
		<!-- List of Owners -->
		<div class="container">
			<div class="card card-body mt-4">
				<h5 class="card-title">All Owners</h5>
				<!-- Create Owner Modal -->
				<div class="d-flex justify-content-end mb-3">
					<font-awesome-icon :icon="['fas', 'user-plus']"
						data-bs-toggle="modal" 
						data-bs-target="#createOwnerModal" 
						class="text-success cursor-pointer" 
						size="2x"
					/>
				</div>
				
				<!-- Create Owner Modal -->
				<div class="modal fade" id="createOwnerModal" tabindex="-1" aria-labelledby="createOwnerModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="createOwnerModalLabel">Create Owner</h5>
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
									
									<button type="submit" class="btn btn-success" data-bs-dismiss="modal">Create Owner</button>
								</form>

							</div>
						</div>
					</div>
				</div>

				<table class="table table-striped">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Entity Type</th>
							<th scope="col">Owner Type</th>
							<th scope="col">Address</th>
							<th scope="col">Total Land Holdings</th>
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
							<td><font-awesome-icon :icon="['fas', 'pen-to-square']" /></td>
							<td><font-awesome-icon :icon="['fas', 'trash']" /></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">
import { useOwnerStore, type OwnerData } from '../../stores/owner';
import { reactive, ref, computed, onMounted } from 'vue';
// @ts-ignore
import { FontAwesomeIcon } from '../../assets/icons';

const ownerStore = useOwnerStore();

const ownerData = reactive<OwnerData>({
	name: "",
	entity_type: "Company",
	owner_type: "Competitor",
	address: "",
	total_land_holdings: 0,
})

const errorMessage = ref<string>("")

// Creating an Owner and refreshing the table
async function submit(){
	await ownerStore.createOwner(ownerData)
	.then (res => {
		// router.replace({name: "owner-management"})
		console.log('Owner Created');
		ownerStore.getOwners();
	})
	.catch(err => {
		errorMessage.value = err.message
	})

	// Clear the Create Owner form after submission
	ownerData.name = "";
	ownerData.entity_type = "Company"; // Reset to the default value
	ownerData.owner_type = "Competitor"; // Reset to the default value
	ownerData.address = "";
	ownerData.total_land_holdings = 0;
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
