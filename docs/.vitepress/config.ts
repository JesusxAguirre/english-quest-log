import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import path from 'path'
import {
  generateClasesSidebar,
  generateGramaticaSidebar,
  generateVocabularioSidebar
} from './generateSidebar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '..')

export default defineConfig({
  title: "English Quest Log",
  description: "My English learning journey — classes, grammar, and vocabulary",

  // Base path for GitHub Pages (repo name subfolder)
  base: '/english-quest-log/',

  // Let VitePress handle clean URLs
  cleanUrls: true,

  themeConfig: {
    // Top navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Clases', link: '/clases/' },
      { text: 'Gramática', link: '/gramatica/' },
      { text: 'Vocabulario', link: '/vocabulario/' }
    ],

    // Dynamic sidebars — auto-generated from folder structure
    // Adding a new clase-NN.md file = automatically appears in sidebar
    sidebar: {
      '/clases/': generateClasesSidebar(docsDir),
      '/gramatica/': generateGramaticaSidebar(docsDir),
      '/vocabulario/': generateVocabularioSidebar(docsDir)
    },

    // Built-in local search — no external service needed
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
              modal: {
                noResultsText: 'Sin resultados para',
                resetButtonTitle: 'Limpiar búsqueda',
                footer: {
                  selectText: 'seleccionar',
                  navigateText: 'navegar',
                  closeText: 'cerrar'
                }
              }
            }
          }
        }
      }
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JesusxAguirre/english-quest-log' }
    ],

    // Footer
    footer: {
      message: 'English Quest Log',
      copyright: '© 2026 — Learning one class at a time 🚀'
    },

    // Table of contents depth
    outline: {
      level: [2, 3],
      label: 'En esta página'
    },

    // Last updated timestamp
    lastUpdated: {
      text: 'Última actualización',
    },

    // Edit link — lets you jump to the source file on GitHub
    editLink: {
      pattern: 'https://github.com/JesusxAguirre/english-quest-log/edit/main/docs/:path',
      text: 'Editar esta página en GitHub'
    }
  },

  // Markdown config
  markdown: {
    // Show line numbers in code blocks
    lineNumbers: true
  }
})
