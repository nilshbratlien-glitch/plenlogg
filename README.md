# plenlogg
A tool to generate fertilisation plans based on STERF research 
Plenlogg

A lawn-care log and fertiliser planner for Norwegian conditions. Single self-contained HTML file, installable as an app on your phone, works fully offline.

Live app: plenloggbeta.netlify.app

What it does

Plenlogg builds a season-long nitrogen plan from your lawn's size, region, input level, and feeding method, then reconciles that plan against what you actually log — so if you're ahead or behind, remaining feeds adjust to bring the season back to target.

Fertiliser planning — grounded in STERF/NIBIO precision-fertilisation research, calibrated for Norwegian growing seasons: starting from spring soil temperature, peaking at midsummer, easing off through autumn for winter hardiness.
Three feeding methods — granular rounds, liquid/foliar passes, or a combination of both, each with its own cadence and safe dose limits.
Slow-release support — a toggle for controlled-release granular products: higher single-dose ceiling, fewer larger rounds, earlier placement so the release tail carries the season, and combination mode where granular and liquid can share a week.
Foliar splitting — any foliar pass above the leaf-uptake threshold automatically splits into lighter passes across the week.
Logging and reconciliation — log mows, feeds, overseeding, and other work. Missed feeds show a grace window with the option to log late or skip; skipped feeds redistribute their nitrogen into the remaining season.
Iron and herbicide — an optional iron programme (colour, moss control, or nutrition) and Plenrens (herbicide) timing guidance.
Season chart — planned nitrogen against what you've applied, with mowing rhythm shown separately below.
Multi-lawn, multi-year — track more than one lawn, step through past and future seasons, export data as backup.
Tech
Single self-contained HTML file — no build step, no framework, no dependencies beyond a Google Fonts link
Installable PWA — add to home screen, opens fullscreen with no browser chrome
Works fully offline once installed
All data stored locally in the browser (localStorage) — nothing leaves the device
Deployed via Netlify, auto-deploying from main on push
Files
File	Purpose
index.html	The entire app — markup, styles, and logic in one file
manifest.webmanifest	PWA manifest (name, icons, standalone display mode)
sw.js	Service worker — offline caching, enables install prompt
icon-192.png, icon-512.png, icon-maskable-512.png	App icons
netlify.toml	Deploy config — correct content-types for the manifest and service worker
Running locally

No build step. Either:

Open index.html directly in a browser, or
Serve the folder with any static server (python3 -m http.server, npx serve, etc.) — needed for the service worker and manifest to work correctly, since some browsers restrict those on file:// URLs.
Deploying

Push to main. Netlify auto-deploys from the connected GitHub repo — no manual build or upload step.

Important: all files must be deployed together at the same directory level (not nested in a subfolder), or the manifest and service worker won't resolve and the PWA install prompt won't appear.

If the site is ever put behind Netlify's password protection, the manifest request will fail (browsers fetch it without credentials), which breaks PWA install. The manifest link already includes crossorigin="use-credentials" to work around this if needed, but a public site is simpler and recommended.

After changing sw.js

Bump the cache name (const CACHE = 'plenlogg-v1' → 'plenlogg-v2') so installed copies pick up the new version instead of serving a stale cached page.

Data

Nothing is synced between devices yet — each install keeps its own local data. Use the export feature regularly as a backup, especially before switching phones or clearing browser data.

Known limitations
No sync between devices (planned)
No weather integration, by design — keeps the app offline and self-contained
Single-file architecture is deliberate: simple to deploy, nothing to break, at the cost of a large diff on any change
