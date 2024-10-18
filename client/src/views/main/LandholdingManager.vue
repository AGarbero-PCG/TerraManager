<!-- client/src/views/main/LandholdingManager.vue -->
 <template>
	<div class="landholding-manager container">
		<div class="text-left">{{ ownerName }}'s Land Holdings'</div>

		<!-- Error Message -->
		<p v-if="errorMessage" class="error-message text-danger mb-4">{{ errorMessage }}</p>

		<!-- Create Land Holding Modal Trigger -->
		<div class="d-flex justify-content-end mb-3">
			<font-awesome-icon :icon="['fas', 'circle-plus']"
				data-bs-toggle="modal" 
				data-bs-target="#LandHoldingModal" 
				class="text-success cursor-pointer" 
				size="2x"
				@click="openCreateLandholdingModal('create')"
			/>
		</div>

		<!--  Table of Land Holdings -->
		<table class="table table-striped">
			<thead>
				<tr>
					<th scope="col">Name</th>
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
				<tr v-for="landholding in landholdings" :key="landholding.id">
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

		<!-- Create/Update Landholding Modal -->
		 <div></div>
		<!-- Delete Landholding Modal -->
		 <div></div>

	</div>
 </template>