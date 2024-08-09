<template>
	<div class="owner-management">
	<h1>Management Dashboard</h1>
	<table class="table table-striped">
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
			<tr>
			<th scope="row">John Doe</th>
			<td>owner.entity_type</td>
			<td>Otto</td>
			<td>@mdo</td>
			</tr>
			<tr>
			<th scope="row">2</th>
			<td>Jacob</td>
			<td>Thornton</td>
			<td>@fat</td>
			</tr>
			<tr>
			<th scope="row">3</th>
			<td colspan="2">Larry the Bird</td>
			<td>@twitter</td>
			</tr>
		</tbody>
		</table>
	</div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getOwners } from '../../composables/useApi'; // Adjust path accordingly

export default defineComponent({
	setup() {
    const owners = ref([]);

    const fetchOwners = async () => {
      try {
        owners.value = await getOwners();
      } catch (error) {
        console.error("Failed to fetch owners:", error);
      }
    };

    onMounted(() => {
      fetchOwners();
    });

    return {
      owners
    };
  }
});
</script>
  