# DESIGN.md — imdev Personal Website

## 1. Visual Theme & Atmosphere

Apple-inspired, executive-friendly personal website for an End-to-End Engineer. The design philosophy is **organized clarity** — clean surfaces, generous whitespace, and a linear reading flow that feels as comfortable to a CTO as to a developer. Light mode is the default canvas; dark mode is a first-class citizen with inverted surfaces that maintain the same spatial relationships.

**Key Characteristics:**
- Pure white / near-black surfaces with no decorative color — color is functional only
- Single accent color (Apple Blue) for interactive elements, never decorative
- Inter font family with SF-style optical sizing — large type is tight, small type breathes
- Generous vertical rhythm (80-120px between sections)
- Cards use 1px borders with subtle hover lift — no heavy shadows
- Frosted glass navigation bar (`backdrop-filter: blur(20px)`)
- Pill-shaped primary buttons, ghost secondary buttons
- Responsive and touch-friendly at every breakpoint
- Full RTL support for Arabic via logical CSS properties

## 2. Color Palette & Roles

### Light Mode

| Token              | Hex       | Role                                    |
|--------------------|-----------|----------------------------------------|
| `--bg-primary`     | `#FFFFFF` | Page background                         |
| `--bg-secondary`   | `#F5F5F7` | Card backgrounds, alternating sections  |
| `--bg-tertiary`    | `#E8E8ED` | Hover states, input backgrounds         |
| `--text-primary`   | `#1D1D1F` | Headings, body text                     |
| `--text-secondary` | `#6E6E73` | Captions, metadata, descriptions        |
| `--text-tertiary`  | `#86868B` | Placeholders, disabled text             |
| `--accent`         | `#0071E3` | Links, primary buttons, active states   |
| `--accent-hover`   | `#0077ED` | Accent hover state                      |
| `--border`         | `#D2D2D7` | Card borders, dividers, separators      |
| `--border-light`   | `#E5E5EA` | Subtle dividers within cards            |
| `--success`        | `#34C759` | Published status, success states        |
| `--warning`        | `#FF9F0A` | Draft status, warning states            |
| `--error`          | `#FF3B30` | Error states, destructive actions       |

### Dark Mode

| Token              | Hex       | Role                                    |
|--------------------|-----------|----------------------------------------|
| `--bg-primary`     | `#000000` | Page background                         |
| `--bg-secondary`   | `#1C1C1E` | Card backgrounds, alternating sections  |
| `--bg-tertiary`    | `#2C2C2E` | Hover states, input backgrounds         |
| `--text-primary`   | `#F5F5F7` | Headings, body text                     |
| `--text-secondary` | `#A1A1A6` | Captions, metadata, descriptions        |
| `--text-tertiary`  | `#636366` | Placeholders, disabled text             |
| `--accent`         | `#2997FF` | Links, primary buttons, active states   |
| `--accent-hover`   | `#409CFF` | Accent hover state                      |
| `--border`         | `#38383A` | Card borders, dividers, separators      |
| `--border-light`   | `#2C2C2E` | Subtle dividers within cards            |
| `--success`        | `#30D158` | Published status, success states        |
| `--warning`        | `#FFD60A` | Draft status, warning states            |
| `--error`          | `#FF453A` | Error states, destructive actions       |

### Surface Overlay
- **Nav backdrop:** `rgba(255,255,255,0.72)` light / `rgba(0,0,0,0.72)` dark + `backdrop-filter: saturate(180%) blur(20px)`
- **Modal overlay:** `rgba(0,0,0,0.4)` light / `rgba(0,0,0,0.6)` dark

## 3. Typography Rules

