<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ modalText }}</h3>
      <div class="modal-buttons">
        <button @click="onYes" class="btn btn-primary">Yes</button>
        <button @click="onNo" class="btn btn-secondary">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useConfirmationModalStore } from '@/stores/useConfirmationModalStore'
const confirmationModal = useConfirmationModalStore();
const { isModalVisible, setModalResult, modalText } = confirmationModal

const onYes = () => {
  setModalResult(true)
}

const onNo = () => {
  setModalResult(false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Darker background */
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

.modal-content h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.modal-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 10px;
}

.modal-buttons button:hover {
  transform: translateY(-2px); /* Slightly lift the button on hover */
}

.btn-primary {
  background-color: #4CAF50; /* Green for Yes */
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f44336; /* Red for No */
  color: white;
}

.btn-secondary:hover {
  background-color: #e53935;
}
</style>
