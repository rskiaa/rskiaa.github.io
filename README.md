# Ashutosh Kumar - Senior AI/ML Engineer Portfolio

Google-inspired, interactive static portfolio for Senior AI/ML Engineer Ashutosh Kumar.
The site is built from the resume and covers professional summary, experience,
projects, technical skills, certifications, awards, and contact details.

Features:
- Light and dark mode toggle
- Google color theme
- Animated canvas background
- Interactive impact chips
- Skill logo showcase
- Project category filters
- Expandable project case studies
- Responsive layout for GitHub Pages

## Deploy to GitHub Pages

### Step 1 - Create a GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it: `rskiaa.github.io`
3. Keep it **Public**
4. Don't add README - you already have one

### Step 2 - Push this code
Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "init: portfolio site"
git branch -M main
git remote add origin https://github.com/rskiaa/rskiaa.github.io.git
git push -u origin main
```

For a repository named `rskiaa.github.io`, GitHub Pages usually publishes automatically from `main`.
If it does not, go to your repo > **Settings** > **Pages**, then choose:

- Source: **Deploy from a branch**
- Branch: `main` / `/ (root)`

### Step 3 - Your live URL
`https://rskiaa.github.io`

(Takes ~2 minutes to go live after saving.)

---

## Files

```
portfolio/
|-- index.html    <- resume-driven portfolio content
|-- style.css     <- Google theme, dark/light modes, layout, animations
|-- script.js     <- theme toggle, canvas animation, filters, interactions
|-- assets/       <- downloadable resume PDF
`-- README.md
```

## Customisation

- **Colors**: edit CSS variables at the top of `style.css`
- **Content**: edit `index.html` directly
- **Background density**: adjust the node count logic in `script.js`
- **Theme behavior**: update the theme section in `script.js`
