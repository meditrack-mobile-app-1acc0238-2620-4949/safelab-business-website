# SafeLab Business Website

**SafeLab Business Website** is the official landing page for **SafeLab**, a laboratory monitoring solution developed by **MediTrack Startup**. It presents the product, its benefits and service plans, introduces the team, and connects visitors with the web and Android applications.

The website is a responsive, bilingual static site built with **HTML5, CSS3, and vanilla JavaScript**. It can be hosted directly on **GitHub Pages** without a backend or build pipeline.

## SafeLab Ecosystem

| Component | Purpose | Location |
| --- | --- | --- |
| Business Website | Public product presentation and navigation | This repository |
| Web Application | User access to the operational platform | [SafeLab on Render](https://safelab-frontend.onrender.com/) |
| Android Application | Mobile monitoring experience and APK releases | [SafeLab Mobile App](https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app) |
| Android Download | Latest stable installation package | [Download `SafeLab.apk`](https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app/releases/latest/download/SafeLab.apk) |

> **Deployment note:** The APK download URL works when the mobile repository has a publicly accessible, non-prerelease latest release with an asset named exactly `SafeLab.apk`.

## Features

- Responsive landing page for desktop, tablet, and mobile browsers.
- English and Latin American Spanish translations, with English as the initial language.
- Sections for benefits, services, plans, product, team, testimonials, FAQs, and contact information.
- Product-area video presentation with a blended visual treatment and user-initiated playback.
- **About the Team** video embedded from YouTube.
- Login and Sign Up links connected to the deployed SafeLab web frontend.
- Android download dialog linked to the latest stable GitHub Release.
- Accessible navigation, descriptive labels, keyboard interactions, and reduced-distraction media loading.

### Featured Videos

| Section | Current video | URL |
| --- | --- | --- |
| Product area | Validation interviews (currently used until the dedicated promotional video is available) | [Watch](https://youtu.be/mDeXDb51usI) |
| About the Team | SafeLab team presentation | [Watch](https://youtu.be/hP9a5WIMhLk) |

YouTube players are inserted after the visitor selects Play. When an official **About the Product** promotional video is ready, its YouTube ID can be configured without replacing the validation interview URL.

## Repository Structure

```text
safelab-business-website/
├── index.html                  # Landing page markup
├── assets/
│   ├── i18n/
│   │   ├── en.json             # English translations
│   │   ├── es.json             # Spanish translations
│   │   └── i18n.js             # Language handling
│   ├── images/                 # Brand, product, service, and team images
│   ├── js/
│   │   ├── script.js           # Main website interactions
│   │   ├── media.js            # Video players, auth links, APK dialog
│   │   └── site-config.js      # Public integration destinations
│   └── styles/
│       └── styles.css          # Layout, components, responsive styling
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

No Node.js installation, package manager, or frontend build step is required for this version of the website.

## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-business-website.git
   cd safelab-business-website
   ```

2. Start a local static server (Python 3 example):

   ```bash
   python -m http.server 5500
   ```

3. Open **http://localhost:5500/** in your browser.

Use a local HTTP server instead of opening `index.html` with a `file://` URL so translation resources load correctly.

## Public Integration Configuration

The integration URLs and YouTube identifiers are maintained in [`assets/js/site-config.js`](assets/js/site-config.js).

```javascript
window.SafeLabSiteConfig = Object.freeze({
  webAppUrl: 'https://safelab-frontend.onrender.com/',
  loginUrl: 'https://safelab-frontend.onrender.com/',
  signupUrl: 'https://safelab-frontend.onrender.com/',
  githubReleaseRepository: 'meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app',
  githubReleaseApkName: 'SafeLab.apk',
  validationVideoId: 'mDeXDb51usI',
  teamVideoId: 'hP9a5WIMhLk'
});
```

**Authentication:** In the current configuration, both **Login** and **Sign Up** open the web frontend's root URL. Separate destinations should only be configured after their production routes are verified.

**Promotional product video:** To show a dedicated About the Product video, add `productVideoId: 'YOUR_11_CHARACTER_YOUTUBE_ID'` to the object above. If it is absent, the product section continues to identify and display the validation interviews accurately.

**Android distribution:** The website forms the APK URL from the repository and file name:

```text
https://github.com/<OWNER>/<REPOSITORY>/releases/latest/download/<APK_FILENAME>
```

For each new stable Android release, upload an asset named **`SafeLab.apk`** to the [mobile app repository](https://github.com/meditrack-mobile-app-1acc0238-2620-4949/safelab-mobile-app/releases). Keeping this exact asset name allows the landing page to continue pointing to the latest stable release without another GitHub Pages update. GitHub Releases and GitHub Pages are independent distribution mechanisms.

> This repository contains a website, **not the Android APK binary**. APK files belong in the mobile application's GitHub Releases assets.

## GitHub Pages Deployment

The site consists of static files and can be published without a build command.

1. Merge reviewed changes into `develop`.
2. Validate them before merging `develop` into `main`.
3. In **Settings → Pages**, verify that publishing is configured for the intended branch and root directory (typically `main` and `/ (root)` for a branch-based deployment).
4. Confirm that `index.html` and `assets/` are present at the published root.
5. After deployment, test the language switcher, media playback, navigation, Render links, and APK download button.

The actual Pages source must match the repository's GitHub Pages settings; do not assume that pushing a feature branch updates production.

## Collaboration and Version Control

The project uses a **GitFlow-inspired** branching model:

- `main` — stable website published to production.
- `develop` — shared integration branch.
- `feature/*` — active feature work (for example, `feature/av2-landing-release-integration`).
- `fix/*`, `docs/*`, `refactor/*` — focused maintenance and documentation work.
- `archive/*` — preserved historical branches, not active development branches.

Use **Conventional Commits** and Pull Requests to integrate changes. Detailed rules, review checks, and examples are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Accessibility and Localization

- Keep all user-facing text synchronized in `assets/i18n/en.json` and `assets/i18n/es.json`.
- Preserve semantic HTML, meaningful image alternatives, visible focus indicators, and usable keyboard navigation.
- Check layout and interaction at mobile and desktop widths.
- Keep external links and embedded media labeled clearly, and avoid autoplaying videos before user interaction.

## License

This repository includes an [MIT License](LICENSE). Third-party media, logos, linked videos, and application binaries may have separate rights and distribution requirements.
