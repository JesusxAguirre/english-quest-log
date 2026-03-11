// Custom theme entry point
// Extend the default theme with customizations
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components if needed
  }
}
