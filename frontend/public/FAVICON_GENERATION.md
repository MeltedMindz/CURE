# Favicon Generation Instructions

## Current Status

The canonical SVG favicon is located at `/public/cure-favicon.svg`. This is the single source of truth for the favicon design.

## Required Favicon Assets

The following files should exist in `/public`:

- `cure-favicon.svg` - Canonical SVG source (already exists)
- `favicon.ico` - Multi-size ICO file (needs to be generated)
- `favicon-16x16.png` - 16x16 PNG (needs to be generated)
- `favicon-32x32.png` - 32x32 PNG (needs to be generated)
- `apple-touch-icon.png` - 180x180 PNG (needs to be generated)

## Generating favicon.ico

Since Next.js and Node.js don't have built-in ICO generation support, you have several options:

### Option 1: Online Tool (Recommended for Quick Setup)

1. Visit https://realfavicongenerator.net/
2. Upload `cure-favicon.svg`
3. Configure:
   - Favicon for iOS: Yes (180x180)
   - Favicon for Android Chrome: Yes
   - Favicon for Windows Metro: Optional
4. Download the generated files
5. Place `favicon.ico` in `/public`
6. Place PNG files in `/public`

### Option 2: ImageMagick (If Installed)

```bash
# Generate PNGs from SVG
convert -background transparent -resize 16x16 public/cure-favicon.svg public/favicon-16x16.png
convert -background transparent -resize 32x32 public/cure-favicon.svg public/favicon-32x32.png
convert -background transparent -resize 180x180 public/cure-favicon.svg public/apple-touch-icon.png

# Generate multi-size ICO from PNGs
convert public/favicon-16x16.png public/favicon-32x32.png public/favicon.ico
```

### Option 3: Inkscape + Online ICO Converter

```bash
# Generate PNGs using Inkscape
inkscape --export-type=png --export-width=16 --export-filename=public/favicon-16x16.png public/cure-favicon.svg
inkscape --export-type=png --export-width=32 --export-filename=public/favicon-32x32.png public/cure-favicon.svg
inkscape --export-type=png --export-width=180 --export-filename=public/apple-touch-icon.png public/cure-favicon.svg

# Then use an online tool like https://convertio.co/png-ico/ to combine PNGs into ICO
```

## SVG Source Specifications

The `cure-favicon.svg` uses:
- Ethereum purple: `rgb(142, 118, 255)`
- Dark background: `#070A12` (or transparent)
- Split circle symbol design
- Heavier strokes (5px) optimized for small size legibility

## Verification

After generating favicon.ico:

1. Place it in `/public/favicon.ico`
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R) to bypass cache
3. Check browser tab to verify icon displays
4. Verify network requests show `/favicon.ico` being loaded

## Metadata Configuration

The `app/layout.tsx` file already references all favicon assets correctly:

```typescript
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/cure-favicon.svg", type: "image/svg+xml" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
}
```

