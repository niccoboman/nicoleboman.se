# Design QA — `/admin`

## Evidence

- Source visual truth: `docs/qa/admin-source.png`
- Browser-rendered implementation: `docs/qa/admin-desktop-final.jpg`
- Full-view side-by-side comparison: `docs/qa/admin-comparison-final.jpg`
- Focused attention/composer comparison: `docs/qa/admin-focused-final.jpg`
- Responsive evidence: `docs/qa/admin-mobile-final.jpg`
- Source pixels: 1487 × 1058
- Implementation pixels: 1487 × 1058
- CSS viewport: 1487 × 1058 at device scale factor 1
- Density normalization: none required; source and implementation were compared at equal pixel dimensions
- Desktop state: `/admin?preview=1`, Today view, three unresolved approval items, empty composer
- Mobile state: `/admin?preview=1`, Today view at 430 × 900 CSS px

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: Familjen Grotesk, Fragment Mono, and Instrument Serif are loaded from the existing Galleriet system. Display scale, weights, line height, wrapping, metadata labels, agenda hierarchy, exception labels, and composer type follow the source. Small optical differences in the generated mock's letterforms are acceptable because the implementation deliberately uses the production site's canonical fonts.
- Spacing and layout rhythm: desktop column starts, agenda marker positions, exception row rhythm, artifact crop, composer bounds, and status line match the source composition. The implementation is 1487 px wide with no horizontal overflow and no vertical overflow at the comparison viewport.
- Colors and visual tokens: the implementation uses the production Galleriet tokens (`gesso`, `carbon`, `betong`, `sienna`, and `hairline`) with source-equivalent contrast and border treatment.
- Image quality and asset fidelity: the abstract artifact is a raster crop from the selected visual target, rendered at its native 98 × 136 slot. No placeholder art, custom SVG art, or CSS-drawn replacement was introduced. UI icons use the Phosphor icon library.
- Copy and content: date, agenda, approval items, provider status, and capture prompt match the selected concept. Supplemental interaction copy is concise Swedish and reflects the agreed approval boundary.
- Responsiveness and accessibility: the 430 px layout has no page-level horizontal overflow; navigation scrolls intentionally, controls retain practical tap targets, focus indicators are inherited from the existing system, and reduced-motion behavior remains intact.

## Full-view comparison evidence

The full comparison shows equivalent information architecture and visual weight: brand/navigation at left, large date and agenda at center, approval queue at right, artifact above the composer, and provider/sync status below. The source and implementation share the same viewport and Today state.

## Focused-region comparison evidence

Focused crops were required because exception typography, icon stroke weight, and composer spacing are too small to judge reliably in the full-view comparison. The focused evidence confirms matched row heights and wrapping in the approval queue, plus equivalent placeholder scale, border, action spacing, and icon family in the composer.

## Comparison history

### Pass 1 — blocked

- P2: the artifact sat at the bottom of the sidebar instead of above the composer.
- P2: the composer was 22 px too low and the main/right column starts drifted from the source.
- Fixes: aligned the desktop grid to the source coordinates, positioned the artifact relative to the composer, adjusted right padding, and corrected the row gap so the composer begins at 861 px.
- Post-fix evidence: composer bounds were measured at top 861.84 px / bottom 969.84 px; the artifact rendered at the source slot.

### Pass 2 — blocked

- P2: agenda rhythm was too compressed, while attention/composer typography and action icons were too light.
- Fixes: matched the agenda's 118 px rhythm and text offset, increased task/composer type to the source scale, and moved the primary action icons from thin to regular Phosphor strokes.
- Post-fix evidence: `docs/qa/admin-comparison-final.jpg` and `docs/qa/admin-focused-final.jpg`.

### Pass 3 — passed

- No remaining actionable P0/P1/P2 findings.
- Browser console: no error-level entries in the final desktop or mobile pass.
- Primary interactions tested: capture and local persistence, Inbox navigation, attention-item expansion, approval resolution/count update, Supabase magic-link login surface, and public-site smoke check.

## Implementation checklist

- [x] Match selected desktop composition and brand system
- [x] Preserve the public website shell outside `/admin`
- [x] Verify capture, navigation, approval, and login interactions
- [x] Verify desktop and mobile rendering with browser screenshots
- [x] Run `npm run check`
- [x] Run `npm run build`

## Follow-up polish

- P3: validate the standalone PWA icon treatment on a physical iPhone after a production deployment.
- P3: replace preview agenda data with the calendar-backed data layer in the next vertical slice.

final result: passed
