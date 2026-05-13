<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:voluntree-design-system -->
# Voluntree Design System

Three-layer reference for keeping the onboarding UI visually consistent across all sessions.

---

## Layer 1 — Global Design Tokens

Canonical values from `globals.css` and `components/ui/*`. Paste into every session.

```txt id="vt-tokens"
Voluntree canonical design tokens — use these exact values everywhere.

COLORS
  Page background: bg-beige (#f8f6f1)
  Surface/card: bg-white or bg-surface (#ffffff)
  Text: text-text (#1f2937)
  Subtext: text-text-secondary (#6b7280)
  Muted: text-text-muted (#9ca3af)
  Primary button: bg-brand-500 (#2f7d52) hover:bg-brand-600, text-white
  Selected chip/card: bg-brand-50 (#f0faf4) border-brand-200
  Border: border-border (#e5e9e4) or border-border-light (#f0f1ef)
  Input bg: bg-white, border-2 border-border
  Input focus: ring-2 ring-brand-500, border-brand-500
  Section card tints: all white (bg-white, border-border) — color comes from
    content (selected chips, badges, buttons), not card backgrounds
  Status: bg-success / bg-warning / bg-error (defined in theme)
  Secondary button: variant="outline" (border-2 border-brand-200, text-brand-700)

TYPESETTING
  Headings: font-tanker (Tanker typeface), heading-2xl/3xl/4xl/5xl/6xl
  Body: font-manrope via font-sans, text-xs/sm/base
  Labels: text-xs font-semibold uppercase tracking-wider
  No text below 12px. Sizes in multiples of 4 (xs=12, sm=14, base=16, etc.)
  Line height ≥130%

RADIUS
  Section cards: rounded-2xl (1.25rem)
  Inputs/buttons: rounded-xl (1rem)
  Chips/badges: rounded-full
  Inner panels: rounded-lg (0.75rem)

SHADOWS
  Cards: shadow-sm
  Hover: hover:shadow-md hover:-translate-y-0.5 (use .card-hover utility)

SPACING (Tailwind gap/p/space scale)
  Micro inside cards: gap-1, gap-1.5, p-2
  Close: gap-2, p-3, space-y-1.5
  Medium: gap-2.5, p-4, p-5, space-y-3
  Large: space-y-4, space-y-5, gap-3
  Sections: space-y-6+, py-4 sm:py-6

COMPONENT SYSTEM
  Prefer shadcn/ui: Button, Input, Textarea, Select, Badge, Card,
    Avatar, Progress, Separator, Accordion, Tabs
  Do NOT use raw <select>, <input>, or <button> when shadcn exists.
  Button default: bg-brand-500, rounded-xl, h-10 md, font-tanker
  Input: h-10, rounded-xl, border-2, bg-white, focus ring brand-500
  Card wrapper: rounded-2xl border border-border shadow-sm
```
---

## Layer 2 — Page Tuning Prompt

For one-page passes: spacing rhythm, grouping, compression, hierarchy.

```txt id="vt-page-tune"
One-page tuning pass for a Voluntree onboarding screen. Apply these rules.

SPACING RHYTHM
  Title→subtitle: mb-3 (12px)
  Label→input: space-y-1.5 (6px)
  Related fields: keep in same card with space-y-3 between groups
  Unrelated sections: separate cards with space-y-3 between cards
  Card internal padding: p-5
  Do not stack controls too tight (min gap-2) or too loose (max space-y-4 inside a card)

GROUPING
  One idea = one card. Never split a single logical section across multiple cards.
  Related inputs (e.g. city+state, name+age) go in a 2-col grid: grid-cols-2 gap-2.5
  Each card uses bg-white with border-border — topic is communicated by
    content (chips, badges, button colors), not card background

REDUCE SCROLL
  Use 2-column grids on desktop wherever inputs pair naturally
  Chip grids: columns={3} or columns={2} instead of wrapping single-row
  Helper text: keep to one line. Remove "we'll use this to..." prose.
  Each card should fit on screen without excessive scrolling
  Review step: use summary cards with badges, not full-width descriptions

VISUAL HIERARCHY
  Every card should have a clear visual role — topic is communicated by content, not card background tint
  Selected state is always bg-brand-50 + border-brand-200 (chips, cards, buttons)
  Do not invent new selected-state colors per page
  StepLayout handles the header (title + subtitle) — cards are content only

READABILITY
  All cards: rounded-2xl border border-border p-5 shadow-sm
  Input labels: text-xs font-semibold uppercase tracking-wider
  Helper/subtext: text-xs text-text-muted
  Keep contrast high — no gray text on gray backgrounds
  Every interactive element needs a visible focus ring (ring-2 ring-brand-500)
```
---

## Layer 3 — Full Master Prompt

For onboarding-wide audits and redesign passes.

