---
name: Academic Career Nexus
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#a33e00'
  on-secondary: '#ffffff'
  secondary-container: '#fe6500'
  on-secondary-container: '#541d00'
  tertiary: '#1b1f20'
  on-tertiary: '#ffffff'
  tertiary-container: '#303436'
  on-tertiary-container: '#999c9e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7c2e00'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 260px
  section-gap: 32px
---

## Brand & Style
This design system is built for the Training & Placement Portal of NIT Arunachal Pradesh. It embodies a **Modern SaaS** aesthetic—professional, data-driven, and highly functional. The brand personality is rooted in institutional trust but expressed through a contemporary, tech-forward lens to bridge the gap between academia and the corporate world.

The visual direction combines **Minimalism** with subtle **Glassmorphism** to create a sense of depth and hierarchy. It prioritizes clarity and efficiency, ensuring that students, faculty, and recruiters can navigate complex placement data without cognitive overload. The emotional response should be one of confidence, reliability, and career-focused ambition.

## Colors
The palette is anchored by **Navy Blue (#003366)**, representing the stability and prestige of the institute. **Accent Orange (#FF6600)** is used sparingly but strategically for call-to-actions and status highlights to inject energy into the professional environment.

- **Primary:** Institutional Navy for headers, primary buttons, and navigation.
- **Secondary:** Accent Orange for high-priority actions and success-state highlights.
- **Background:** Pure White (#FFFFFF) for cards and surfaces, set against a very light cool-gray (#F1F5F9) for the global canvas to create a "layered" feel.
- **Support:** Success (Emerald), Warning (Amber), and Error (Rose) tints are derived from the same saturation levels to maintain a cohesive professional look.

## Typography
The design system utilizes **Inter** exclusively. Its high x-height and neutral character make it ideal for data-heavy dashboards and mobile readability. 

- **Headlines:** Semi-bold or Bold with slight negative letter-spacing for a modern, compact "LinkedIn-style" appearance.
- **Body:** Standardized at 14px for density in tables and 16px for general reading.
- **Labels:** Uppercase styles for section headers and badges to create clear structural distinction.

## Layout & Spacing
This design system employs a **Sidebar-driven Fluid Grid**. The navigation remains fixed on the left (or as a bottom bar on mobile), while the content area utilizes a 12-column responsive layout.

- **Desktop:** 260px Sidebar + 12-column grid with 24px margins.
- **Tablet:** 80px Collapsed Sidebar + 8-column grid with 16px margins.
- **Mobile:** Single column fluid with 16px safe-area margins.

Spacing follows an 8px rhythmic scale (8, 16, 24, 32, 48, 64) to ensure mathematical consistency across all components.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Subtle Shadows**. Instead of heavy skeuomorphism, we use layers to indicate hierarchy:

1.  **Canvas (Level 0):** Background (#F1F5F9).
2.  **Surface (Level 1):** Cards and content containers in White (#FFFFFF) with a 1px border (#E2E8F0).
3.  **Raised (Level 2):** Modals and dropdowns with a soft "ambient" shadow (0 4px 6px -1px rgb(0 0 0 / 0.1)).
4.  **Glass (Special):** The sidebar and header use a backdrop blur (12px) with a 70% opacity white fill to provide a contemporary SaaS feel.

## Shapes
In line with the 12px rounded corner requirement, the system uses a **Rounded** aesthetic.

- **Components:** Buttons, Input fields, and Cards all share the 12px (0.75rem) corner radius.
- **Large Elements:** Featured banners or dashboard sections may use `rounded-xl` (1.5rem).
- **Interactive States:** Focus states are indicated by a 2px offset ring in Primary Navy to maintain accessibility without altering the shape.

## Components

### Buttons
- **Primary:** Navy Blue background, white text, 12px rounded corners. Heavy weight text.
- **Secondary:** White background, Navy Blue 1.5px border.
- **Action:** Orange background for "Apply Now" or "Post Job" buttons.

### Cards
- White background, 12px rounded corners, 1px subtle border. 
- Use a slight lift shadow on hover to indicate interactivity.

### Data Tables
- Clean, borderless rows with subtle horizontal dividers.
- Header row in light gray (#F8FAFC) with uppercase label typography.
- Row hover state: #F1F5F9.

### Status Badges
- Small pills with 50% opacity background of the state color (e.g., Light Green for "Placed") and 100% opacity text for high contrast and readability.

### Sidebars
- Utilize the Glassmorphism effect: blur background with semi-transparent white. 
- Active links should be indicated by a Primary Navy left-border accent and a subtle color shift.

### Navigation & Search
- Search bars in the header should have a 12px radius and a subtle "inner shadow" or light gray fill to distinguish them from the pure white cards below.