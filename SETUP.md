# 🚀 Profile Setup Checklist

Everything below the line marked **YOU** needs your GitHub login, so I can't do it from here.
Do them in order — takes about 5 minutes total.

---

## ✅ Already done for you
- `README.md` — polished, funny, Vietnamese/TLU-flavored profile
- `.github/workflows/snake.yml` — contribution snake animation
- `.github/workflows/waka.yml` — optional weekly coding-stats
- Files committed locally to git (ready to push)

---

## 👤 YOU — Step 1: Create the magic repo
1. Go to **https://github.com/new**
2. Repository name: **`HaiNinh1`** (exactly your username — GitHub shows a
   *"You found a secret!"* banner when you type it right)
3. Set it **Public**. Do **NOT** add a README/.gitignore/license — leave it empty.
4. Click **Create repository**.

## 👤 YOU — Step 2: Push these files
Open a terminal and run:
```bash
cd /c/Users/Ninh/HaiNinh1-profile
git remote add origin https://github.com/HaiNinh1/HaiNinh1.git
git push -u origin main
```
(If it asks you to sign in, a browser window will pop up — approve it.)

Now open **https://github.com/HaiNinh1** — your new profile is live. 🎉

## 👤 YOU — Step 3: Turn on the snake 🐍
1. On the repo, open the **Actions** tab → click **"I understand my workflows, enable them"**.
2. Left sidebar → **Generate Snake Animation** → **Run workflow** → **Run**.
3. Wait ~1 min. It creates an `output` branch and the snake image goes live.
   (After this it auto-refreshes every 12 hours — no more clicks needed.)

---

## 🎧 OPTIONAL — Spotify "Now Playing"
1. Visit **https://spotify-github-profile.kittinanx.com/** and click **Login with Spotify**.
2. Authorize it → it gives you an embed URL containing your `uid`.
3. In `README.md`, find the commented **"OPTIONAL WIDGETS"** block, remove the
   `<!--` / `-->` around the Spotify part, and replace `YOUR_SPOTIFY_UID` with your uid.
4. Commit & push.

## ⏱️ OPTIONAL — WakaTime coding stats
1. Sign up free at **https://wakatime.com** and install the editor plugin (VS Code /
   Visual Studio) so it tracks your coding time.
2. Copy your API key from **https://wakatime.com/settings/api-key**.
3. On your repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `WAKATIME_API_KEY`   Value: *(your key)*
4. In `README.md`, uncomment the **WakaTime** part inside the "OPTIONAL WIDGETS" block
   (keep the `<!--START_SECTION:waka-->` and `<!--END_SECTION:waka-->` markers).
5. Actions tab → **Waka Readme** → **Run workflow**. Stats fill in automatically each day.

---

## 🎨 Quick customization
- **Header jokes** → edit the `lines=...` in the typing-SVG URL at the top of `README.md`.
- **Colors** → every card uses `theme=tokyonight`. Swap for `radical`, `dracula`,
  `synthwave`, `gruvbox`, `catppuccin_mocha`, etc. to recolor the whole profile.
- **Email privacy** → your email badge is public; edit or delete it if you prefer.
- **School** → I put `TLU` in the About section (from your `JAVA_TLU` repo) — fix the
  name if it's wrong.

## ⚠️ If the Stats card or Trophy shows a broken image
The free public servers (`github-readme-stats` / `github-profile-trophy`) get
overloaded and sometimes fail to render. Fixes:
- **Easiest:** just wait — GitHub caches the image and it usually appears within a day.
- **Permanent:** deploy your own copy of
  https://github.com/anuraghazra/github-readme-stats to Vercel (free) and replace
  `github-readme-stats.vercel.app` in `README.md` with your own instance URL.
- **Or:** delete those two sections — the other 8 elements carry the profile fine.
