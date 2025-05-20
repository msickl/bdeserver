import { defineStore } from 'pinia'

export const useNotificationModalStore = defineStore('notificationModal', {
  state: () => ({
    isModalVisible: false,
    modalText: null,
  }),
  actions: {
    showModal(text) {
      this.isModalVisible = true
      this.modalText = text
    },
    hideModal() {
      this.isModalVisible = false
      this.modalText = null
    },
  },
})
