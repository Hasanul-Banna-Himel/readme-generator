# readmekit

![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
![No dependencies](https://img.shields.io/badge/dependencies-zero-22c55e?style=flat-square)
![HTML CSS JS](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-3b82f6?style=flat-square)

> A zero-dependency, client-side README generator. Fill in your project details and get a production-quality `README.md` instantly — no API key, no login, no build step.

---

## Features

- Instant generation — output appears in milliseconds, fully offline
- Smart templates — auto-detects Python / Node.js stack and tailors install commands, usage examples, and prerequisites
- Configurable sections — Badges, Demo, Installation, Usage, API Docs, Contributing, Roadmap, Environment Variables
- Live preview — toggle between raw Markdown and a rendered HTML preview
- One-click copy & download — exports a ready-to-use `README.md` file
- No dependencies — pure HTML, CSS, and vanilla JavaScript
- Dark theme UI — built with `Syne` display font and `DM Mono`

---

## Project structure

```
readmekit/
├── index.html   # Markup and layout (136 lines)
├── style.css    # Dark theme, design tokens, responsive layout (634 lines)
└── app.js       # README builder, markdown renderer, UI logic (358 lines)
```

---

## Usage

No install required. Just open `index.html` in any modern browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve locally (avoids any browser file restrictions)
npx serve .
# or
python -m http.server 8080
```

Then:

1. Fill in **Project name** and **Description** (required)
2. Add your tech stack, GitHub repo, features, and install steps
3. Check or uncheck the sections you want included
4. Click **Generate README**
5. Switch between **Raw** and **Preview** tabs
6. Hit **Copy** or **↓ Download** to grab your `README.md`

---

## How it works

`app.js` contains a template engine that:

- Parses the tech stack field to detect the runtime (Python, Node.js, etc.) and generates appropriate install commands, prerequisites, and usage snippets
- Builds [shields.io](https://shields.io) badge URLs from your project name, license, and primary tech
- Assembles only the sections you checked, in a logical order
- Converts the resulting Markdown to HTML for the preview pane using a lightweight regex-based renderer (no external library)

---

## Customisation

All design tokens live in CSS custom properties at the top of `style.css`:

```css
:root {
  --bg:        #0c0c0c;
  --accent:    #c8f060;   /* change this to re-theme the entire UI */
  --font-display: 'Syne', sans-serif;
  --font-mono:    'DM Mono', monospace;
}
```

To add a new section, add a checkbox in `index.html` and a corresponding block in the `buildREADME()` function inside `app.js`.

---

## Browser support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills needed.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a pull request

Please keep the zero-dependency constraint — no npm, no bundler, no frameworks.

---

## License

MIT © [Hasanul-Banna-Himel](https://github.com/Hasanul-Banna-Himel)