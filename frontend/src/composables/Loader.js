import { ref } from 'vue'

const showLoader = ref(false)

export function Loader() {
  function show() {
    showLoader.value = true
  }

  function hide() {
    showLoader.value = false
  }

  return {
    showLoader,
    show,
    hide
  }
}
