<template>
  <div class="container">
   <div class="header">
    <div class="circle" @click="menu.navigate(1)">
        <div class="arrow-left"></div>
    </div>
    <img src="https://m.media-amazon.com/images/I/71NRGZ5L1DL._AC_SL1500_.jpg" class="product-image"/>
    <div class="article-number">A1234567</div>
</div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-button', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Content -->
    <div v-if="activeTab === 'Allgemein'" class="content">
      <h2 class="section-title">Übersicht</h2>
     <div v-for="item in overview" :key="item.label" class="info-item">
        <div class="info-left">
            <i :class="item.icon" class="icon"></i>
            <span class="label">{{ item.label }}</span>
        </div>
        <span class="value">{{ item.value }}</span>
        </div>

      <h2 class="section-title">Langtext</h2>
      <p class="longtext">
        Zylinderkopfschraube m. Innensechskant CB8-40<br />
        M8x40_brüniert<br />
      </p>

      <h2 class="section-title">EAN-Details</h2>
      <div v-for="(value, label) in eanDetails" :key="label" class="info-item">
        <span class="label">{{ label }}</span>
        <span class="value">{{ value }}</span>
      </div>
    </div>

    <div v-if="activeTab === 'Bestand'" class="content">
        <h2 class="section-title">Bestand</h2>
    </div>

    <div v-if="activeTab === 'Lager'" class="content">
        <h2 class="section-title">Lager</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMenuStore } from '../../stores/useMenuStore';

const tabs = ['Allgemein', 'Bestand', 'Lager']
const activeTab = ref('Allgemein')
const menu = useMenuStore();

const overview = [
  {
    label: 'Text',
    value: 'Zylinderkopfschraube m. Innensechskant CB8-40',
    icon: 'fa-solid fa-tag',
  },
  {
    label: 'Warengruppe',
    value: '201 - Verbindungselemente St.bl.',
    icon: 'fa-solid fa-cube',
  },
  {
    label: 'Lagereinheit',
    value: 'STK',
    icon: 'fa-solid fa-box',
  },
  {
    label: 'Seriennummernpflichtig',
    value: 'NEIN',
    icon: 'fa-solid fa-hashtag',
  },
  {
    label: 'Chargenpflichtig',
    value: 'NEIN',
    icon: 'fa-solid fa-layer-group',
  },
];

const eanDetails = {
  'EAN-Code': '2727841760006',
  Menge: '1.0',
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2px auto;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
  font-size:10pt;
  color: #333;
}

.tabs {
  display: flex;
  background: #e0e0e0;
  border-radius: 10px;
  padding: 4px;
  justify-content: start;
  margin-bottom: 24px;
}

.tab-button {
  background: transparent;
  border: none;
  padding: 10px 10px;
  flex: 1;
  font-size: 14px;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #dcdcdc;
}

.tab-button.active {
  background: white;
  color: black;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #222;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-left {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
}

.label {
  font-weight: 500;
}

.value {
  white-space: nowrap;
  text-align: right;
}

.longtext {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  padding: 12px;
}

.placeholder {
  text-align: center;
  color: #000;
  font-style: italic;
  margin-top: 40px;
}

.header {
  display: flex;
  align-items: center;
  gap: 25px; /* Space between elements */
  margin:15px 0 15px 0;
}

.circle {
  width: 40px;
  height: 40px;
  background-color: lightgray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
.circle:hover {
    background-color: gray;
}

.arrow-left {
  width: 10px;
  height: 10px;
  border-top: 2px solid white;
  border-left: 2px solid white;
  transform: rotate(-45deg);
}

.product-image {
  height: 40px;
  object-fit: cover;
}

.article-number {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
