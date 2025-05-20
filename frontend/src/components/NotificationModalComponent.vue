<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ modalText }}</p>
      <div class="modal-buttons">
        <button @click="onConfirm" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationModalStore } from '@/stores/useNotificationModalStore'

const notificationModalStore = useNotificationModalStore()
const { isModalVisible, modalText, hideModal } = notificationModalStore

const onConfirm = () => {
  hideModal() // Close the modal when OK is clicked
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Make sure the modal is above other content */
}

.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.modal-content p {
  font-size: 16px;
  color: #333;
}

.modal-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 15px;
}

.modal-buttons button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #4CAF50; /* Green for OK */
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>
