<template>
	<div class="landholding-manager">
		<h1>Land Holding Manager</h1>

		<!-- List of Land Holdings -->
		<div class="container">
		<div class="card card-body mt-4">
			<h5 class="card-title">{{ ownerName }}'s Land Holdings</h5>

			<!-- Create Land Holding Modal Trigger -->
			<div class="d-flex justify-content-end mb-3">
			<font-awesome-icon
				:icon="['fas', 'plus-circle']"
				data-bs-toggle="modal"
				data-bs-target="#LandHoldingModal"
				class="text-success cursor-pointer"
				size="2x"
				@click="openModal('create')"
			/>
			</div>

			<!-- Table of Land Holdings -->
			<table class="table table-striped">
			<thead>
				<tr>
				<th scope="col">Legal Entity</th>
				<th scope="col">Net Mineral Acres</th>
				<th scope="col">Mineral Owner Royalty</th>
				<th scope="col">Section</th>
				<th scope="col">Township</th>
				<th scope="col">Range</th>
				<th scope="col">Title Source</th>
				<th scope="col" id="update"></th>
				<th scope="col" id="delete"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="landHolding in landHoldings" :key="landHolding.id">
				<td>{{ landHolding.legal_entity }}</td>
				<td>{{ landHolding.net_mineral_acres }}</td>
				<td>{{ landHolding.mineral_owner_royalty }}</td>
				<td>{{ landHolding.section }}</td>
				<td>{{ landHolding.township }}</td>
				<td>{{ landHolding.range }}</td>
				<td>{{ landHolding.title_source }}</td>
				<td>
					<!-- Update Land Holding Modal Trigger -->
					<div>
					<font-awesome-icon
						:icon="['fas', 'pen-to-square']"
						data-bs-toggle="modal"
						data-bs-target="#LandHoldingModal"
						class="cursor-pointer"
						size="2x"
						@click="openModal('update', landHolding)"
					/>
					</div>
				</td>
				<td>
					<!-- Delete Land Holding Modal Trigger -->
					<div>
					<font-awesome-icon
						:icon="['fas', 'trash']"
						data-bs-toggle="modal"
						data-bs-target="#deleteLandHoldingModal"
						class="cursor-pointer"
						size="2x"
						@click="selectLandHoldingForDeletion(landHolding)"
					/>
					</div>
				</td>
				</tr>
			</tbody>
			</table>

			<!-- Create/Update Land Holding Modal -->
			<div
			class="modal fade"
			id="LandHoldingModal"
			tabindex="-1"
			aria-labelledby="LandHoldingModalLabel"
			aria-hidden="true"
			>
			<div class="modal-dialog">
				<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="LandHoldingModalLabel">
					{{ isUpdateMode ? 'Update Land Holding' : 'Create Land Holding' }}
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form @submit.prevent="submit">
					<!-- Land Holding Fields -->
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.legal_entity"
						type="text"
						class="form-control"
						id="legal_entity"
						required
						/>
						<label for="legal_entity">Legal Entity</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.net_mineral_acres"
						type="number"
						class="form-control"
						id="net_mineral_acres"
						required
						/>
						<label for="net_mineral_acres">Net Mineral Acres</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.mineral_owner_royalty"
						type="number"
						step="0.01"
						class="form-control"
						id="mineral_owner_royalty"
						required
						/>
						<label for="mineral_owner_royalty">Mineral Owner Royalty</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.section"
						type="text"
						class="form-control"
						id="section"
						required
						/>
						<label for="section">Section</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.township"
						type="text"
						class="form-control"
						id="township"
						required
						/>
						<label for="township">Township</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.range"
						type="text"
						class="form-control"
						id="range"
						required
						/>
						<label for="range">Range</label>
					</div>
					<div class="form-floating mb-3">
						<input
						v-model="landHoldingData.title_source"
						type="text"
						class="form-control"
						id="title_source"
						required
						/>
						<label for="title_source">Title Source</label>
					</div>

					<button type="submit" class="btn btn-success" data-bs-dismiss="modal">
						{{ isUpdateMode ? 'Update Land Holding' : 'Create Land Holding' }}
					</button>
					</form>
				</div>
				</div>
			</div>
			</div>

			<!-- Delete Land Holding Modal -->
			<div
			class="modal fade"
			id="deleteLandHoldingModal"
			tabindex="-1"
			aria-labelledby="deleteLandHoldingModalLabel"
			aria-hidden="true"
			>
			<div class="modal-dialog">
				<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="deleteLandHoldingModalLabel">Delete Land Holding</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>
					Are you sure you want to delete the land holding?
					<strong>{{ selectedLandHolding?.name }}</strong>?
					</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteLandHolding">
					Yes, Delete
					</button>
				</div>
				</div>
			</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useLandHoldingStore, type LandHoldingData } from '../../stores/landHolding';
import { FontAwesomeIcon } from '../../assets/icons';

const landHoldingStore = useLandHoldingStore();
const ownerName = ref(''); // Assume this is fetched or passed as a prop

const landHoldingData = reactive<LandHoldingData>({
	id: null,
	name: '',
	owner: '',
	legal_entity: '',
	net_mineral_acres: 0,
	mineral_owner_royalty: 0,
	section: '',
	township: '',
	range: '',
	title_source: ''
});

const isUpdateMode = ref(false);
const selectedLandHolding = ref<LandHoldingData | null>(null); // For tracking the land holding to delete
const errorMessage = ref<string>('');

// Fetch land holdings on component mount
onMounted(async () => {
await landHoldingStore.getLandHoldings();
});

const landHoldings = computed(() => landHoldingStore.landHoldings);

// Function to open the modal in either 'create' or 'update' mode
function openModal(mode: 'create' | 'update', landHolding: LandHoldingData | null = null) {
isUpdateMode.value = mode === 'update';
if (isUpdateMode.value && landHolding) {
	// Populate form with land holding data for update
	Object.assign(landHoldingData, landHolding);
} else {
	// Reset form for create mode
	Object.assign(landHoldingData, {
	id: null,
	legal_entity: '',
	net_mineral_acres: 0,
	mineral_owner_royalty: 0,
	section: '',
	township: '',
	range: '',
	title_source: ''
	});
}
}

// Function to handle form submission
async function submit() {
if (isUpdateMode.value && landHoldingData.id !== null) {
	// Update Land Holding
	await landHoldingStore.updateLandHolding(landHoldingData)
	.then(() => {
		console.log('Land Holding Updated');
		landHoldingStore.getLandHoldings();
	})
	.catch(err => {
		console.log('Error during update:', err);
		errorMessage.value = err.message;
	});
} else {
	// Create Land Holding
	await landHoldingStore.createLandHolding(landHoldingData)
	.then(() => {
		console.log('Land Holding Created');
		landHoldingStore.getLandHoldings();
	})
	.catch(err => {
		errorMessage.value = err.message;
	});
}
}

// Select a land holding for deletion and open the delete modal
function selectLandHoldingForDeletion(landHolding: LandHoldingData) {
selectedLandHolding.value = landHolding;
}

// Delete the selected land holding
async function deleteLandHolding() {
if (selectedLandHolding.value && selectedLandHolding.value.id !== null) {
	await landHoldingStore.deleteLandHolding(selectedLandHolding.value.id)
	.then(() => {
		console.log('Land Holding Deleted');
		landHoldingStore.getLandHoldings(); // Refresh the land holding list
	})
	.catch(err => {
		console.log('Error during deletion:', err);
		errorMessage.value = err.message;
	});
}
}
</script>

<style scoped>

#register .card{
	max-width:40vw;
	margin: auto;
}

</style>
