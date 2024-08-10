<template>
	<div class="owner-management">
		<h1>Management Dashboard</h1>
		<div class="container">
			<!-- Create Owner Form -->
			<div class="card card-body mt-4">
				<h5 class="card-title">Create Owner</h5>
				<form @submit.prevent="submit">
			
				<!-- Owner Name -->
				<div class="form-floating mb-3">
					<input v-model="ownerData.name" type="text" class="form-control" id="name" required>
					<label for="name">Name</label>
				</div>
				<!-- Entity Type -->
				<div class="form-floating mb-3">
					<select v-model="ownerData.entity_type" class="form-select" id="entityTypeSelect">
						<option value="1">Company</option>
						<option value="2">Individual</option>
						<option value="3">Investor</option>
						<option value="4">Trust</option>
					</select>
					<label for="entity_type">Entity Type</label>
				</div>
				<!-- Owner Type -->
				<div class="form-floating mb-3">
					<select class="form-select" id="ownerTypeSelect">
						<option value="1">Competitor</option>
						<option value="2">Seller</option>
						<option value="3">Investor</option>
						<option value="4">Professional</option>
					</select>
					<label for="entity_type">Owner Type</label>
				</div>
				<!-- Address -->
				<div class="form-floating mb-3">
					<input type="text" class="form-control" id="name" v-model="ownerData.address" required>
					<label for="name">Name</label>
				</div>
				
				<!-- Total Land Holdings will automatically calculated -->
				
				<button type="submit" class="btn btn-primary">Create Owner</button>
				</form>
			</div>
		</div>

		<!-- List of Owners -->
		<!-- <table class="table table-striped">
			<thead>
				<tr>
				<th scope="col">Name</th>
				<th scope="col">Entity Type</th>
				<th scope="col">Owner Type</th>
				<th scope="col">Address</th>
				<th scope="col">Total Land Holdings</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="owner in owners" :key="owner._id">
					<th scope="row">{{ owner.name }}</th>
					<td>{{ owner.entity_type }}</td>
					<td>{{ owner.owner_type }}</td>
					<td>{{ owner.address }}</td>
					<td>{{ owner.total_land_holdings }}</td>
				</tr>
			</tbody>
		</table> -->
	</div>
</template>


<script setup lang="ts">
import { useOwnerStore, type OwnerData } from '../../stores/owner';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { computed, onMounted } from 'vue';

const ownerStore = useOwnerStore();
const router = useRouter();

const ownerData = reactive<OwnerData>({
	name: "",
	entity_type: "Company",
	owner_type: "Competitor",
	address: "",
	total_land_holdings: 0,
})

const errorMessage = ref<string>("")

async function submit(){
	await ownerStore.createOwner(ownerData)
	.then(res => {
		router.replace({name: "owner-management"})
	})
	.catch(err => {
		errorMessage.value = err.message
	})
}
// async function getOwners(){
// 	await ownerStore.getOwners();
// }
// const owner = computed(()=> {
// 	return ownerStore.ownerDetail;
// })

// onMounted(async ()=>{
// 	await getOwners();
// })



</script>

<style scoped>

#register .card{
	max-width:40vw;
	margin: auto;
}

</style>
