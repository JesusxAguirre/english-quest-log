import fs from 'fs'
import path from 'path'

interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

/**
 * Reads a markdown file and extracts the title from:
 * 1. frontmatter `title:` field
 * 2. First H1 heading as fallback
 */
function extractTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Try frontmatter title first
    const frontmatterMatch = content.match(/^---[\s\S]*?^title:\s*(.+)$/m)
    if (frontmatterMatch) {
      return frontmatterMatch[1].trim().replace(/^["']|["']$/g, '')
    }
    
    // Fallback: first H1
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return h1Match[1].trim()
    }
  } catch {}
  
  return path.basename(filePath, '.md')
}

/**
 * Generates sidebar items for clases/ directory.
 * Groups classes in chunks of 25 for 100+ classes support.
 * Each class has: notas (main page) + tareas (homework sub-item).
 */
export function generateClasesSidebar(docsDir: string): SidebarItem[] {
  const clasesDir = path.join(docsDir, 'clases')
  
  if (!fs.existsSync(clasesDir)) return []
  
  // Find all clase-NN.md files (notas), exclude tareas and index
  const files = fs.readdirSync(clasesDir)
    .filter(f => f.match(/^clase-\d+\.md$/) && !f.includes('tareas'))
    .sort()

  if (files.length === 0) return []

  const CHUNK_SIZE = 25

  // Build flat list of clase items
  const claseItems: SidebarItem[] = files.map(file => {
    const num = file.match(/clase-(\d+)/)?.[1] ?? ''
    const filePath = path.join(clasesDir, file)
    const title = extractTitle(filePath)
    const link = `/clases/clase-${num}`
    const tareasPath = path.join(clasesDir, `clase-${num}-tareas.md`)

    // Include tareas as nested items if the file exists
    const subItems: SidebarItem[] = fs.existsSync(tareasPath)
      ? [{ text: '✅ Tareas', link: `/clases/clase-${num}-tareas` }]
      : []

    return {
      text: `Clase ${num}`,
      collapsed: true,
      items: [
        { text: `📝 ${title.replace(/^.*?Clase \d+ — /, '')}`, link },
        ...subItems
      ]
    }
  })

  // If <= 25 classes, no grouping needed
  if (claseItems.length <= CHUNK_SIZE) {
    return [
      { text: '← Todas las clases', link: '/clases/' },
      ...claseItems
    ]
  }

  // Group into chunks of 25 for 100+ classes
  const groups: SidebarItem[] = [{ text: '← Todas las clases', link: '/clases/' }]
  
  for (let i = 0; i < claseItems.length; i += CHUNK_SIZE) {
    const chunk = claseItems.slice(i, i + CHUNK_SIZE)
    const from = i + 1
    const to = Math.min(i + CHUNK_SIZE, claseItems.length)
    
    groups.push({
      text: `Clases ${String(from).padStart(2, '0')}–${String(to).padStart(2, '0')}`,
      collapsed: i !== 0, // first group open, rest collapsed
      items: chunk
    })
  }

  return groups
}

/**
 * Generates sidebar items for gramatica/ directory.
 * Auto-discovers all .md files except index.md
 */
export function generateGramaticaSidebar(docsDir: string): SidebarItem[] {
  const gramaticaDir = path.join(docsDir, 'gramatica')
  
  if (!fs.existsSync(gramaticaDir)) return []
  
  const files = fs.readdirSync(gramaticaDir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort()

  const items: SidebarItem[] = files.map(file => {
    const filePath = path.join(gramaticaDir, file)
    const name = path.basename(file, '.md')
    return {
      text: extractTitle(filePath),
      link: `/gramatica/${name}`
    }
  })

  return [
    { text: '← Gramática', link: '/gramatica/' },
    {
      text: 'Temas',
      collapsed: false,
      items
    }
  ]
}

/**
 * Generates sidebar items for vocabulario/ directory.
 * Auto-discovers all .md files except index.md
 */
export function generateVocabularioSidebar(docsDir: string): SidebarItem[] {
  const vocabularioDir = path.join(docsDir, 'vocabulario')
  
  if (!fs.existsSync(vocabularioDir)) return []
  
  const files = fs.readdirSync(vocabularioDir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort()

  const items: SidebarItem[] = files.map(file => {
    const filePath = path.join(vocabularioDir, file)
    const name = path.basename(file, '.md')
    return {
      text: extractTitle(filePath),
      link: `/vocabulario/${name}`
    }
  })

  return [
    { text: '← Vocabulario', link: '/vocabulario/' },
    {
      text: 'Temas',
      collapsed: false,
      items
    }
  ]
}
