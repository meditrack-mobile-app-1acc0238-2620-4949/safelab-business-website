# Contributing to SafeLab Business Website

Thank you for contributing to **SafeLab**, developed by **MediTrack Startup**. This guide documents how to collaborate on the public-facing landing page while preserving its original visual identity, accessibility, translations, and integration with the SafeLab ecosystem.

For product information and local setup, see the [README](README.md).

## Scope and Technology

This repository contains a **static business website** using:

- **HTML5** for semantic page structure.
- **CSS3** for branding, layouts, responsive design, and media transitions.
- **Vanilla JavaScript** for navigation and interactive features.
- **JSON** for English (`en`) and Spanish (`es`) interface copy.
- **Git and GitHub** for source control, collaboration, and deployment.

The mobile application and its APK builds belong to the separate [`safelab-mobile-app`](https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app) repository, not to this website's source tree.

## Branching Model

We follow a **GitFlow-inspired workflow**.

| Branch | Responsibility |
| --- | --- |
| `main` | Stable production source for the business website. |
| `develop` | Integration and validation of completed features. |
| `feature/*` | New product or website functionality, created from `develop`. |
| `fix/*` | Corrections to website behavior or presentation. |
| `docs/*` | Documentation-only changes. |
| `refactor/*` | Internal improvements without intentional behavior changes. |
| `release/*` | Optional release stabilization before production. |
| `hotfix/*` | Urgent production corrections, typically based on `main`. |
| `archive/*` | Historical branches retained for traceability; do not develop new features here. |

### Current AV2 Work

The designated working branch for the current landing integration is:

```text
feature/av2-landing-release-integration
```

It is based on `develop` and covers the integrated videos, Render authentication links, and the Android APK download flow. This naming convention is independent from the existing `feature/av2-about-team-video` branch, which should not be renamed as part of the TB1 branch archival effort.

Historical TB1 branches may be renamed from `feature/tb1-*` to `archive/tb1-*` when their work is complete. Renaming preserves their commit history; verify open Pull Requests and collaborator checkouts before renaming.

## Standard Contribution Workflow

### 1. Synchronize `develop`

```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
```

### 2. Create a focused branch

```bash
git switch -c feature/av2-landing-release-integration
```

If that branch already exists locally or remotely, switch to it and synchronize it instead of creating a duplicate.

### 3. Make changes and validate locally

Run a static server from the repository root:

```bash
python -m http.server 5500
```

Visit `http://localhost:5500/` and verify the affected features on both desktop and mobile layouts.

### 4. Commit with a clear message

```bash
git add index.html assets/ README.md CONTRIBUTING.md
git commit -m "feat(landing): integrate videos, Render authentication and Android APK downloads"
```

Stage only files actually changed for your task; the command above is an example of the AV2 integration scope.

### 5. Push and open a Pull Request

```bash
git push -u origin feature/av2-landing-release-integration
```

Create a Pull Request with **`develop` as the base** and request review. After merge, validate `develop`, then promote the reviewed changes to `main` through a separate Pull Request. Never use the feature branch as the production Pages source unless the team deliberately changes its deployment strategy.

## Conventional Commits

Use the format:

```text
<type>(<scope>): <imperative summary>
```

Recommended types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`.

Examples:

```bash
feat(media): embed SafeLab team presentation
feat(download): link Android APK to latest GitHub Release
fix(i18n): correct Spanish download dialog text
style(landing): soften video edges without changing branding
docs: update deployment and contribution instructions
refactor(media): simplify video player initialization
```

Keep commits focused. Do not combine unrelated content, styling, and deployment changes without justification.

## Source Code Conventions

### HTML

- Prefer semantic elements (`header`, `nav`, `main`, `section`, `footer`).
- Preserve the existing section IDs used by navigation links.
- Use descriptive `alt` attributes and accessible names for icon-only buttons.
- Use `aria-*` attributes where they improve dialog, menu, and control accessibility.
- Avoid inline event handlers and unnecessary structural changes.

### CSS

- Keep the current SafeLab color palette, typography, spacing system, and recognizable design.
- Edit [`assets/styles/styles.css`](assets/styles/styles.css) rather than adding one-off styles to page markup.
- Respect mobile breakpoints, focus states, reduced-motion preferences, and text contrast.
- Blend media with the existing page using gradients, responsive containers, and controlled transitions; do not obscure playback controls.

### JavaScript

- Keep user-facing URLs and external integration identifiers in [`assets/js/site-config.js`](assets/js/site-config.js).
- Use [`assets/js/media.js`](assets/js/media.js) for the existing media, APK download dialog, and authentication-link integrations.
- Preserve keyboard support, escape-to-close behavior, and focus management in dialogs.
- Validate URLs and user-controlled input before injecting it into elements or attributes.
- Do not commit API keys, tokens, signing material, passwords, or environment secrets.

### Internationalization (i18n)

- Add or edit equivalent keys in **both** `assets/i18n/en.json` and `assets/i18n/es.json`.
- Use English as the default interface language and clear Latin American Spanish translations.
- Avoid hard-coded visible interface strings in JavaScript unless they are explicit safe fallbacks.
- Test labels, dialogs, media controls, and navigation in both languages.

### Assets and External Video

- Keep existing imagery inside `assets/images/` and optimize additions appropriately.
- Reference YouTube media by its official video identifier rather than storing large copies in this repository.
- Preserve click-to-play behavior and meaningful labels for the validation-interview and team videos.
- Do not present validation interviews as an official promotional About the Product video. A separate promotional ID can be added as `productVideoId` when available.
- Confirm permission to publish images, team profiles, testimonials, and other third-party media.

## Integration Rules

### Web Application (Render)

The current public configuration uses:

```text
https://safelab-frontend.onrender.com/
```

Both `loginUrl` and `signupUrl` currently resolve to this entry point. Do not invent separate production paths for login or registration; verify the deployed routes before changing either destination.

### Android APK (GitHub Releases)

The APK is served from the mobile project's **latest stable GitHub Release**:

```text
https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app/releases/latest/download/SafeLab.apk
```

Before changing the download flow, confirm that:

1. The repository and release are publicly accessible.
2. The release is published and not marked as a prerelease.
3. The attached asset is named **exactly** `SafeLab.apk`, including capitalization.
4. The APK is an installable, appropriately signed build that points to production services.
5. The URL works from the published landing page and an Android device.

Do **not** upload an APK directly to the website's `assets/` folder or commit an APK to this repository for distribution. Publishing a new version in the mobile repository should not require modifying GitHub Pages if the asset name remains the same.

## Pull Request Expectations

A Pull Request should state:

1. **What changed** and why it matters.
2. **Which sections or files** were updated.
3. **How it was validated**, including browser and mobile checks.
4. **Any remaining dependencies**, such as an unpublished promotional video or release asset.
5. **Visual evidence**, when UI changes are involved.

Ask for a teammate's review before merging. Resolve feedback on the feature branch and keep `main` production-ready.

## Collaboration Principles

- Communicate respectfully and provide constructive, specific reviews.
- Preserve existing behavior unless a change is explicitly required.
- Prefer small, readable updates over wholesale rewrites of the original landing.
- Keep feature history traceable through branches, Pull Requests, and Conventional Commits.
- Treat accessibility, localization, security, and consistency as release requirements.

## License

This repository includes an [MIT License](LICENSE). Check any third-party asset licensing separately before publishing it.
