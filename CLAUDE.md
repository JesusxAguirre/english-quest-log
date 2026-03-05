# 🤖 CLAUDE.md — Reglas del Agente

Este archivo define cómo debe comportarse el agente de IA al trabajar en este repositorio.

---

## 🎯 Propósito del repositorio

Este es un **diario de aprendizaje de inglés** personal. El objetivo es registrar el progreso clase a clase de forma organizada, consultable y versionada.

---

## 📂 Estructura obligatoria

```
english-quest-log/
├── clases/
│   ├── clase-01/
│   │   ├── notas.md       → Apuntes de la clase
│   │   ├── tareas.md      → Homework asignado + respuestas del alumno
│   │   └── *.png          → Imágenes de referencia de esa clase
│   ├── clase-02/
│   │   └── ...
│   └── clase-NN/
│       └── ...
├── gramatica/              → Apuntes de gramática generales (sin clase específica)
├── vocabulario/            → Listas de vocabulario por tema
├── progreso.md             → Registro general del progreso
├── README.md               → Descripción del repositorio
└── CLAUDE.md               → Este archivo
```

---

## 📏 Reglas

### 1. Una carpeta por clase
- Cada clase **SIEMPRE** va en su propia carpeta: `clases/clase-NN/`
- El formato del número es con dos dígitos: `clase-01`, `clase-02`, `clase-10`
- NUNCA mezclar notas de dos clases en el mismo archivo

### 2. Archivos por carpeta de clase
Cada `clase-NN/` debe tener:
- `notas.md` → contenido de lo visto en clase
- `tareas.md` → homework asignado y espacio para las respuestas del alumno
- Imágenes (`.png`, `.jpg`) si hay material visual de esa clase

### 3. notas.md — estructura esperada
```markdown
# 📝 Clase NN — [Tema]
**Fecha:** YYYY-MM-DD
**Tema:** ...
**Nivel:** B1 / B2 / etc.

## 🎯 ¿Para qué se usa?
## 🏗️ Estructura
## 📚 Vocabulario / Verbos
## 🔊 Tips de pronunciación (si aplica)
## 🔗 Recursos
```

### 4. tareas.md — estructura esperada
```markdown
# ✅ Tareas — Clase NN
**Fecha de asignación:** YYYY-MM-DD
**Fecha de entrega:** YYYY-MM-DD o "pendiente"

## 📋 Tareas asignadas
- [ ] Tarea 1
- [ ] Tarea 2

## 📝 Mis respuestas
<!-- El alumno completa esto desde GitHub -->

## 💬 Notas adicionales
```

### 5. El alumno completa las tareas via GitHub
- El agente crea el `tareas.md` con la estructura y las tareas asignadas
- Las secciones de respuestas se dejan con comentarios `<!-- -->` como guía
- El alumno las completa directamente desde la UI de GitHub (edit file)
- El agente NO debe completar las respuestas por el alumno

### 6. Imágenes
- Las imágenes van **dentro de la carpeta de su clase**
- Se referencian con path relativo: `![descripción](./nombre.png)`
- NUNCA dejar imágenes sueltas en la raíz del repositorio

### 7. Gramática general
- Si un tema gramátical aplica a múltiples clases, va en `gramatica/`
- Si es específico de una clase, va dentro de `notas.md` de esa clase

### 8. Progreso
- `progreso.md` se actualiza con un resumen breve después de cada clase
- Incluir: fecha, tema, logros, pendientes

---

## 🚫 Prohibido

- Mezclar clases en un mismo archivo
- Dejar archivos en la raíz que deberían estar en subcarpetas
- Crear carpetas con nombres en inglés (`classes/` → siempre `clases/`)
- Completar las respuestas de tareas por el alumno

---

## ✅ Al agregar una nueva clase, el agente debe

1. Crear la carpeta `clases/clase-NN/`
2. Crear `notas.md` con el contenido de la clase
3. Crear `tareas.md` con las tareas asignadas y estructura vacía para respuestas
4. Mover cualquier imagen relacionada a esa carpeta
5. Actualizar `progreso.md` con un resumen de la clase
6. Actualizar el árbol en `README.md` si cambió la estructura
