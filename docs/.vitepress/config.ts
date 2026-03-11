import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "English Quest Log",
  description: "English learning journal - Classes, grammar, and vocabulary",
  
  // Base path - required for GitHub Pages subfolder deployment
  base: '/english-quest-log/',
  
  // Clean URLs for better sharing
  cleanUrls: true,
  
  // Theme configuration
  themeConfig: {
    // Site logo
    logo: '/logo.svg',
    
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Clases', link: '/clases/' },
      { text: 'Gramática', link: '/gramatica/' },
      { text: 'Vocabulario', link: '/vocabulario/' }
    ],

    // Sidebar - configured with migrated content
    sidebar: {
      '/clases/': [
        {
          text: 'Clases',
          collapsed: false,
          items: [
            { text: 'Clase 01 - Past Simple', link: '/clases/clase-01' },
            { text: 'Clase 02 - Present Perfect', link: '/clases/clase-02' }
          ]
        }
      ],
      '/gramatica/': [
        {
          text: 'Gramática',
          collapsed: false,
          items: [
            { text: 'Tiempos Verbales', link: '/gramatica/tiempos-verbales' }
          ]
        }
      ],
      '/vocabulario/': [
        {
          text: 'Vocabulario',
          collapsed: false,
          items: [
            { text: 'Vocabulario General', link: '/vocabulario/general' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jadevops/english-quest-log' }
    ],

    // Search - Local search (built-in, no external service needed)
    search: {
      provider: 'local'
    },

    // Footer
    footer: {
      message: 'English Quest Log - Learning journey',
      copyright: '© 2026 English Quest Log'
    },

    // Outline (right sidebar with table of contents)
    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  },

  // Head configuration
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ]
})
