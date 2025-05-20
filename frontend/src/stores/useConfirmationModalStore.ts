// stores/modalStore.js
import { defineStore } from 'pinia'

export const useConfirmationModalStore = defineStore('confirmationModal', {
  state: () => ({
    isModalVisible: false,
    modalResult: null, 
    modalText: null
  }),
  actions: {
    showModal(text) {
      this.isModalVisible = true
      this.modalText = text
    },
    hideModal() {
      this.isModalVisible = false
      this.modalResult = null
      this.modalText = null
    },
    setModalResult(result) {
      this.modalResult = result
      this.isModalVisible = false
    },
  },
})
