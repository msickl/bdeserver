<template>
  <div>
    <div id="sourceSelectPanel" v-show="videoInputDevices.length > 0">
      <select id="sourceSelect" v-model="selectedDeviceId" @change="handleChange">
        <option v-for="device in videoInputDevices" :key="device.deviceId" :value="device.deviceId">{{ device.label }}</option>
      </select>
    </div>
    <button id="startButton" @click="startScan">Start Scan</button>
    <button id="resetButton" @click="resetScan">Reset</button>
    <p id="result">{{ scanResult }}</p>
    <video id="video" autoplay width="150px" height="200px"></video>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/library';

const codeReader = new BrowserMultiFormatReader();
const videoInputDevices = ref([]);
const selectedDeviceId = ref(null);
const scanResult = ref('');

// Initialize the code reader when the component is mounted
onMounted(() => {
  initCodeReader();
});

const initCodeReader = () => {
  codeReader.listVideoInputDevices()
    .then(devices => {
      videoInputDevices.value = devices;
      if (devices.length > 0) {
        selectedDeviceId.value = devices[0].deviceId;
        document.getElementById('sourceSelectPanel').style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Error listing video input devices:', err);
    });
};

const handleChange = (event) => {
  selectedDeviceId.value = event.target.value;
};

const startScan = () => {
  codeReader.decodeFromVideoDevice(selectedDeviceId.value, 'video', (result, err) => {
    if (result) {
      scanResult.value = result.text;
    }
    if (err && !(err instanceof ZXing.NotFoundException)) {
      console.error(err);
      scanResult.value = err;
    }
  });
  console.log(`Started continuous decode from camera with id ${selectedDeviceId.value}`);
};

const resetScan = () => {
  codeReader.reset();
  scanResult.value = '';
  console.log('Reset.');
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