### Font Families
- **Sans:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Mono:** `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
- **Arabic:** `"Noto Sans Arabic", Inter, -apple-system, sans-serif`

### Hierarchy

| Role             | Size   | Weight | Line Height | Letter Spacing | Notes                    |
|------------------|--------|--------|-------------|----------------|--------------------------|
| Display          | 56px   | 700    | 1.07        | -0.015em       | Hero headline only       |
| H1               | 48px   | 700    | 1.08        | -0.015em       | Page titles              |
| H2               | 36px   | 600    | 1.11        | -0.01em        | Section headings         |
| H3               | 28px   | 600    | 1.14        | -0.01em        | Sub-section headings     |
| H4               | 22px   | 600    | 1.18        | -0.005em       | Card titles              |
| Body Large       | 21px   | 400    | 1.52        | normal         | Introductions, lead text |
| Body             | 17px   | 400    | 1.65        | normal         | Standard reading text    |
| Body Small       | 15px   | 400    | 1.47        | normal         | UI text, descriptions    |
| Caption          | 13px   | 400    | 1.38        | normal         | Metadata, dates, tags    |
| Caption Strong   | 13px   | 600    | 1.38        | normal         | Labels, emphasized meta  |
| Code             | 15px   | 400    | 1.60        | normal         | Code blocks, inline code |
| Button           | 17px   | 500    | 1.18        | normal         | Button labels            |
| Button Small     | 15px   | 500    | 1.20        | normal         | Compact button labels    |
| Nav Link         | 15px   | 500    | 1.33        | normal         | Navigation items         |

### Principles
- Headings use tight tracking (-0.015em to -0.005em) for compressed, confident feel
- Body text uses normal tracking with 1.65 line-height for comfortable reading
- Weight range is narrow: 400 (read), 500 (interact), 600 (sub-heads), 700 (headlines)
- Arabic text uses the same size scale but Noto Sans Arabic with adjusted letter-spacing
- Monospace only for code blocks and technical identifiers, never for UI labels

## 4. Component Stylings

### Buttons

**Primary (Filled)**
- Background: `var(--accent)`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Radius: `980px` (pill)
- Font: 17px weight 500
- Hover: `var(--accent-hover)`, scale(1.02)
- Active: scale(0.98), opacity 0.9
- Transition: `all 200ms ease`

**Secondary (Ghost)**
- Background: transparent
- Text: `var(--accent)`
- Border: `1.5px solid var(--accent)`
- Padding: `12px 24px`
- Radius: `980px` (pill)
- Hover: `var(--accent)` bg at 10% opacity

**Tertiary (Text)**
- Background: none
- Text: `var(--accent)`
- Padding: `8px 0`
- Hover: underline
- Use: inline links, "View all" actions

**Destructive**
- Background: `var(--error)`
- Text: `#FFFFFF`
- Same pill shape
- Use: delete actions in admin

### Cards

**Standard Card**
- Background: `var(--bg-secondary)`
- Border: `1px solid var(--border)`
- Radius: `16px`
- Padding: `24px`
- Hover: `translateY(-2px)`, border color darkens slightly
- Transition: `transform 300ms ease, border-color 300ms ease`
- No box-shadow (flat Apple aesthetic)

**Interactive Card (clickable)**
- Same as standard + cursor pointer
- Hover: `translateY(-2px)` + `var(--accent)` border-color
- Focus: `2px solid var(--accent)` outline with 2px offset

### Inputs & Forms

**Text Input**
- Background: `var(--bg-primary)`
- Border: `1px solid var(--border)`
- Radius: `12px`
- Padding: `12px 16px`
- Font: 17px weight 400
- Focus: border `var(--accent)`, ring `0 0 0 3px rgba(0,113,227,0.15)`
- Placeholder: `var(--text-tertiary)`

**Select / Dropdown**
- Same base as text input
- Chevron icon right-aligned
- Dropdown: `var(--bg-primary)` surface, `var(--border)` border, 12px radius, slight shadow

**Toggle / Switch**
- Width: 51px, Height: 31px (Apple size)
- Off: `var(--bg-tertiary)` track
- On: `var(--accent)` track
- Knob: white circle, 27px
- Transition: `background 200ms ease`

### Tags / Badges

**Tag**
- Background: `var(--bg-tertiary)`
- Text: `var(--text-secondary)`
- Padding: `4px 12px`
- Radius: `980px` (pill)
- Font: 13px weight 500

**Status Badge**
- Published: `var(--success)` bg at 15% opacity, `var(--success)` text
- Draft: `var(--warning)` bg at 15% opacity, `var(--warning)` text
- Radius: `980px`, padding `4px 10px`, font 12px weight 600

### Navigation

**Top Bar**
- Position: fixed, z-index 50
- Height: `64px`
- Background: nav backdrop (frosted glass)
- Border-bottom: `1px solid var(--border)`
- Content: logo left, nav links center, theme toggle + locale switch right
- Mobile: hamburger menu with slide-down panel

**Nav Links**
- Font: 15px weight 500
- Color: `var(--text-secondary)`, active: `var(--text-primary)`
- Hover: `var(--text-primary)`
- Active indicator: 2px bottom border in `var(--accent)`

### Footer
- Background: `var(--bg-secondary)`
- Padding: `64px 0 32px`
- Content: social links, quick nav, copyright
- Border-top: `1px solid var(--border)`
- Minimal, single section on mobile

## 5. Layout Principles

### Spacing Scale (8px base)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120`