```txt id="vt-master"
Voluntree onboarding master UI system — a single coherent Apple-inspired
design language. All pages must feel like one product, not a collection.

PRINCIPLES
  Calm, premium, trustworthy, highly readable.
  One color palette, one spacing scale, one component system.
  Visual repetition creates trust — the same element always looks the same.
  Every screen shows: what section I'm in, what belongs together, what's next,
  what's selected, what's interactive.

CANONICAL TOKENS (from globals.css + shadcn components)
  Background: beige. Surface: white. Text: #1f2937. Subtext: #6b7280.
  Primary: brand-500 (#2f7d52). Primary hover: brand-600.
  Selected state: brand-50 bg + brand-200 border. Border: #e5e9e4.
  Section tints: brand-50 (skills), cream (hobbies), earth-50 (travel),
    ocean-50 (availability), warm-50 (safety), gradient brand→mint (hero/review).
  Font: Tanker (headings), Manrope (body). Sizes in multiples of 4. No text <12px.
  Radius: cards=2xl, inputs/buttons=xl, chips=full, inner panels=lg.
  Shadows: cards=sm. Hover=md with -translate-y-0.5.
  Components: shadcn/ui — Button, Input, Textarea, Select, Badge, Card,
    Avatar, Progress, Separator, Accordion, Tabs. No raw HTML controls.

SPACING RHYTHM (strict, not random)
  Title→subtitle: mb-3. Label→input: space-y-1.5. Related fields: space-y-3 inside card.
  Cards: space-y-3 between cards. Card padding: p-5.
  2-col grids: grid-cols-2 gap-2.5. Chip columns: 3 on desktop.
  Max space-y-4 inside any single card.

LAYOUT RULES
  StepLayout uses max-w-7xl centered. Content is lg:col-span-10 lg:col-start-2.
  dashboard=true removes the outer white wrapper — children render directly
    as tinted cards against the beige background.
  No skinny centered column. Use horizontal space generously.
  Each step is one or more section cards with topic-appropriate background tint.
  Cards: rounded-2xl border border-border shadow-sm p-5.
  Mobile: stack gracefully, same spacing scale.

BUTTON RULES
  Primary: bg-brand-500 text-white rounded-xl h-10 md font-tanker shadow-sm
    hover:bg-brand-600 hover:shadow-md active:scale-[0.98]
  Secondary/outline: variant="outline" — border-2 border-brand-200 text-brand-700
  Ghost/back: variant="ghost" — text-text-secondary hover:text-text hover:bg-gray-100
  All buttons: rounded-xl, transition-all duration-200, focus-visible:ring-2
    focus-visible:ring-brand-500 focus-visible:ring-offset-2

INPUT RULES
  All: h-10 rounded-xl border-2 bg-white px-4 text-sm text-text
  Focus: ring-2 ring-brand-500 border-brand-500
  Label: text-xs font-semibold uppercase tracking-wider
  Error: border-error-text focus-visible:ring-red-500
  Same fill color everywhere — no per-page input variation

CHIP / CARD-SELECT RULES
  Unselected: bg-white border-border text-text-secondary hover:border-gray-300
  Selected: bg-brand-50 border-brand-200 text-brand-700 font-medium
    (or use CardSelect / RichCardSelect which handle this)
  Icon chips: use iconMap prop on ChipInput for consistent emoji per option
  Columns: dense grids (columns={3}) to reduce vertical length

SECTION COLOR MAP (all cards white — unified container system)
  All steps: white cards with border-border, rounded-2xl, p-5, shadow-sm
  Color comes from content: brand-50 selected state, brand-500 primary
  button, brand-100/200 badges and chips
  Only accent: welcome step uses brand-50 sub-card for "We'll help you build"
  Safety step keeps amber-50 inline notice (content-level, not card-level)

PAGE-BY-PAGE
  Welcome: white card, wide layout, brand-50 sub-card preview grid, StepLayout title="Welcome"
  Basic Details: white card, 2-col grids for name/age/city/gender/qualification,
    PhotoUpload at top, languages ChipInput at bottom
  Skills: white card, ChipInput with iconMap and popularTags, talent areas
    in compact columns={2}, "other skill" text input
  Hobbies: white card, ChipInput with iconMap, representation selector with
    same selected-state logic, conditional proof section as inner panel
  Travel: white card, destination ChipInput with iconMap, travel type
    CardSelect, 2-col environment+stay grid, 2-col duration+solo grid
  Availability: white card, 2-col date inputs, travel style SearchableSelect,
    2-col experience+comfort CardSelect, remote work toggle
  Safety: white card, amber-50 notice at top, 2-col emergency contacts,
    relationship select, optional details in <details> collapse, checkboxes
    with same spacing and style, FAQ
  Review: multi-card dashboard — white completeness card with Progress,
    2-col grid of white stat cards (avatar, languages, skills, hobbies,
    travel, availability), white tips card if suggestions exist,
    centered submit Button

FINAL CHECK
  Every page uses the same button, input, chip, card, badge styles.
  No page invents its own palette or spacing.
  The user never feels like pages were designed separately.
```
<!-- END:voluntree-design-system -->
