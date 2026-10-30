# ALPHA Brand Assets

## Logo system

- `alpha-logo.svg`: full stacked logo with the original wordmark and both descriptors.
- `alpha-isologo.svg`: icon mark only, used for app icons, favicons and social avatars.
- `alpha-isologotipo.svg`: symbol + wordmark lockup for compact brand uses.
- `alpha-isologotipo-dark.svg`: horizontal lockup with light lettering for dark backgrounds.
- `alpha-wordmark.svg`: text-only wordmark for headers and print.

## Brand palette

- Navy: `#0B2A4A`
- Cyan: `#1AA9C6`
- Teal: `#0F7FA5`
- Deep blue: `#0A3B66`
- Gold accent: `#D9B865`
- Light mist: `#EAF8FF`

## Typography

- Primary wordmark: Montserrat / Poppins / Arial Bold, uppercase tracking.
- Secondary line: bold condensed uppercase for the descriptor line.

## Usage guidance

- Use the logo on light backgrounds and the isologo for compact placements.
- Maintain clear space around the brand mark at least equal to the height of the central apex.
- Prefer the navy and cyan version for digital use; reserve the gold accent for highlights or premium moments.
- For dark backgrounds, use the white or light variants or keep the logo on a soft panel with sufficient contrast.

## Files

The assets live in the public/brand directory and can be referenced directly from the frontend as `/brand/<filename>.svg`.

The three primary assets and the dark lockup preserve the artwork from `logoalpha.jpg` as an embedded JPEG with transparent SVG clipping. They are self-contained and work in HTML `<img>` elements without loading an external JPEG. These files are raster artwork inside SVG containers, not fully vectorized paths; their detail is limited by the source image resolution.
