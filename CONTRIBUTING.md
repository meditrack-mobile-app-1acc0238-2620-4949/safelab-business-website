# Contributing Guidelines - SafeLab Business Website

Welcome to the **SafeLab Business Website** repository.

This document defines the collaboration standards, Git workflow, coding practices, and contribution rules for all contributors working on the SafeLab Landing Page project.

---

## Project Scope

This repository contains the official landing page / business website for **SafeLab**, a monitoring system for artifacts and supplies used in laboratories developed by **MediTrack Startup**.

Main goals:

- Professional brand presence
- Product presentation
- Lead generation
- Responsive UI/UX
- Multilingual support (EN / ES)
- Maintainable frontend architecture

---

## Recommended Stack

- HTML5
- CSS
- Vanilla JavaScript
- Responsive Design
- Git + GitHub Flow

---

## Branching Model

We use a simplified GitFlow strategy:

- `main` → Stable production version
- `develop` → Integration branch
- `feature/*` → New features
- `fix/*` → Bug fixes
- `docs/*` → Documentation improvements
- `refactor/*` → Code structure improvements

### Examples

```bash
feature/topbar-redesign
feature/testimonials-slider
fix/mobile-navbar
docs/update-readme
refactor/css-structure
```

---

## Mandatory Workflow

### 1. Sync repository

```bash
git checkout develop
git pull origin develop
```

### 2. Create branch

```bash
git checkout -b feature/your-task-name
git push -u origin feature/your-task-name
```

### 3. Work locally

Make your changes with clean commits.

### 4. Commit

```bash
git commit -m "feat: improve hero section spacing"
```

### 5. Push

```bash
git push origin feature/your-task-name
```

---

## Commit Convention

Use Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` visual adjustments
- `refactor:` internal improvement
- `chore:` maintenance

### Examples

```bash
feat: add language selector
fix: correct navbar spacing
style: improve button shadows
docs: update setup guide
refactor: split hero styles into modules
```

---

## Project Structure

```text
safelab-business-website/
├── index.html
├── assets/
│   ├── i18n/
│   ├── images/
│   ├── videos/
│   ├── js/
│   └── styles/
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## Frontend Rules

### HTML

- Use semantic tags
- Keep indentation consistent
- Accessible labels when needed

### CSS

- One file per section/component
- Use variables for colors
- Keep responsive structure clean

### JavaScript

- Modular scripts
- No inline JS
- Clear naming conventions

---

## UI / UX Rules

- Keep SafeLab branding consistent
- Use logo palette colors
- Smooth transitions allowed
- Responsive first mindset
- Avoid cluttered layouts

---

## Assets Rules

- Images inside `assets/images`
- Videos inside `assets/videos`
- Prefer optimized formats (`webp`, `svg`, `png`)
- Use lowercase names

Example:

```text
hero-dashboard.webp
safelab-logo.svg
team-member-1.png
```

---

## Important Rules

- Never commit directly to `main`
- Always pull before working
- Keep commits atomic
- Communicate large changes
- Respect code consistency

---

## Collaboration Culture

- Be respectful
- Give constructive feedback
- Help teammates
- Prioritize quality over speed
