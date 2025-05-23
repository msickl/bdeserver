<template>
  <div class="stepper">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step"
      :class="{
        completed: index < currentStep,
        active: index === currentStep
      }"
    >
      <div class="circle"></div>
      <div class="label">{{ step }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:step', 'nextstep', 'previousstep'])

const currentStep = ref(0)

watch(currentStep, (val) => emit('update:step', val))

function nextStep() {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
    emit('nextstep')
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('previousstep')
  }
}

defineExpose({ nextStep, prevStep, currentStep })
</script>

<style scoped>
/* same style as your original code */
.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  text-align: center;
}

.step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 15px;
  right: -50%;
  width: 100%;
  height: 4px;
  background-color: #ccc;
  z-index: 0;
}

.step.completed .circle,
.step.completed::after {
  background-color: #2c7c74;
}

.circle {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border-radius: 50%;
  z-index: 1;
  transition: background-color 0.3s ease;
}

.step.active .circle {
  background-color: #2c7c74;
}

.label {
  margin-top: 8px;
  color: #000;
}

.step.active .label {
  font-weight: bold;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}
</style>
