<template>
  <div :class="['sidebar', { 'sidebar-show': menu.showSidebar }]" @click.self="menu.hideSidebar">
    <div class="sidebar-content">
      <h4>Welcome</h4>
      <ul class="nav flex-column">
        <!-- Login Item -->
        <li class="nav-item">
          <a class="nav-link" href="#" @click="menu.toggleLoginForm()">Login</a>
        </li>

        <!-- Login Form -->
        <div v-if="menu.showLoginForm" class="p-3 bg-light rounded mt-2 login-form animate__animated animate__slideInDown">
          <div class="form-group mb-2">
            <label for="personalnummer">Personalnummer</label>
            <input type="text" class="form-control" id="personalnummer" v-model="personalnummer">
          </div>
          <div class="form-group mb-2">
            <label for="lagernummer">Lagernummer</label>
            <input type="text" class="form-control" id="lagernummer" v-model="lagernummer">
          </div>
          <div class="form-group mb-3">
            <label for="lagerort">Lagerort</label>
            <input type="text" class="form-control" id="lagerort" v-model="lagerort">
          </div>

          <!-- Schematic QR Code Icon -->
          <div class="qr-code text-center" @click="onQRCodeClick" style="cursor: pointer;">
            <!-- QR Code or icon content here -->
          </div>
        </div>

        <!-- Settings Item -->
        <li class="nav-item">
          <a class="nav-link" href="#">Settings</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarComponent",
  data() {
    return {
      personalnummer: "",
      lagernummer: "",
      lagerort: "",
      menu: {
        showSidebar: false,
        showLoginForm: false,
      },
    };
  },
  methods: {
    // Toggles the login form visibility
    toggleLoginForm() {
      this.menu.showLoginForm = !this.menu.showLoginForm;
    },
    // Hides the sidebar
    hideSidebar() {
      this.menu.showSidebar = false;
    },
    // Example QR code click handler
    onQRCodeClick() {
      alert("QR Code clicked!");
    },
  },
};
</script>

<style scoped>

</style>
