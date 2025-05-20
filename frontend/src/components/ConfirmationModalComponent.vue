<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <p>Are you sure?</p>
      <div class="modal-buttons">
        <button @click="onYes">Yes</button>
        <button @click="onNo">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useModalStore } from '@/stores/modalStore'

export default {
  setup() {
    const modalStore = useModalStore()

    const { isModalVisible, setModalResult } = modalStore

    const onYes = () => {
      setModalResult(true)
    }

    const onNo = () => {
      setModalResult(false)
    }

    return {
      isModalVisible,
      onYes,
      onNo,
    }
  },
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