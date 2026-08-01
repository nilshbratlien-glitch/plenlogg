# Turfkeep

Lawn-care log and fertiliser planner, built for Norwegian conditions. One HTML file, installable on your phone, works offline.

Live: https://plenloggbeta.netlify.app/

## What it does

You put in your lawn's size, region, and how hard you want to feed it, and it builds a season plan — grounded in STERF/NIBIO research, so it starts light in spring, peaks around midsummer, tapers off before winter. Feed granular, liquid, or both. Log what you actually do and it corrects the rest of the season to match — miss a feed and it makes it up, skip one on purpose and it doesn't.

Also handles slow-release granular (bigger, fewer rounds), splits foliar sprays that would burn the leaf, tracks mowing and iron and herbicide timing, and does more than one lawn if you need it.

## Files

- `index.html` — the whole app
- `manifest.webmanifest`, `sw.js`, icons — makes it installable as an app
- `netlify.toml` — deploy config

## Running it

Just open `index.html`. If you want the install/offline stuff to work properly, serve it instead of opening the file directly (`python3 -m http.server` is fine).

## Deploying

Push to main, Netlify does the rest.

Everything has to sit in the same folder, not nested — otherwise the manifest and service worker 404 and you don't get the install prompt. Also don't put the site behind Netlify's password protection; browsers fetch the manifest without credentials so it just breaks. Learned that one the hard way.

If you change `sw.js`, bump the cache name in it or your phone will keep serving the old version.

## Data

Nothing syncs between devices yet. Export now and then so you don't lose your log.
