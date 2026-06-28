# 🍳 The Family Cookbook

A free, public recipe website that anyone can read, plus an AI workflow that adds recipes from
**any link** — websites, Instagram Reels, YouTube, TikTok, Facebook — automatically extracting the
ingredients and steps, converting everything to **Hong Kong metric units (g · ml · °C)**, pulling
the images/video, and filing it under the right type.

- **For cooks:** open the website, browse by type, search, tap a recipe, cook (or print it).
- **Two languages:** every recipe shows in **English** or **Boso Suroboyoan** (Surabaya Javanese) —
  flip the toggle in the top-right and it sticks. Ingredients and steps both translate; quantities
  stay metric.
- **To add a recipe:** paste the link to Claude and say "add this to the cookbook."
- **Cost:** $0. Hosting is free on GitHub Pages; the only optional cost is social-media scraping,
  which runs on a free tier.

---

## How it's organized

```
recipe-cookbook/
├── index.html              # the website (the cookbook)
├── assets/style.css, app.js
├── recipes/
│   ├── index.json          # catalog — every recipe, lightweight (for the homepage + search)
│   └── <slug>.json         # one file per recipe (full details)
├── images/<slug>/          # downloaded photos per recipe
└── .agents/skills/add-recipe/   # the AI instructions that turn a link into a recipe
```

The website is a plain static site (no build step, no server, no database). It reads the JSON files
in `recipes/` and renders the cookbook. Everything is just files in this folder.

---

## One-time setup: publish it for free (GitHub Pages)

You need a free GitHub account (github.com). Then, from inside this folder:

```bash
# 1. Make it a git repo and commit
git init
git add .
git commit -m "feat: initial cookbook"

# 2. Create a repo on GitHub named e.g. "cookbook" and push
#    (Claude can do this for you with the GitHub CLI: `gh repo create`)
git branch -M main
git remote add origin https://github.com/<your-username>/cookbook.git
git push -u origin main
```

Then turn on Pages:
1. On GitHub, open the repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Save.
4. After a minute your cookbook is live at:
   **`https://<your-username>.github.io/cookbook/`**

Share that link with your wife and cook — no login needed to read it. **Tip:** on a phone, open the
link and "Add to Home Screen" so it behaves like an app.

> Prefer Claude to do all of this? Just say *"set up the GitHub repo and deploy the cookbook"* and
> it will run the commands (you'll log in to GitHub once).

---

## Adding a recipe (the daily workflow)

In Claude (in this project folder), paste a link:

> *Add this to the cookbook: https://www.instagram.com/reel/ABC123/*

Claude will:
1. Detect the source and pull the content (caption, transcript, description, page text).
2. Extract the **ingredients** and **step-by-step method**.
3. Convert all measurements to **metric (g, ml, °C)** — keeping the original alongside.
4. Download the **photos** and set up the **video to play inline**.
5. File it under the right **type** (Mains, Soups, Desserts, Drinks, …) and add **tags**.
6. Save the files, update the catalog, and (if set up) push so the site updates within a minute.

You can also paste raw recipe text, or several links at once.

### Optional: better social-media extraction
Recipes on Instagram / TikTok / YouTube are pulled via **Apify** scrapers. Sign up free at
[apify.com](https://apify.com) (the free tier includes ~US$5 of monthly credit — plenty for personal
use) and connect it so Claude can read captions, transcripts, and media. Plain websites and blogs
work without any of this.

---

## Previewing locally (optional)

To see the site before deploying, serve this folder over a local web server (opening `index.html`
directly won't load the JSON):

```bash
cd recipe-cookbook
node serve.js          # then open http://localhost:8732
# or:  python3 -m http.server 8000   # then open http://localhost:8000
```

---

## Categories

Recipes are grouped under a fixed set of types so the cookbook stays tidy:

🍳 Breakfast · 🍛 Mains · 🍲 Soups · 🍜 Noodles & Rice · 🥬 Vegetables & Sides ·
🥟 Dim Sum & Snacks · 🍰 Desserts & Sweets · 🥐 Baking · 🧋 Drinks · 🥄 Sauces & Basics

To add or rename a category, edit the `CATEGORIES` list in `assets/app.js` and the table in
`.agents/skills/add-recipe/SKILL.md` so they stay in sync.

---

## FAQ

**Is it really free?** Yes — GitHub Pages hosting is free for public repos, the site has no running
costs, and social scraping uses a free tier. The only "cost" is your time pasting links to Claude.

**Can my cook edit it?** They don't need to — they just read it. Adding/editing recipes goes through
Claude (or by hand-editing the JSON files if you're comfortable).

**What about the videos?** The original video is embedded and plays inline; it isn't re-hosted (that
would be heavy and against most platforms' terms). The source link is always kept too.

**The two starter recipes** (Cantonese Steamed Egg, Hong Kong Milk Tea) are samples so the site
isn't empty — delete them anytime by removing their files and their entries in `recipes/index.json`.

Built to be simple, free, and to last. Happy cooking. 🥢
