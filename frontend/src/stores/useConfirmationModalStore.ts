// stores/modalStore.js
import { defineStore } from 'pinia'

export const useConfirmationModalStore = defineStore('confirmationModal', {
  state: () => ({
    isModalVisible: false,
    modalResult: null, 
    modalText: null,
    modalPromiseResolver: null, 
  }),
  actions: {
    showModal(text) {
      return new Promise((resolve) => {
        this.isModalVisible = true
        this.modalText = text
        this.modalPromiseResolver = resolve
      })
    },
    hideModal() {
      this.isModalVisible = false
      this.modalResult = null
      this.modalText = null
      this.modalPromiseResolver = null
    },
    setModalResult(result) {
      this.modalResult = result
      if (this.modalPromiseResolver) {
        this.modalPromiseResolver(result) 
      }
      this.isModalVisible = false
      this.modalText = null
    },
  },
})
