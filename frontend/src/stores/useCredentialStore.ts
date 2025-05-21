// stores/useCredentialStore.ts
import User from '../js/user';
import Stock from '../js/stock';

import { defineStore } from 'pinia';

export const useCredentialStore = defineStore('credential', {
  state: () => ({
    user: new User(),
    stock: new Stock(),
    isLoggedIn: false,
  }),
  
  actions: {
    async login() {
        let res = await this.user.fetch(this.user.employeeId);
        if(!res)
        {
          return false;
        }

        res = await this.stock.fetch(this.stock.id, this.stock.locationid);
        if(!res)
        {
          return false;
        }
        
        this.isLoggedIn = true;
        return true;
    },
    
    logout() {
        this.user = new User();
        this.stock = new Stock();
        this.isLoggedIn = false;
    },
  },
  
  getters: {
    isUserLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getStock: (state) => state.stock
  }
});
