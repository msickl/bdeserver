// stores/useScanStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScanStore = defineStore('scan', () => {
  const showScan = ref(false);
  const scanTitle = ref<string | null>(null);
  const scanResult = ref<any>(null);
  let scanResolver: ((result: any) => void) | null = null;

  const scan = (title: string): Promise<any> => {
    scanTitle.value = title;
    showScan.value = true;

    return new Promise((resolve) => {
      scanResolver = resolve;
    });
  };

  function handleScanResult(result: any) {
    scanResult.value = result;
    showScan.value = false;

    if (scanResolver) {
      scanResolver(result);
      scanResolver = null;
    }
  }

  return {
    showScan,
    scanTitle,
    scanResult,
    scan,
    handleScanResult,
  };
});
