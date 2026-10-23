# Contour-map background

Every page sits on a faint contour map of the Adirondack High Peaks ("high peaks
mist"), drawn from real elevation data. The contours run every 40 m with a slightly heavier index line every
200 m, coloured along the page from maroon through orange and olive to cyan. They have one even strength across
the whole page, faint enough to read text over, and they drift slowly as the page scrolls.

## Where it lives

- `src/components/site/topo-background.tsx`: the fixed, `aria-hidden` canvas, rendered once in `SiteChrome`.
  It loads the data after the page settles and redraws on scroll, resize and theme change. The tuning constants
  are at the top.
- `src/lib/topo-background.ts`: samples the elevation grid for the screen size (cropping the view to fit any
  aspect ratio without stretching) and traces the contours.
- `public/textures/high-peaks-mist.json`: the generated data (about 260 KB; served compressed).
- `scripts/topo_background.py`: regenerates that file.

## Tuning

| Constant | Default | Effect |
| --- | --- | --- |
| `STRENGTH` | `0.2` | Overall strength of the contours: a faint watermark, so text always reads first (the texture study started at 0.68). |
| `NIGHT_STRENGTH` | `0.85` | Relative strength in night mode, where colour reads stronger on dark. |
| `SHOW_PEAK_LABELS` | `false` | Adds small summit names with their published heights. |
| `DRIFT_PER_PIXEL` | `0.004` | How far the contours flow per pixel scrolled (`0` keeps them still). |
| `HIDDEN_ON` | none | Path prefixes where the background is not drawn. |

People who ask their device for reduced motion get a still map. The canvas is hidden when printing.

## Regenerating the data

```sh
python3 scripts/topo_background.py
```

The script downloads the AWS Terrain Tiles it needs (cached in the ignored `.topo-cache/`), decodes them to metres,
frames the High Peaks core around Marcy, Colden and Algonquin, smooths the terrain, and writes the JSON. The
framing, smoothing and line settings are constants at the top of the script. Label positions are snapped to the
nearest true summit in the data. Requires numpy, scipy and Pillow.

Elevation data: [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/), open data from USGS 3DEP, SRTM
and other sources. The site credits it on `/about/platforms`.
