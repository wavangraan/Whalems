# Whalem's Business Manager — PWA

This is the installable, offline-capable web version of Whalem's Business Manager:
customers, quotes, jobs, invoices, expenses, a task/material job estimator, photo +
text-scan capture for slips and quotes, and a voice-capture inbox.

Everything runs entirely in the browser — data is stored on the device
(`localStorage`), there is no backend server.

## 1. Put it on GitHub

1. Create a new **public** repository on GitHub (public is required for free GitHub Pages).
2. Upload every file in this folder to the repository, keeping the folder structure:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `logo.png`
   - `icons/` (all files inside)
   - This `README.md`

   Easiest way: on the repo's GitHub page, click **Add file → Upload files**, drag
   in this whole folder, and commit.

## 2. Turn on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. GitHub will give you a URL like:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
5. Open it — you should see the app load, and your browser's address bar or menu
   should offer an "Install app" option. That confirms the PWA is working.

It can take a minute or two the first time before the URL goes live.

## 3. Build the Android app with PWABuilder

1. Go to **https://www.pwabuilder.com**.
2. Paste in your GitHub Pages URL and click **Start**.
3. PWABuilder will score the app (manifest, service worker, icons are all already
   set up here, so it should score well) and let you **Package for stores** —
   choose **Android**.
4. Download the generated package. It gives you a signed **.aab**/**.apk** you can
   sideload for testing, or upload to the Google Play Console.

### Important: Digital Asset Links (so the app opens without a browser address bar)

PWABuilder's Android package is a **Trusted Web Activity** — it opens your live
GitHub Pages site inside an app shell. For it to look and feel like a real
installed app (no browser UI), the site has to prove it belongs to the same
developer as the app, via a file at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/.well-known/assetlinks.json
```

PWABuilder's Android package step generates this file's contents for you
(including the signing key fingerprint) — copy what it gives you into a file at
`.well-known/assetlinks.json` in this same repo, commit it, and it'll be served
automatically at that URL. Without this step the app still works, it'll just show
a small browser toolbar at the top instead of a clean full-screen app.

### iOS / Windows

PWABuilder can also package this same URL for iOS (via Xcode) and Windows from
the same **Package for stores** screen, no changes needed on this side.

## 4. Updating the app later

Any time you want to change something, edit the files in the GitHub repo (or push
new commits) — GitHub Pages redeploys automatically, and everyone's installed app
picks up the change the next time they open it with a connection (the service
worker fetches fresh files when online, and falls back to the last cached
version when offline).

## Notes on what changed for the web/PWA version

- **PDF / Share** now opens a print-ready view and triggers your browser's print
  dialog, where "Save as PDF" works on both desktop and Android Chrome — no
  native app or extra library needed.
- **Backup / Restore** downloads a `.json` file via the browser, same as before.
- **Voice input** (in the Inbox tab) uses the browser's built-in speech
  recognition (Chrome supports this natively) — no extra setup needed, and it
  tends to work *better* here than inside a plain Android WebView.
- **Text-scan on photos** (expense slips / supplier quotes) needs an internet
  connection the first time it's used in a session, to load the text-recognition
  library. It fails gracefully and lets you type details manually if you're
  offline.
