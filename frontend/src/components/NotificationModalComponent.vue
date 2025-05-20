
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <p>Are you sure you want to continue?</p>
      <div class="modal-buttons">
        <button @click="onConfirm">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationModalStore } from '@/stores/useNotificationModalStore'

const notificationModalStore = useNotificationModalStore()

const { isVisible, hideModal } = notificationModalStore

const onConfirm = () => {
  hideModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.modal-buttons button {
  margin: 10px;
}
</style>
