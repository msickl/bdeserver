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
import { useWebSocketStore } from '@/stores/websocket';

const emit = defineEmits(['submit', 'close']);
const props = defineProps({
  scanTitle: String
});

const scannerModal = ref(null);
const store = useWebSocketStore();
let modalInstance = null;
let isScanRequested = false;

function openModal() {
  if (scannerModal.value) {
    modalInstance = new Modal(scannerModal.value);
    modalInstance.show();
  }

  if (!isScanRequested) {
    isScanRequested = true;
    store.sendMessage({ Action: 'startScan', Data: null })
      .then(response => {
        if (response?.Action === 'scanReceived') {
          if (modalInstance) {
            modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            backdrop.remove();
          }
          emit('submit', response.Data);
        } else if (response?.Action === 'scanTimedout' || response?.Action === 'scanClosed') {
          closeModal();
        } else {
          console.warn('Unexpected response:', response);
        }
      })
      .catch(error => {
        console.error('Error during scan:', error);
        closeModal();
      });
  }
}

function closeModal() {
  if (modalInstance) {
    modalInstance.hide();
  }
  emit('close');
  store.sendMessage({ Action: 'closeScan', Data: null }).catch(error =>
    console.error('Error closing scan:', error)
  );
  isScanRequested = false;
}

onMounted(() => {
  openModal();
  window.addEventListener('keydown', handleKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}
</script>

<style scoped>
.scanner .modal-body img {
  max-width: 80%;
  margin: auto;
}
</style>
