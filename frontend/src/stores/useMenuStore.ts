import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        isSidebarEnabled: false
    }),

    actions: {
        showSidebar()
        {
            this.isSidebarEnabled = true;
        },
        hideSidebar()
        {
            this.isSidebarEnabled = false;
        },
        toggleSidebar()
        {
            this.isSidebarEnabled = !this.isSidebarEnabled; 
        }
    }
});