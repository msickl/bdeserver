<template>
  <div :class="['sidebar', { 'sidebar-show': menu.isSidebarEnabled }]">
    <div class="sidebar-content">
      <h4 class="text-left text-dark mb-4 welcome">Welcome</h4>
      <ul class="nav flex-column">
        <!-- Login Form -->
        <div class="p-3 bg-light rounded mt-2 login-form animate__animated animate__slideInDown">
          <div class="form-group mb-2">
            <label for="personalnummer" class="text-dark">Personalnummer</label>
            <input type="number" class="form-control" id="personalnummer" v-model="credentialStore.user.employeeId">
            <div v-if="credentialStore.user" class="value">
              <label class="label-small-gray">Name</label>
              <div>{{ credentialStore.user.lastName }} {{ credentialStore.user.firstName }}</div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="lagernummer" class="text-dark">Lagernummer</label>
            <input type="number" class="form-control" id="lagernummer" v-model="credentialStore.stock.id">
          </div>
          <div v-if="credentialStore.user" class="value">
              <label class="label-small-gray">Name</label>
              <div>{{ credentialStore.stock.name }}</div>
            </div>
          <div class="form-group mb-3">
            <label for="lagerort" class="text-dark">Lagerort</label>
            <input type="number" class="form-control" id="lagerort" v-model="credentialStore.stock.locationid">
          </div>
          <div v-if="credentialStore.user" class="value">
              <label class="label-small-gray">Name</label>
              <div>{{ credentialStore.stock.locationname }}</div>
            </div>
          <div v-if="!credentialStore.isLoggedIn" class="qr-code text-center" style="cursor: pointer;" @click="handleQRLogin">
            <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5H9.5V9.5H5V5ZM6.5 6.5V8H8V6.5H6.5Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4999 5H18.9999V9.5H14.4999V5ZM15.9999 6.5V8H17.4999V6.5H15.9999Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 14.5H9.5V19H5V14.5ZM6.5 16V17.5H8V16H6.5Z" fill="#000000"/>
            <rect x="5" y="11.25" width="1.5" height="1.5" fill="#000000"/>
            <rect x="8" y="11.25" width="1.5" height="1.5" fill="#000000"/>
            <rect x="11.1666" y="11.25" width="1.5" height="1.5" fill="#000000"/>
            <rect x="11.1666" y="14.375" width="1.5" height="1.5" fill="#000000"/>
            <rect x="11.1666" y="17.5" width="1.5" height="1.5" fill="#000000"/>
            <rect x="11.1666" y="8.125" width="1.5" height="1.5" fill="#000000"/>
            <rect x="11.1666" y="5" width="1.5" height="1.5" fill="#000000"/>
            <rect x="14.3333" y="11.25" width="1.5" height="1.5" fill="#000000"/>
            <rect x="17.4999" y="11.25" width="1.5" height="1.5" fill="#000000"/>
            <rect x="14.3333" y="14.375" width="1.5" height="1.5" fill="#000000"/>
            <rect x="17.4999" y="14.375" width="1.5" height="1.5" fill="#000000"/>
            <rect x="14.3333" y="17.5" width="1.5" height="1.5" fill="#000000"/>
            <rect x="17.4999" y="17.5" width="1.5" height="1.5" fill="#000000"/>
            </svg>
          </div>
          <button v-if="!credentialStore.isLoggedIn" @click="handleLogin" class="btn btn-primary mt-3 w-100">Login</button>
          <button v-if="credentialStore.isLoggedIn" class="btn btn-secondary mt-3 w-100" @click="handleLogout">Logout</button>

        </div>
      </ul>

      <!-- About Section -->
      <div class="sidebar-about">
        <h5 class="text-left text-dark">About</h5>
        <p class="text-left text-muted">© <span>{{ currentYear }}</span> J. Zimmer Maschinenbau GmbH. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useScanStore } from '@/stores/useScanStore';
import { useCredentialStore } from '../stores/useCredentialStore';
import { useMenuStore } from '../stores/useMenuStore';

const credentialStore = useCredentialStore();
const menu = useMenuStore();
const currentYear = ref(new Date().getFullYear());

async function handleQRLogin()
{
  const scanStore = useScanStore();
  const res = await scanStore.scan('Login Daten');

  const data = JSON.parse(res);

  if(data)
  {
    credentialStore.user.employeeId = data.user.employeeid;
    credentialStore.stock.id = data.stock.id;
    credentialStore.stock.locationid = data.stock.locationid;

    handleLogin();
  } else {
    alert('ungültige anmeldeinformationen');
  }
}

async function handleLogin()
{
  const res = await credentialStore.login();
  if(res)
  {
    menu.hideSidebar();
  } else {
    alert('ungültige zugangsdaten');
  }
}

function handleLogout()
{
  credentialStore.logout();  
}

const handleEnter = async (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEnter);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEnter);
});


</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -100%; 
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0, #adb5bd); /* Lighter gradient background */
  color: black;
  transition: left 0.3s ease-in-out; /* Transition for sliding */
  z-index: 100;
  border-radius: 15px 0 0 15px; /* Rounded corners for the sidebar */
}

.sidebar-show {
  left: 0; /* Slide in from the left */
}

.sidebar-content {
  padding: 1rem;
}

.sidebar .nav-link {
  color: black;
  padding: 0.5rem 0;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.sidebar .nav-link:hover {
  background-color: #e0e0e0; /* Lighter hover effect */
  border-radius: 4px;
  transform: translateX(5px); /* Slightly shift the link to the right on hover */
}

.sidebar .nav-link:focus {
  outline: none;
}
.sidebar-about {
  margin-top: auto;
  position: absolute;
  bottom: 50px;
  height: 70px;
  padding:5px;
  font-size: 8pt;
}
 .welcome {
    margin-top: 60px;
  }
</style>
