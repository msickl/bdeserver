<template>
  <div v-if="loader.showLoader.value" class="loader-dialog">
    <img src="@/assets/loader.gif" alt="Loading..." class="loader-image" />
  </div>
</template>

<script setup>
import { Loader } from '@/composables/LoaderComposable'
import { onMounted } from 'vue'

const loader = Loader()

onMounted(() => {
  loader.hide()
})
</script>


<style scoped>
.loader-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-image {
  width: 100px;
}
</style>
