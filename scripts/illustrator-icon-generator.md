# Static Icon Generation (Portfolio)

Regenerate fill/stroke static icons (`star`, `info-circle`, `help-circle`, `controls`) after calibrating stroke widths.

## Stroke tables

Use values from `src/config/icon-weights.ts` after running `npm run extract-icon-metrics` and fine-tuning at `/design-system/icon-calibration`.

```javascript
// Strawford (sans) — example after extraction
const STROKE_WIDTHS_SANS = {
  300: 5.12,
  500: 6.36,
  700: 7.06,
};

// Knile (deco) — example after extraction
const STROKE_WIDTHS_DECO = {
  300: 6.97,
  500: 8.17,
  700: 9.77,
};
```

At export size `N` px: `strokeWidth = (baseStrokeAt32 / 32) * N`

## Weights and sizes

- **Weights:** 300, 500, 700 only (not 100–900)
- **Sizes:** 8–128 px

## Output paths

Export into the portfolio `public/icons/` tree:

```
public/icons/sans/{family}/{size}x{size}/{Name}_{weight}_{size}x{size}.svg
public/icons/deco/{family}/{size}x{size}/{Name}_{weight}_{size}x{size}.svg
```

Families: `star`, `info-circle`, `help-circle`, `controls`

## Illustrator script

Source script: `cursor/Refractored Site/scripts/Files/New Script/Illustrator Outline Icon Generator.jsx`

1. Update `STROKE_WIDTHS` to portfolio values (300/500/700)
2. Run for Strawford table → output to `public/icons/sans/`
3. Run for Knile table → output to `public/icons/deco/`

## Interim assets

`npm run copy-static-icons` copies Geologica-calibrated SVGs (weights 300/500/700) from Refractored Site as a placeholder until Illustrator export completes.
