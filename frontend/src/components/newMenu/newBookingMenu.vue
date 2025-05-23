<template>
    <div>
        <Stepper ref="stepperRef" :steps="steps" @update:step="handleStepChange" />
        <div>
            <component :is="currentMenu" />
        </div>
        <div class="controls">
            <button @click="stepperRef?.prevStep()" :disabled="stepIndex === 0">Zurück</button>
            <button @click="stepperRef?.nextStep()" :disabled="stepIndex === steps.length - 1">Weiter</button>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import Stepper from '@/components/Stepper.vue'
import newStockBooking from './newStockBooking.vue'
import newArticleBooking from './newArticleBooking.vue'
import newOrderBooking from './newOrderBooking.vue'
import newBookingSummary from './newBookingSummary.vue'

const steps = ['Lager', 'Auftrag', 'Artikel', 'Buchen']
const stepIndex = ref(0)
const stepperRef = ref(null)

function handleStepChange(index) {
  stepIndex.value = index
}

const currentMenu = computed(() => {
  return [
    newStockBooking,
    newOrderBooking,
    newArticleBooking,
    newBookingSummary
  ][stepIndex.value]
})
// tests
</script>
<style scoped>
button {
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  background-color: #2c7c74;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>