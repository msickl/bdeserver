import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const showSearch = ref(false);
  const searchData = ref<any[]>([]);
  const searchResult = ref(null);
  let searchResolver: ((result: any) => void) | null = null;

  const search = (data: any[]): Promise<any> => {
  searchData.value = Array.isArray(data) ? data : [];
  showSearch.value = true;

  return new Promise((resolve) => {
    searchResolver = resolve;
  });
};

  function handleSearchResult(result: any) {
    searchResult.value = result;
    showSearch.value = false;

    if (searchResolver) {
      searchResolver(result);
      searchResolver = null;
    }
  }

  return { showSearch, searchData, searchResult, search, handleSearchResult };
});