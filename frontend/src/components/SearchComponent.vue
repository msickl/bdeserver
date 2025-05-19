<template>
  <div class="search">
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h5 class="modal-title" id="myModalLabel">{{ searchDialogTitle || 'Suche' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-header">
            <input type="text" class="form-control mb-2" v-model="searchDialogQuery" placeholder="Search..." />
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li
                v-for="(entry, index) in searchDialogFilteredData"
                :key="entry.VORGNR"
                class="list-group-item"
                :class="{ 'bg-success text-white': searchDialogSelectedEntry === entry }"
                @click="selectedSearchEntry(entry)"
              >
                <div style="font-size: 12pt; text-align: left;">
                  <span style="font-weight: bold;">{{ entry.VORGNR }} - </span>
                  <span>{{ entry.KURZBEZ }}</span><br />
                  <span>{{ entry.NAME1 }}</span>
                  <div
                    v-if="searchDialogSelectedEntry === entry"
                    style="font-size: 12pt; padding-top: 5px; margin-top: 5px; border-top: 1px solid #ccc;"
                  >
                    <div>Bezeichnung: {{ entry.BEZ }}</div>
                    <div>Kundennummer: AD{{ entry.KUNR }}</div>
                    <div>Erstellt am: {{ entry.ERSTELLT }}</div>
                    <div>Liefertermin: {{ entry.LTPROD }}</div>
                    <div>Lieferland: {{ entry.UIDLAND }}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="confirmedSearchSelection">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  searchData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['submit', 'close']);

const searchDialogQuery = ref('');
const searchDialogSelectedEntry = ref(null);
const searchDialogTitle = ref('Auftragssuche');
let modalInstance = null;

const searchDialogFilteredData = computed(() => {
  return (props.searchData || []).filter(entry =>
    (entry.KURZBEZ || '').toLowerCase().includes(searchDialogQuery.value.toLowerCase()) ||
    (entry.NAME1 || '').toLowerCase().includes(searchDialogQuery.value.toLowerCase()) ||
    (entry.VORGNR || '').toLowerCase().includes(searchDialogQuery.value.toLowerCase())
  );
});

function selectedSearchEntry(entry) {
  searchDialogSelectedEntry.value = searchDialogSelectedEntry.value === entry ? null : entry;
}

function confirmedSearchSelection() {
  emit('submit', searchDialogSelectedEntry.value);
  closeModal();
}

function closeModal() {
  emit('close');
  if (modalInstance) {
    modalInstance.hide();
  }
}

function openModal() {
  const modalEl = document.getElementById('myModal');
  if (modalEl) {
    modalInstance = new Modal(modalEl);
    modalInstance.show();
  }
}

onMounted(() => {
  openModal();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}
</script>


<style scoped>
.search .modal .list-group-item {
  cursor: pointer;
}
.modal-backdrop {
  z-index: -1;
}
</style>
