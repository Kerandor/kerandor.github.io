# kerandor.github.io

Personal site for Tristan Bridges. Static, no build step, no dependencies.

## Layout

```
index.html hydras.html p5.html contact.html   the four pages
player.html                                   one sketch, one WebGL context, in an iframe
style.css                                     tokens and components
assets/hydra/                                 vendored hydra-synth + the sketch sources
assets/data/catalog.json                      generated index of what the site plays
assets/js/site.js                             channel dial and retune
assets/js/audio-shim.js                       synthetic FFT so sketches run without a mic
tools/sync-sketches.mjs                       pull sketches from the hydraz collection
tools/capture.mjs                             find a good seed per sketch, write posters
```

## Running locally

```
python3 -m http.server 8765
```

Then open http://localhost:8765. It has to be served over HTTP; opening the files
directly will not work because the player fetches the catalog.

## Why every sketch is in an iframe

Each sketch patches `o0.constructor.prototype.setMode` and reaches for
`document.getElementsByTagName("canvas")[0]`. Two in one document overwrite each
other and grab the wrong canvas, and a grid of live WebGL contexts flattens a
phone. One iframe per sketch keeps them isolated.

## Why there is an audio shim

The sketches were written for live performance and open their gates with
`a.fft[n]`. hydra only defines `a` when `detectAudio` is on, so with it off the
first line of every sketch throws. `assets/js/audio-shim.js` stands in for the
analyser and derives band energy from time: bin 0 swells slowly and deeply, the
higher bins move faster and shallower.

The mic button rebuilds the player with `detectAudio: true` and hands the
sketches the real analyser instead.

## Adding sketches

```
node tools/sync-sketches.mjs                  # copy + reindex from hydraz
python3 -m http.server 8765 &                 # capture needs a server
node tools/capture.mjs                        # find seeds, write posters
```

`sync-sketches.mjs` preserves seeds already pinned in `catalog.json`, so
re-running it after adding new work does not disturb the existing set. Edit the
`SERIES` and `WORKS` lists at the top of that file to change what ships.

## Seeds

42 of the sketches call `fxrand()` to pick their own frequencies and pixel
sizes, so every hash is a different variant of the same patch. Some variants of
the sparser pieces render near-black. `capture.mjs` searches for a hash that
produces an image and pins it in the catalog, so a first-time visitor never
lands on a dud. Reseed explores other variants; copy link captures the one
currently on screen.

## Changing the display name

It appears in the nav, the hero and the page titles.

```
grep -rl "Tristan Bridges" *.html | xargs sed -i '' 's/Tristan Bridges/NEW NAME/g'
```
