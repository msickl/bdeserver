// stores/modalStore.js
import { defineStore } from 'pinia'

export const useConfirmationModalStore = defineStore('confirmationModal', {
  state: () => ({
    isModalVisible: false,
    modalResult: null, 
  }),
  actions: {
    showModal() {
      this.isModalVisible = true
    },
    hideModal() {
      this.isModalVisible = false
      this.modalResult = null
    },
    setModalResult(result) {
      this.modalResult = result
      this.isModalVisible = false
    },
  },
})
