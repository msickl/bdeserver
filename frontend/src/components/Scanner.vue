<template>
  <div class="scanner">
    <div
      ref="scannerModal"
      class="modal fade"
      id="scannerModal"
      tabindex="-1"
      aria-labelledby="scannerModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="scannerModalLabel">{{ scanTitle }}</h5>
          </div>
          <div class="modal-body text-center">
            <img src="@/assets/barcode-scan.gif" alt="Barcode scanning animation" class="img-fluid" />
          </div>
          <div class="modal-footer">
            <button @click="closeModal" type="button" class="btn btn-primary">Abbrechen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['close']);
const scannerModal = ref(null);
let modalInstance = null;

const props = defineProps({
  scanTitle: {
    type: String,
    required: true
  }
});

function openModal() {
  if (scannerModal.value) {
    modalInstance = new Modal(scannerModal.value);
    modalInstance.show();
  }
}

function closeModal() {
  emit('close');
  document.activeElement?.blur();
  if (modalInstance) {
    modalInstance.hide();
  }
}

onMounted(() => {
  openModal();
});

onBeforeUnmount(() => {
  if (modalInstance) {
    modalInstance.dispose();
  }
});
</script>

<style scoped>
.scanner .modal-body img {
  max-width: 80%;
  margin: auto;
}
</style>
