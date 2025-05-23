<template>
  <div class="scanner">
    <div ref="scanModal" class="modal fade" tabindex="-1">
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
import { useWebSocketStore } from '@/stores/useWebSocketStore';

const emit = defineEmits(['submit', 'close']);
const props = defineProps({
  scanTitle: String
});

const scanModal = ref(null);
const store = useWebSocketStore();
let modal = null;
let isScanRequested = false;

function openModal() {
  if (scanModal.value) {
    modal = new Modal(scanModal.value, {
      backdrop: false,
      zIndex: 1050
    });
    modal.show();
    //const backdrop = document.querySelector('.modal-backdrop');
    //backdrop.remove();
  }

  if (!isScanRequested) {
    isScanRequested = true;
    store.sendMessage({ Action: 'startScan', Data: null })
      .then(response => {
        if (response?.Action === 'scanReceived') {
          if (modal) {
            modal.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if(backdrop)
            {
              backdrop.remove();
            }
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
  if (modal) {
    modal.hide();
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
.modal {
  background-color: rgba(0, 0, 0, 0.7) !important;
}


</style>
