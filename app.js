'use strict';

const $ = id => document.getElementById(id);
const val = id => $(id).value.trim();
const chk = id => $(id).checked;

let currentTab = 'preview';
let rawMarkdown = '';

$('genbtn').addEventListener('click', generate);

function generate() {
  const name = val('pname');
  const desc = val('pdesc');

  if (!name || !desc) {
    showToast('Project name and description are required.');
    return;
  }

  rawMarkdown = buildREADME({ name, desc });

  const lineCount = rawMarkdown.split('\n').length;
  $('line-count').textContent = `${lineCount} lines`;

  $('raw-out').textContent = rawMarkdown;
  renderPreview(rawMarkdown);

  const section = $('output-section');
  section.classList.add('visible');

  switchTab(currentTab);

  requestAnimationFrame(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function buildREADME({ name, desc }) {
  const tech     = val('ptech');
  const repo     = val('prepo') || 'username/repo-name';
  const license  = $('plicense').value;
  const features = val('pfeatures').split('\n').filter(f => f.trim());
  const install  = val('pinstall').split('\n').filter(l => l.trim());

  const slug     = name.toLowerCase().replace(/\s+/g, '-');
  const user     = repo.split('/')[0] || 'username';
  const repoName = repo.split('/')[1] || slug;
  const techList = tech ? tech.split(',').map(t => t.trim()).filter(Boolean) : [];

  const isPython = techList.some(t => /python|fastapi|django|flask/i.test(t));
  const isNode   = techList.some(t => /node|react|next|vue|express|nuxt/i.test(t));

  const L = []; // lines
  const push = (...args) => args.forEach(line => L.push(line));

  push(`# ${name}`, '');

  if (chk('s_badges')) {
    if (license !== 'Proprietary') {
      push(`![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-22c55e?style=flat-square)`);
    }
    push(`![Build](https://img.shields.io/badge/build-passing-22c55e?style=flat-square)`);
    if (techList.length) {
      push(`![${techList[0]}](https://img.shields.io/badge/${encodeURIComponent(techList[0])}-latest-3b82f6?style=flat-square)`);
    }
    push('');
  }

  push(`> ${desc}`, '');

  if (chk('s_demo')) {
    push(
      '## Demo',
      '',
      `![${name} screenshot](https://raw.githubusercontent.com/${repo}/main/assets/demo.png)`,
      '',
      `> **Live:** [https://${repoName}.vercel.app](https://${repoName}.vercel.app)`,
      ''
    );
  }

  if (features.length) {
    push('## Features', '');
    features.forEach(f => push(`- ${f}`));
    push('');
  }

  if (techList.length) {
    push('## Tech stack', '', '| Technology | Role |', '|------------|------|');
    techList.forEach(t => push(`| \`${t}\` | — |`));
    push('');
  }

  if (chk('s_install')) {
    push('## Installation', '', '### Prerequisites', '');
    if (isPython)      push('- Python 3.10+', '- pip / virtualenv');
    else if (isNode)   push('- Node.js 18+', '- npm or yarn');
    else               push('- Ensure your runtime dependencies are installed.');
    push('- Git', '');

    push('### Setup', '', '```bash');
    if (install.length) {
      install.forEach(l => push(l));
    } else {
      push(`git clone https://github.com/${repo}.git`, `cd ${repoName}`);
      if (isPython)    push('python -m venv .venv', 'source .venv/bin/activate', 'pip install -r requirements.txt');
      else if (isNode) push('npm install');
    }
    push('```', '');
  }

  if (chk('s_env')) {
    push(
      '## Environment variables',
      '',
      'Create a `.env` file at the project root:',
      '',
      '```env',
      '# App',
      'APP_ENV=development',
      'SECRET_KEY=your-secret-key-here',
      '',
      '# Database',
      'DATABASE_URL=postgresql://user:password@localhost:5432/db',
      '```',
      '',
      '| Variable | Required | Description |',
      '|----------|----------|-------------|',
      '| `APP_ENV` | Yes | `development` or `production` |',
      '| `SECRET_KEY` | Yes | Token signing secret |',
      '| `DATABASE_URL` | Yes | Database connection string |',
      ''
    );
  }

  if (chk('s_usage')) {
    push('## Usage', '');
    if (isPython) {
      push(
        '```bash',
        'uvicorn main:app --reload',
        '```',
        '',
        'Open [http://localhost:8000](http://localhost:8000) — Swagger UI at `/docs`.',
        '',
        '### Example request',
        '',
        '```python',
        'import httpx',
        '',
        'r = httpx.post("http://localhost:8000/api/v1/predict", json={"input": "..."})',
        'print(r.json())',
        '```',
        ''
      );
    } else if (isNode) {
      push(
        '```bash',
        'npm run dev',
        '```',
        '',
        'Open [http://localhost:3000](http://localhost:3000).',
        ''
      );
    } else {
      push('```bash', '# add your run command here', '```', '');
    }
  }

  if (chk('s_api')) {
    push(
      '## API reference',
      '',
      '| Method | Endpoint | Description |',
      '|--------|----------|-------------|',
      '| `GET` | `/api/v1/health` | Health check |',
      '| `POST` | `/api/v1/predict` | Run prediction |',
      '| `GET` | `/api/v1/results/{id}` | Fetch result by ID |',
      '| `DELETE` | `/api/v1/results/{id}` | Delete result |',
      '',
      '> Full interactive docs auto-generated at `/docs` (Swagger UI) and `/redoc`.',
      ''
    );
  }

  if (chk('s_roadmap')) {
    push(
      '## Roadmap',
      '',
      '- [x] Core functionality',
      '- [x] REST API',
      '- [ ] Authentication & authorization',
      '- [ ] Rate limiting & caching',
      '- [ ] Unit and integration tests',
      '- [ ] CI/CD pipeline (GitHub Actions)',
      '- [ ] Docker Compose setup',
      '- [ ] Production deployment guide',
      ''
    );
  }

  if (chk('s_contrib')) {
    push(
      '## Contributing',
      '',
      'Contributions are welcome! Please follow these steps:',
      '',
      '1. Fork the repository',
      '2. Create a feature branch: `git checkout -b feat/your-feature`',
      '3. Commit your changes: `git commit -m "feat: add your feature"`',
      '4. Push to the branch: `git push origin feat/your-feature`',
      '5. Open a pull request',
      '',
      'Please make sure all tests pass and the code follows the existing style.',
      ''
    );
  }

  push('## License', '');
  if (license === 'Proprietary') {
    push(`This project is proprietary software. All rights reserved by ${user}.`);
  } else {
    push(`This project is licensed under the [${license} License](LICENSE).`);
  }
  push('', '---', '', `Made with ♥ by ${user}`);

  return L.join('\n');
}

function switchTab(tab) {
  currentTab = tab;

  const rawEl  = $('raw-out');
  const prevEl = $('prev-out');
  const tabRaw  = $('tab-raw');
  const tabPrev = $('tab-preview');

  if (tab === 'raw') {
    rawEl.classList.add('active');
    prevEl.classList.remove('active');
    tabRaw.classList.add('active');
    tabPrev.classList.remove('active');
  } else {
    rawEl.classList.remove('active');
    prevEl.classList.add('active');
    tabRaw.classList.remove('active');
    tabPrev.classList.add('active');
  }
}

function renderPreview(md) {
  const html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    /* fenced code blocks */
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="lang-${lang}">${code}</code></pre>`)
    /* inline code */
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    /* headings */
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm,  '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,    '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,     '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,      '<h1>$1</h1>')
    /* bold / italic */
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    /* images before links */
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2"/>')
    /* links */
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\|(.+)\|$/gm, row => {
      const cells = row.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, t => `<table>${t}</table>`)
    .replace(/^- \[x\] (.+)$/gm, '<li class="done">☑ $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="todo">☐ $1</li>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[huptbdiocl])/gm, '');

  $('prev-out').innerHTML = `<p>${html}</p>`;
}

function copyOut() {
  if (!rawMarkdown) return;
  navigator.clipboard.writeText(rawMarkdown).then(() => {
    const btn = $('copy-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });
}

function downloadOut() {
  if (!rawMarkdown) return;
  const blob = new Blob([rawMarkdown], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'README.md';
  a.click();
  URL.revokeObjectURL(a.href);
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

window.switchTab  = switchTab;
window.copyOut    = copyOut;
window.downloadOut = downloadOut;