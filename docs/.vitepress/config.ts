import { defineConfig } from 'vitepress'

const base = '/awesome-graphs-vue3/'

export default defineConfig({
  title: 'Awesome Graphs',
  description:
    'A highly customizable, SVG-first chart library for Vue 3 — beautiful, crisp, accessible charts.',
  base,
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { property: 'og:title', content: 'Awesome Graphs for Vue 3' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Beautiful, customizable, SVG-first charts for Vue 3 & Nuxt.',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Charts', link: '/charts/line' },
      { text: 'Theming', link: '/guide/theming' },
      { text: 'Nuxt', link: '/guide/nuxt' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Charts',
          items: [
            { text: 'Line', link: '/charts/line' },
            { text: 'Area', link: '/charts/area' },
            { text: 'Bar', link: '/charts/bar' },
            { text: 'Scatter & Bubble', link: '/charts/scatter' },
            { text: 'Pie & Donut', link: '/charts/pie' },
          ],
        },
        {
          text: 'Customization',
          items: [
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Headless & Composables', link: '/guide/headless' },
          ],
        },
        {
          text: 'Advanced',
          items: [{ text: 'Nuxt', link: '/guide/nuxt' }],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shroomlife/awesome-graphs-vue3' },
    ],
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 shroomlife',
    },
    editLink: {
      pattern:
        'https://github.com/shroomlife/awesome-graphs-vue3/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
