#!/usr/bin/env node
/**
 * migrate-clase.js
 *
 * Migrates a class from clases/clase-NN/ to docs/clases/
 * Usage:
 *   node scripts/migrate-clase.js 03
 *   node scripts/migrate-clase.js --all
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CLASES_SRC = path.join(ROOT, 'clases')
const CLASES_DEST = path.join(ROOT, 'docs', 'clases')
const INDEX_PATH = path.join(CLASES_DEST, 'index.md')

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`  ${msg}`)
}

function ok(msg) {
  console.log(`  ✅ ${msg}`)
}

function warn(msg) {
  console.log(`  ⚠️  ${msg}`)
}

function error(msg) {
  console.error(`  ❌ ${msg}`)
}

/**
 * Pads a number to 2 digits: 3 → "03"
 */
function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Extracts a field value from markdown content.
 * Looks for: **Field:** value  OR  Field: value (in frontmatter)
 */
function extractField(content, field) {
  // Try bold markdown format: **Fecha:** 2026-01-29
  const boldMatch = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`))
  if (boldMatch) return boldMatch[1].trim()

  // Try frontmatter format: date: 2026-01-29
  const fmMatch = content.match(new RegExp(`^${field.toLowerCase()}:\\s*(.+)$`, 'm'))
  if (fmMatch) return fmMatch[1].trim().replace(/^["']|["']$/g, '')

  return null
}

/**
 * Extracts the title from markdown content.
 * Tries: frontmatter title → first H1
 */
function extractTitle(content) {
  const fmTitle = extractField(content, 'title') || extractField(content, 'Title')
  if (fmTitle) return fmTitle

  const h1 = content.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()

  return null
}

/**
 * Strips existing frontmatter from content
 */
function stripFrontmatter(content) {
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3)
    if (end !== -1) return content.slice(end + 3).trimStart()
  }
  return content
}

/**
 * Sanitizes a date string — if it contains 'xx' or is invalid, returns today
 */
function sanitizeDate(dateStr) {
  if (!dateStr || dateStr.includes('xx') || dateStr.includes('XX')) {
    return new Date().toISOString().split('T')[0]
  }
  return dateStr.trim()
}

// ─── Core migration ─────────────────────────────────────────────────────────

function migrateClase(numStr) {
  const num = pad(parseInt(numStr, 10))
  const srcDir = path.join(CLASES_SRC, `clase-${num}`)

  if (!fs.existsSync(srcDir)) {
    error(`No existe clases/clase-${num}/`)
    return false
  }

  log(`Migrando clase-${num}...`)

  // ── notas.md ──────────────────────────────────────────────────────────────
  const notasSrc = path.join(srcDir, 'notas.md')
  if (!fs.existsSync(notasSrc)) {
    error(`No existe clases/clase-${num}/notas.md`)
    return false
  }

  const notasContent = fs.readFileSync(notasSrc, 'utf-8')
  const title = extractTitle(notasContent) ?? `Clase ${num}`
  const fecha = sanitizeDate(extractField(notasContent, 'Fecha'))
  const nivel = extractField(notasContent, 'Nivel') ?? ''
  const tema = extractField(notasContent, 'Tema') ?? title

  // Build frontmatter
  const notasFrontmatter = [
    '---',
    `title: "${title}"`,
    `date: ${fecha}`,
    `description: "${tema}"`,
    nivel ? `level: ${nivel}` : null,
    '---',
    ''
  ].filter(Boolean).join('\n')

  const notasBody = stripFrontmatter(notasContent)
  const notasDest = path.join(CLASES_DEST, `clase-${num}.md`)
  fs.writeFileSync(notasDest, notasFrontmatter + '\n' + notasBody)
  ok(`docs/clases/clase-${num}.md`)

  // ── tareas.md ─────────────────────────────────────────────────────────────
  const tareasSrc = path.join(srcDir, 'tareas.md')
  if (fs.existsSync(tareasSrc)) {
    const tareasContent = fs.readFileSync(tareasSrc, 'utf-8')
    const tareasTitle = extractTitle(tareasContent) ?? `Tareas — Clase ${num}`
    const tareasDate = sanitizeDate(extractField(tareasContent, 'Fecha de asignación'))

    const tareasFrontmatter = [
      '---',
      `title: "${tareasTitle}"`,
      `date: ${tareasDate}`,
      `description: "Homework clase ${num}"`,
      '---',
      ''
    ].join('\n')

    const tareasBody = stripFrontmatter(tareasContent)
    const tareasDest = path.join(CLASES_DEST, `clase-${num}-tareas.md`)
    fs.writeFileSync(tareasDest, tareasFrontmatter + '\n' + tareasBody)
    ok(`docs/clases/clase-${num}-tareas.md`)
  } else {
    warn(`No hay tareas.md para clase-${num}, se omite`)
  }

  // ── images ────────────────────────────────────────────────────────────────
  const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
  const images = fs.readdirSync(srcDir).filter(f =>
    imageExts.includes(path.extname(f).toLowerCase())
  )

  images.forEach(img => {
    fs.copyFileSync(
      path.join(srcDir, img),
      path.join(CLASES_DEST, img)
    )
    ok(`docs/clases/${img}`)
  })

  // ── update index.md ───────────────────────────────────────────────────────
  updateIndex(num, title, nivel)

  return { num, title, nivel, fecha }
}

/**
 * Updates docs/clases/index.md adding a new row to the table.
 * Skips if the class is already listed.
 */
function updateIndex(num, title, nivel) {
  if (!fs.existsSync(INDEX_PATH)) {
    warn('No existe docs/clases/index.md, se omite actualización del índice')
    return
  }

  const content = fs.readFileSync(INDEX_PATH, 'utf-8')

  // Skip if already listed
  if (content.includes(`clase-${num}`)) {
    warn(`clase-${num} ya está en el índice`)
    return
  }

  // Extract short topic from title (remove "Clase NN — " prefix)
  const shortTitle = title.replace(/^.*?Clase \d+ — /, '').replace(/^📝\s*/, '').trim()

  const newRow = `| ${num} | ${shortTitle} | ${nivel} | [Ver notas](/clases/clase-${num}) | [Ver tareas](/clases/clase-${num}-tareas) |`

  // Insert before the last --- or at end of table
  const updated = content.replace(
    /(\| \d+ \|.*\n)(?!(\| \d+ \|))/,
    `$1${newRow}\n`
  )

  // If regex didn't match (first row), append after table header
  if (updated === content) {
    const withRow = content.replace(
      /(\|[-| ]+\|\n)/,
      `$1${newRow}\n`
    )
    fs.writeFileSync(INDEX_PATH, withRow)
  } else {
    fs.writeFileSync(INDEX_PATH, updated)
  }

  ok(`docs/clases/index.md actualizado con clase-${num}`)
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
Usage:
  node scripts/migrate-clase.js <número>    Migra una clase específica
  node scripts/migrate-clase.js --all       Migra todas las clases existentes

Examples:
  node scripts/migrate-clase.js 3
  node scripts/migrate-clase.js 03
  node scripts/migrate-clase.js --all
`)
  process.exit(0)
}

if (args[0] === '--all') {
  // Find all clase-NN directories
  const dirs = fs.readdirSync(CLASES_SRC)
    .filter(d => d.match(/^clase-\d+$/) && fs.statSync(path.join(CLASES_SRC, d)).isDirectory())
    .sort()

  if (dirs.length === 0) {
    error('No se encontraron clases en clases/')
    process.exit(1)
  }

  console.log(`\nMigrando ${dirs.length} clases...\n`)
  let success = 0

  dirs.forEach(dir => {
    const num = dir.replace('clase-', '')
    const result = migrateClase(num)
    if (result) success++
    console.log('')
  })

  console.log(`\n🎉 ${success}/${dirs.length} clases migradas correctamente\n`)

} else {
  const num = args[0]
  console.log('')
  const result = migrateClase(num)
  if (result) {
    console.log(`\n🎉 clase-${pad(parseInt(num))} migrada correctamente\n`)
  } else {
    process.exit(1)
  }
}
