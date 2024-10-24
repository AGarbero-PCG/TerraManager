<template>
	<TransitionRoot as="template" :show="isVisible">
		<Dialog class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				/>
			</TransitionChild>

			<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div
					class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
				>
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
						>
							<div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
								<button
									type="button"
									class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal"
								>
									<span class="sr-only">Close</span>
									<XMarkIcon class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="sm:flex sm:items-start">
								<div
									class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
								>
									<ExclamationTriangleIcon
										class="h-6 w-6 text-red-600"
										aria-hidden="true"
									/>
								</div>
								<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<DialogTitle
										as="h3"
										class="text-base font-semibold leading-6 text-gray-900"
									>
										Delete Land Holding
									</DialogTitle>
									<div class="mt-2">
										<p class="text-sm text-gray-500">
											Are you sure you want to delete this land holding? This
											action cannot be undone.
										</p>
									</div>
								</div>
							</div>
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
									@click="handleDeleteLandHolding"
								>
									Delete
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
									@click="closeModal"
								>
									Cancel
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { reactive, ref } from "vue";
import { useLandHoldingStore } from "../../stores/useLandHoldingStore";

const errorMessage = ref("");

// Initialize store
const landHoldingStore = useLandHoldingStore();

const props = defineProps({
	isVisible: Boolean,
	owner: Object,
	landholding: Object,
});

// Reactive state for the land holding data
const landHoldingData = reactive({
	name: "",
	legal_entity: props.landholding?.legal_entity || "",
	net_mineral_acres: props.landholding?.net_mineral_acres || 0,
	mineral_owner_royalty: props.landholding?.mineral_owner_royalty || 0,
	section: props.landholding?.section || "",
	township: props.landholding?.township || "",
	range: props.landholding?.range || "",
	section_name: "",
	title_source: props.landholding?.title_source || "Class A",
});

// Emits the close and delete events
const emit = defineEmits(["close", "delete"]);

// Function to close the modal
function closeModal() {
	emit("close");
}

// Function to delete the land holding
async function handleDeleteLandHolding() {
	if (!props.landholding) {
		console.error("No land holding to delete");
		return;
	}
	try {
		// Call the deleteLandHolding method from the store
		await landHoldingStore.deleteLandHolding(props.landholding);
		console.log("Land holding deleted successfully");
		await landHoldingStore.getLandHoldings(props.landholding.owner);
		await closeModal();
	} catch (error) {
		console.error("Error deleting land holding: " + error.message);
		errorMessage.value = "Error deleting land holding";
	}
}
</script>
