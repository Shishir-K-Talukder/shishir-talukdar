

## Modernize Navigation Bar

Redesign the Navbar to feel premium, trending, and cohesive with the dark microbiology theme.

### Changes to `src/components/Navbar.tsx`

**Desktop Navigation:**
- Wrap nav links in a **frosted glass pill** container (`bg-card/50 backdrop-blur-md rounded-full border border-border/50`) floating in the center — trending "floating pill" nav pattern
- Active link gets a **glowing pill indicator** behind it (`bg-primary/15 text-primary` with smooth transition)
- Hover state: subtle green text shift with underline animation
- Logo: Add a subtle green glow/pulse on the flask icon
- CTA button: Outline style with green border that fills on hover (ghost-to-solid transition)

**Mobile Navigation:**
- Replace instant show/hide with **Framer Motion slide-down + fade** animation
- Full-screen overlay with backdrop blur instead of simple dropdown
- Links staggered entrance animation
- Close button top-right with smooth rotation

**Scroll behavior:**
- Add `useEffect` to detect scroll position
- When scrolled past ~20px: shrink height from `h-16` to `h-14`, increase backdrop blur, add subtle bottom shadow with primary color tint
- Smooth CSS transition on all properties

### CSS additions in `src/index.css`
- Add a subtle nav link underline animation keyframe
- Add glass-morphism utility if not present

### Technical Details
- Use `framer-motion` `AnimatePresence` + `motion.div` for mobile menu transitions
- Use `useState` + `useEffect` with scroll listener for shrink effect
- All colors use existing CSS variables (`--primary`, `--card`, `--border`) for theme consistency
- No new dependencies needed (framer-motion already installed)

