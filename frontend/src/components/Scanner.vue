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

const emit = defineEmits(['close']);
const scannerModal = ref(null);
let modalInstance = null;

const store = useWebSocketStore(); 

const props = defineProps({
  scanTitle: {
    type: String,
    required: true
  }
});

let isScanRequested = false;

function openModal() {
  if (scannerModal.value) {
    modalInstance = new Modal(scannerModal.value);
    modalInstance.show();
  }

  return new Promise((resolve) => {
      if (!isScanRequested) {
        isScanRequested = true;
        const payload = {
          Action: "startScan",
          Data: null
        };

        store.sendMessage(payload)
          .then((response) => {
            console.log("Final response received:", response); // Log the entire response object

            // Check the received action and log the response for debugging
            if (response?.Action === 'scanReceived') {
              console.log("Scan completed successfully:", response.Data);
              modalInstance.hide();
              resolve(response.Data);
            } else if (response?.Action === 'scanTimedout') {
              console.log("Scan timed out:", response.Data);
              modalInstance.hide();
              resolve('scanTimedout');
            } else if (response?.Action === 'scanClosed') {
              console.log("Scan closed by user:", response.Data);
              modalInstance.hide();
              resolve('scanClosed');
            } else {
              console.error("Unexpected response action:", response?.Action);
              resolve(null); // Handle unexpected action by resolving null or specific fallback
            }
          })
      }
  });
}


function closeModal() {
  emit('close');

  const payload = {
    Action: "closeScan",
    Data: null
  };

  store.sendMessage(payload)
    .catch((error) => {
      console.error("Error closing scan:", error);
    });

  isScanRequested = false;
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
