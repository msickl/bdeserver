import { defineStore } from 'pinia';
import { getCurrentInstance } from 'vue';

export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        isSidebarEnabled: false,
        isCurrent: 1
    }),
    getters: {
        current: (state): number => state.isCurrent
    },
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
        },
        navigate(targetMenuId: any) {
            this.isCurrent = targetMenuId;
        }
    }
});