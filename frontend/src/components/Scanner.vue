<template>
  <div class="scanner">
    <div class="modal fade" id="scannerModal" style="z-index:2000;" tabindex="-1" aria-labelledby="scannerModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="scannerModalLabel">Default Title</h5>
                </div>
                <div class="modal-body">
                    <img src="@/assets/barcode-scan.gif" alt="Barcode" class="img-fluid">
                    <!-- <input type="text" id="scannerInput" placeholder="Scan here" autofocus class="form-control mt-3" style="opacity: 0; position: absolute;"> -->
                </div>
                <div class="modal-footer">
                    <button @click="$emit('close')" class="btn btn-primary mt-3">Abbrechen</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';

const wsStore = useWebSocketStore();
const scanResult = ref(null);

const startScan = async () => {
  try {
    const response = await wsStore.sendMessage({ Action: 'scanRequest' });

    if (response.Action === 'scanReceived') {
      scanResult.value = response;
    } else if (response.Action === 'scanTimedout' || response.Action === 'scanClosed') {
      scanResult.value = { message: 'Scan was canceled or timed out.' };
    } else {
      scanResult.value = { message: 'Unexpected response.', data: response };
    }
  } catch (error) {
    console.error('Scan failed:', error);
    scanResult.value = { message: 'WebSocket error or not connected.' };
  }
};
</script>

<style scoped>
/* Add styles for your scanner here */
</style>
