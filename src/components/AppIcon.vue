<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-for="(d, i) in paths" :key="i">
      <path v-if="d.type !== 'circle'" :d="d.d" />
      <circle v-else :cx="d.cx" :cy="d.cy" :r="d.r" />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 1.8 }
})

const ICONS = {
  home: [
    { d: 'M3 10.5 12 3l9 7.5' },
    { d: 'M5 9.5V21h14V9.5' },
    { d: 'M9.5 21v-6h5v6' }
  ],
  users: [
    { d: 'M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19' },
    { type: 'circle', cx: 9, cy: 7, r: 4 },
    { d: 'M22 19v-1.5a4 4 0 0 0-3-3.87' },
    { d: 'M16 3.2a4 4 0 0 1 0 7.6' }
  ],
  spark: [
    { d: 'M12 3v4' },
    { d: 'M12 17v4' },
    { d: 'M3 12h4' },
    { d: 'M17 12h4' },
    { d: 'm5.6 5.6 2.8 2.8' },
    { d: 'm15.6 15.6 2.8 2.8' },
    { d: 'm18.4 5.6-2.8 2.8' },
    { d: 'm8.4 15.6-2.8 2.8' }
  ],
  help: [
    { type: 'circle', cx: 12, cy: 12, r: 9 },
    { d: 'M9.5 9.5a2.5 2.5 0 0 1 5 .2c0 1.8-2.5 2.3-2.5 3.8' },
    { d: 'M12 17h.01' }
  ],
  clock: [
    { type: 'circle', cx: 12, cy: 12, r: 9 },
    { d: 'M12 7v5l3 2' }
  ],
  chevronDown: [{ d: 'm6 9 6 6 6-6' }],
  chevronLeft: [{ d: 'm15 18-6-6 6-6' }],
  plus: [
    { d: 'M12 5v14' },
    { d: 'M5 12h14' }
  ],
  check: [{ d: 'M20 6 9 17l-5-5' }],
  send: [
    { d: 'M22 2 11 13' },
    { d: 'M22 2 15 22l-4-9-9-4 20-7Z' }
  ],
  stop: [{ d: 'M6 6h12v12H6z' }],
  settings: [
    { type: 'circle', cx: 12, cy: 12, r: 3 },
    {
      d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.15.36.51.63.9.76.13.05.27.07.4.07H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z'
    }
  ],
  trash: [
    { d: 'M3 6h18' },
    { d: 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2' },
    { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' },
    { d: 'M10 11v6' },
    { d: 'M14 11v6' }
  ],
  doc: [
    { d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z' },
    { d: 'M14 3v5h5' },
    { d: 'M9 13h6' },
    { d: 'M9 17h6' }
  ],
  search: [
    { type: 'circle', cx: 11, cy: 11, r: 7 },
    { d: 'm21 21-4.3-4.3' }
  ],
  chat: [
    { d: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z' }
  ],
  book: [
    { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' },
    { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z' }
  ],
  grid: [
    { d: 'M3 3h7v7H3z' },
    { d: 'M14 3h7v7h-7z' },
    { d: 'M14 14h7v7h-7z' },
    { d: 'M3 14h7v7H3z' }
  ],
  coin: [
    { type: 'circle', cx: 12, cy: 12, r: 9 },
    { d: 'M14.5 9.5a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 1.8 0 2.5 5 1.2 5 3.7 0 1.1-1.1 1.8-2.5 1.8a2.5 2 0 0 1-2.5-1.5' },
    { d: 'M12 6.5v11' }
  ],
  target: [
    { type: 'circle', cx: 12, cy: 12, r: 9 },
    { type: 'circle', cx: 12, cy: 12, r: 5 },
    { type: 'circle', cx: 12, cy: 12, r: 1.3 }
  ],
  logout: [
    { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
    { d: 'm16 17 5-5-5-5' },
    { d: 'M21 12H9' }
  ],
  rocket: [
    { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z' },
    { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z' },
    { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' },
    { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }
  ],
  chart: [
    { d: 'M3 3v18h18' },
    { d: 'm7 14 4-4 3 3 5-6' }
  ],
  briefcase: [
    { d: 'M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z' },
    { d: 'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' },
    { d: 'M2 13h20' }
  ],
  key: [
    { type: 'circle', cx: 7.5, cy: 15.5, r: 4.5 },
    { d: 'm10.7 12.3 8.3-8.3' },
    { d: 'm15 5 3 3' },
    { d: 'm18 2 3 3' }
  ],
  arrowRight: [{ d: 'M5 12h14' }, { d: 'm12 5 7 7-7 7' }],
  message: [
    { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z' }
  ],
  refresh: [
    { d: 'M21 12a9 9 0 1 1-3-6.7L21 8' },
    { d: 'M21 3v5h-5' }
  ]
}

const paths = computed(() => ICONS[props.name] || ICONS.help)
</script>
