import { defineStore } from 'pinia'

export const useNotificationModalStore = defineStore('notificationModal', {
  state: () => ({
    isModalVisible: false,
  }),
  actions: {
    showModal() {
      this.isModalVisible = true
    },
    hideModal() {
      this.isModalVisible = false
    },
  },
})
