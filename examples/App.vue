<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  LineChart,
  AreaChart,
  BarChart,
  ScatterChart,
  PieChart,
} from 'awesome-graphs-vue3'

const dark = ref(false)
const theme = computed(() => (dark.value ? 'dark' : 'light'))

function rnd(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

function makeRevenue() {
  return months.map((month) => ({
    month,
    product: rnd(30, 100),
    services: rnd(15, 70),
    licenses: rnd(10, 50),
  }))
}

function makeScatter() {
  return Array.from({ length: 16 }, () => ({
    x: rnd(0, 100),
    y: rnd(0, 100),
    weight: rnd(10, 100),
  }))
}

function makeTraffic() {
  return [
    { source: 'Direct', value: rnd(20, 50) },
    { source: 'Organic Search', value: rnd(30, 70) },
    { source: 'Social', value: rnd(10, 40) },
    { source: 'Referral', value: rnd(8, 25) },
    { source: 'Email', value: rnd(5, 20) },
  ]
}

const series = [
  { key: 'product', name: 'Product' },
  { key: 'services', name: 'Services' },
  { key: 'licenses', name: 'Licenses' },
]

// Daily visits over four weeks for the time-axis example.
const timeSeries = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2024, 0, 1 + i)
  return { date: d.toISOString().slice(0, 10), visits: rnd(120, 480) }
})

const revenue = ref(makeRevenue())
const scatter = ref(makeScatter())
const traffic = ref(makeTraffic())

function shuffle() {
  revenue.value = makeRevenue()
  scatter.value = makeScatter()
  traffic.value = makeTraffic()
}
</script>

<template>
  <div class="ex-root" :class="{ 'ex-dark': dark }">
    <header class="ex-header">
      <h1 class="ex-title">📊 Awesome Graphs <span>· examples</span></h1>
      <div class="ex-spacer" />
      <button class="ex-btn" type="button" @click="shuffle">🎲 Shuffle data</button>
      <button class="ex-btn" type="button" @click="dark = !dark">
        {{ dark ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </header>

    <main class="ex-grid">
      <section class="ex-card">
        <h2>Line · multi-series</h2>
        <p>Smooth (monotone) curves with an interactive crosshair tooltip.</p>
        <LineChart :data="revenue" x="month" :series="series" :theme="theme" :height="260" />
      </section>

      <section class="ex-card">
        <h2>Line · dashed & straight</h2>
        <p>Per-series dashed strokes and a linear curve.</p>
        <LineChart
          :data="revenue"
          x="month"
          :series="[
            { key: 'product', name: 'Product' },
            { key: 'services', name: 'Services', dashed: true },
          ]"
          curve="linear"
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Area · stacked</h2>
        <p>Stacked areas with gradient fills.</p>
        <AreaChart
          :data="revenue"
          x="month"
          :series="series"
          stacked
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Area · single</h2>
        <p>A single smooth area — great for trends.</p>
        <AreaChart
          :data="revenue"
          x="month"
          :series="[{ key: 'product', name: 'Product' }]"
          :theme="theme"
          :height="260"
          :legend="false"
        />
      </section>

      <section class="ex-card">
        <h2>Bar · grouped</h2>
        <p>Grouped bars with rounded corners.</p>
        <BarChart :data="revenue" x="month" :series="series" :theme="theme" :height="260" />
      </section>

      <section class="ex-card">
        <h2>Bar · stacked</h2>
        <p>The same data, stacked into totals.</p>
        <BarChart
          :data="revenue"
          x="month"
          :series="series"
          stacked
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Scatter</h2>
        <p>Each row plotted at its (x, y) on a numeric axis.</p>
        <ScatterChart
          :data="scatter"
          x="x"
          :series="['y']"
          :theme="theme"
          :height="260"
          :legend="false"
        />
      </section>

      <section class="ex-card">
        <h2>Bubble</h2>
        <p>Point area encodes a third dimension (<code>weight</code>).</p>
        <ScatterChart
          :data="scatter"
          x="x"
          :series="[{ key: 'y', name: 'Samples' }]"
          size="weight"
          :size-range="[5, 28]"
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Pie</h2>
        <p>Traffic by source, sorted by value.</p>
        <PieChart
          :data="traffic"
          value="value"
          label="source"
          sort
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Donut · labels</h2>
        <p>Donut with value labels and rounded slices.</p>
        <PieChart
          :data="traffic"
          value="value"
          label="source"
          :donut="0.6"
          :corner-radius="4"
          :pad-angle="0.02"
          label-type="value"
          :theme="theme"
          :height="260"
        />
      </section>

      <section class="ex-card">
        <h2>Line · time axis</h2>
        <p>A continuous time x-axis with auto tick thinning.</p>
        <LineChart
          :data="timeSeries"
          x="date"
          x-type="time"
          :series="[{ key: 'visits', name: 'Visits' }]"
          :theme="theme"
          :height="260"
          :legend="false"
        />
      </section>

      <section class="ex-card">
        <h2>Custom palette</h2>
        <p>Bring your own brand colors via the <code>palette</code> prop.</p>
        <AreaChart
          :data="revenue"
          x="month"
          :series="series"
          :palette="['#6366f1', '#ec4899', '#f59e0b']"
          :theme="theme"
          :height="260"
        />
      </section>
    </main>

    <footer class="ex-footer">
      Built with
      <a href="https://github.com/shroomlife/awesome-graphs-vue3">awesome-graphs-vue3</a>
      · resize the window to see the charts respond.
    </footer>
  </div>
</template>
