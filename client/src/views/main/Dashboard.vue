<template>
	<div class="dashboard">
		<div
			class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow"
		>
			<div class="px-4 py-5 sm:p-6">
				<!-- Content goes here -->
				<OwnerTable />
			</div>
		</div>
	</div>
</template>

<script setup>
import OwnerTable from "@/components/tables/OwnerTable.vue";
import LandHoldingTable from "../../components/tables/LandHoldingTable.vue";
</script>
