  <!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:voluntree-design-system -->
# Voluntree Design System (Starbucks-Inspired)

A warm, confident, Apple-like retail feel. Solid color blocks, no gradients. Full-pill buttons. Whisper-soft shadows.

---

## 1. Color System (Four-Tier Green)

**Primary Palette:**
- **sb-500** `#00754A` — Green Accent. Primary CTA fill, floating action buttons.
- **sb-600** `#006241` — Starbucks Green. Primary headings, brand signal.
- **sb-700** `#1E3932` — House Green. Dark feature bands, footer, deep panels.
- **sb-800** `#162B25` — Darker green for very deep surfaces.
- **sb-50** `#E8F5EE` — Light green tint for selected states, valid fields.
- **sb-100** `#D4E9E2` — Form valid background.
- **sb-200** `#A8D4C4` — Selected borders, light accents.
- **sb-300** `#72B89B` — Decorative mid-green.
- **sb-400** `#3D8F5E` — Hover accents.

**Surface & Canvas:**
- **cream** `#F2F0EB` — Primary page canvas (warm cream, never pure white).
- **ceramic** `#EDE9E4` — Zone separators, soft section washes.
- **surface** `#FFFFFF` — Card and modal fill.
- **border** `#E5E5E5` — Card borders, dividers.

**Text:**
- **text** `rgba(0,0,0,0.87)` — Primary headings and body.
- **text-secondary** `rgba(0,0,0,0.58)` — Metadata, captions.
- **text-muted** `rgba(0,0,0,0.38)` — Placeholder, disabled.
- **text-inverse** `rgba(255,255,255,1)` — Text on dark green bands.
- **text-inverse-soft** `rgba(255,255,255,0.70)` — Secondary text on dark bands.

**Accent (Rare):**
- **gold** `#CBA258` — Rewards/status ceremony only.
- **gold-light** `#DFC49D`
- **gold-lightest** `#FAF6EE`

**Semantic:**
- **error-text** `#991B1B`
- **warning-text** `#92400E`
- **success-text** `#006241`

## 2. Typography

- **Font:** Inter (Google Fonts), `font-sans` everywhere.
- **Tracking:** tight `-0.01em` universal.
- **Headings:** `font-semibold`, tight tracking, `text-text`.
- **Labels:** `text-xs font-semibold uppercase tracking-wider text-text`.
- **Body:** `text-sm` or `text-base`, `text-text-secondary`.
- **No text below 12px.**

## 3. Buttons

All buttons are **full-pill** (`rounded-full`).

**Primary:**
- `bg-sb-500 text-white rounded-full h-10 px-5`
- `hover:bg-sb-600`
- `active:scale-95` (signature micro-interaction)
- `transition-all duration-200`

**Outline:**
- `border border-sb-500 text-sb-600 bg-transparent rounded-full`
- `hover:bg-sb-50`

**Ghost/Back:**
- `text-text-secondary hover:text-text hover:bg-ceramic rounded-full`

## 4. Cards & Containers

- **Radius:** `rounded-xl` (12px) — not `rounded-2xl`.
- **Fill:** `bg-white`.
- **Border:** `border border-border`.
- **Shadow:** whisper-soft layered:
  `shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]`
- **Hover:** `hover:shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24),0_2px_4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5`
- **Padding:** `p-5` (20px) standard inside cards.

## 5. Inputs

- **Height:** `h-10`
- **Radius:** `rounded-xl` (12px)
- **Border:** `border border-border` (1px, not 2px)
- **Bg:** `bg-white`
- **Focus:** `ring-2 ring-sb-500 border-sb-500`
- **Label:** `text-xs font-semibold uppercase tracking-wider text-text`

## 6. Chip / Card-Select

- **Unselected:** `bg-white border-border text-text-secondary hover:border-gray-300`
- **Selected:** `bg-sb-50 border-sb-500 text-sb-700 font-medium`
- **Radius:** `rounded-xl` for CardSelect cards, `rounded-full` for chips

## 7. Spacing

- Default outer gutter: `16px` (`p-4`, `gap-4`)
- Card internal: `p-5`
- Between cards: `space-y-3` or `gap-3`
- Title→subtitle: `mb-3`
- Label→input: `space-y-1.5`

## 8. Layout Rules

- **Page canvas:** `bg-cream` (`#F2F0EB`) — never pure white.
- **Cards on canvas:** white with border and whisper shadow.
- **No gradients anywhere.** Solid color blocks only.
- **Dark bands:** `bg-sb-700` (`#1E3932`) with white text for feature moments.
- **StepLayout:** `bg-cream` canvas, white content cards.

## 9. Page-by-Page

**Welcome:** White card, solid `bg-sb-500` hero icon (no gradient), `bg-sb-50` sub-card preview, `font-sans` title.

**Basic Details:** White card `rounded-xl`, PhotoUpload at top, 2-col grids for name/age/city/gender/qualification, languages ChipInput.

**Skills:** White card, ChipInput with iconMap and popularTags, talent areas in compact columns.

**Hobbies:** White card, ChipInput with iconMap, representation selector, conditional proof section as solid `bg-sb-50` panel (no gradient).

**Travel:** White card, destination ChipInput with iconMap, travel type CardSelect, 2-col environment+stay grid, Solo or group CardSelect.

**Availability:** White card, SearchableSelect for travel style, Experience CardSelect, remote work toggle with `bg-sb-50` selected state.

**Safety:** White card, `bg-amber-50` inline notice preserved, 2-col emergency contacts, relationship select, optional details in `<details>` collapse, checkboxes with `text-sb-600`.

**Review:** Multi-card dashboard — white completeness card with Progress, 2-col grid of white stat cards, white tips card with neutral badges, centered submit pill button `bg-sb-500 rounded-full`.

## 10. Final Check

- Every button is a full pill (`rounded-full`).
- Every card is white with `rounded-xl` and whisper shadow.
- No gradients. No `font-tanker`. No `bg-beige`.
- Page canvas is always `bg-cream`.
- Active buttons compress with `scale-95`.
- Focus rings are `ring-sb-500`.
<!-- END:voluntree-design-system -->
