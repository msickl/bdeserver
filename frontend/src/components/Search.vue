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
                :class="{'bg-success text-white': searchDialogSelectedEntry === entry}"
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
                    <div>Kundennummer: {{ entry.KUNDR }}</div>
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

<script>
import { Modal } from 'bootstrap';

export default {
  name: "SearchComponent",
  props: {
    searchData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchDialogQuery: '',
      searchDialogSelectedEntry: null,
      searchDialogTitle: 'Auftragssuche',
      modalInstance: null
    };
  },
  computed: {
    searchDialogFilteredData() {
      if (!this.searchData) return [];
      return this.searchData.filter(entry =>
        (entry.KURZBEZ || '').toLowerCase().includes(this.searchDialogQuery.toLowerCase()) ||
        (entry.NAME1 || '').toLowerCase().includes(this.searchDialogQuery.toLowerCase()) ||
        (entry.VORGNR || '').toLowerCase().includes(this.searchDialogQuery.toLowerCase())
      );
    }
  },
  methods: {
    selectedSearchEntry(entry) {
      this.searchDialogSelectedEntry = this.searchDialogSelectedEntry === entry ? null : entry;
    },
    confirmedSearchSelection() {
      this.$emit('submit', this.searchDialogSelectedEntry); 
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    openModal() {
      const modalEl = document.getElementById('myModal');
      if (modalEl) {
        this.modalInstance = new Modal(modalEl);
        this.modalInstance.show();
      }
    }
  },
  mounted() {
    this.openModal();
  }
};
</script>

<style scoped>
.search .modal .list-group-item {
  cursor: pointer;
}
.modal-backdrop {
  z-index: -1;
}
</style>