### Grid & Container
- Max content width: `1120px`
- Side padding: `24px` mobile, `32px` tablet, `auto` desktop (centered)
- Section gap: `80px` desktop, `48px` mobile
- Card grid: 1 col mobile, 2 col tablet, 3 col desktop
- Gap between grid items: `24px`

### Whitespace Philosophy
- Sections breathe with 80-120px vertical padding on desktop
- Cards have internal padding of 24px, never cramped
- Text blocks max-width `720px` for readable line lengths
- Hero section gets the most space — 120px top padding minimum

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, `var(--bg-primary)` | Page background |
| Surface (1) | `var(--bg-secondary)` + 1px border | Cards, sections |
| Raised (2) | `0 2px 8px rgba(0,0,0,0.04)` + 1px border | Dropdowns, popovers |
| Modal (3) | `0 8px 32px rgba(0,0,0,0.12)` | Dialogs, modals |
| Nav (special) | Frosted glass + bottom border | Fixed navigation |

Shadow philosophy: Minimal. Depth comes from surface color differentiation and borders, not shadows. Only floating elements (dropdowns, modals) use shadows. Cards are flat with borders.

## 7. Do's and Don'ts

### Do
- Use `var(--bg-secondary)` to create surface hierarchy instead of shadows
- Use pill-shaped buttons (980px radius) for primary actions
- Keep body text max-width at 720px for reading comfort
- Use the accent color only for interactive elements (links, buttons, active states)
- Apply `backdrop-filter: blur(20px)` on the nav bar
- Use logical CSS properties (`margin-inline-start`) for RTL support
- Maintain 80px+ section spacing on desktop
- Use 16px card border-radius consistently
- Add subtle hover animations (translateY, border color change) on interactive cards

### Don't
- Don't use colored backgrounds for sections — only `--bg-primary` and `--bg-secondary`
- Don't apply shadows to cards — use borders and surface colors
- Don't use more than 4 font weights (400, 500, 600, 700)
- Don't add decorative elements, gradients, or illustrations
- Don't use star ratings or progress bars for skills — use years of experience
- Don't make the nav bar opaque — always frosted glass
- Don't use letter-spacing above 0 on headings
- Don't put borders on images — let them breathe

## 8. Responsive Behavior

### Breakpoints
| Name    | Width      | Key Changes                               |
|---------|-----------|------------------------------------------|
| Mobile  | < 640px   | Single column, stacked, 24px side padding |
| Tablet  | 640-1024px| 2-column grids, 32px side padding         |
| Desktop | > 1024px  | 3-column grids, 1120px max, centered      |

### Touch Targets
- Minimum tap target: 44px height
- Buttons: min-height 44px on mobile, 48px on desktop
- Nav links: 44px touch area with adequate spacing
- Cards: full-surface tap target when clickable

### Collapsing Strategy
- Hero: Display 56px → 36px on mobile
- Section spacing: 80px → 48px
- Card grids: 3-col → 2-col → 1-col
- Navigation: horizontal → hamburger with slide panel
- Footer: multi-column → stacked
- Admin sidebar: persistent → collapsible drawer on mobile

## 9. Admin Panel Design

The admin panel follows the same design tokens but with a sidebar layout:
- Left sidebar: 260px wide, `var(--bg-secondary)` background, collapsible on mobile
- Content area: fluid with 32px padding
- Data tables: clean, no zebra striping, hover row highlight
- Forms: generous spacing, clear labels above inputs, EN/AR fields side by side
- The admin uses the same Button, Card, Input components as the public site
- Toast notifications via sonner, positioned top-right

## 10. Agent Prompt Guide

### Quick Color Reference
- Page background: `#FFFFFF` / `#000000`
- Card surface: `#F5F5F7` / `#1C1C1E`
- Primary text: `#1D1D1F` / `#F5F5F7`
- Secondary text: `#6E6E73` / `#A1A1A6`
- Accent/links: `#0071E3` / `#2997FF`
- Borders: `#D2D2D7` / `#38383A`

### Building Components
- "Create a card: `--bg-secondary` background, 1px `--border` border, 16px radius, 24px padding. Title at 22px Inter weight 600, body at 17px weight 400 `--text-secondary`. Hover: translateY(-2px) over 300ms ease."
- "Create a pill button: `--accent` background, white text, 980px radius, 12px 24px padding, 17px weight 500. Hover: scale(1.02), Active: scale(0.98)."
- "Create a nav bar: fixed top, 64px height, frosted glass backdrop, 1px bottom border. Logo left, links center (15px weight 500), theme toggle right."
- "Create a form input: `--bg-primary` background, 1px `--border` border, 12px radius, 12px 16px padding. Focus: accent border + 3px accent ring at 15% opacity."
