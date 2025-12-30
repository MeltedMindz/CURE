# Favicon Generation Notes

The canonical favicon is `/public/cure-favicon.svg` which uses the split circle symbol with Ethereum purple `rgb(142, 118, 255)`.

## Required PNG Files

The following PNG files need to be generated from the SVG:

1. `/public/favicon-16x16.png` - 16x16 pixels
2. `/public/favicon-32x32.png` - 32x32 pixels  
3. `/public/apple-touch-icon.png` - 180x180 pixels

## Favicon Specifications

The SVG favicon uses:
- Split circle symbol (left half filled with Ethereum purple)
- Outer circle stroke: Ethereum purple, 5px width (heavier for small size legibility)
- Left half fill: Ethereum purple
- Divider line: #0B1220, 5px width
- ViewBox: 0 0 100 100
- Circle center: 50, 50
- Circle radius: 46

## Generation Instructions

You can generate these using ImageMagick, Inkscape, or online tools:

### Using ImageMagick (if installed):
```bash
convert -background transparent -resize 16x16 public/cure-favicon.svg public/favicon-16x16.png
convert -background transparent -resize 32x32 public/cure-favicon.svg public/favicon-32x32.png
convert -background transparent -resize 180x180 public/cure-favicon.svg public/apple-touch-icon.png
```

### Using Inkscape:
```bash
inkscape --export-type=png --export-width=16 --export-filename=public/favicon-16x16.png public/cure-favicon.svg
inkscape --export-type=png --export-width=32 --export-filename=public/favicon-32x32.png public/cure-favicon.svg
inkscape --export-type=png --export-width=180 --export-filename=public/apple-touch-icon.png public/cure-favicon.svg
```

### Using Online Tools:
- Upload `cure-favicon.svg` to https://realfavicongenerator.net/
- Or use https://convertio.co/svg-png/

## favicon.ico

The `favicon.ico` file should contain multiple sizes (16x16, 32x32) in ICO format.
This can be generated from the PNGs using online tools or ImageMagick:

```bash
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

## Note

The favicon SVG uses heavier strokes (5px) compared to the UI logo component, which uses lighter strokes (4px outer, 3.5px divider) for better optical balance at larger sizes.
