

## Shishir Kumar Talukder — Academic Research Portfolio

A dark-mode, bento-grid portfolio inspired by Bentolio, tailored for microbial science research. Multi-page with a high-density landing page and detailed inner pages.

---

### Pages & Navigation

**Top Navigation Bar** with logo/name, nav links (Home, Research, Publications, Collaborations, About, Contact), and a "Request Collaboration" CTA button.

---

### 1. Home Page — Bento Grid Layout

**Hero Cell (large, spanning 2 columns):**
- Headline: "Advancing the Future of Microbial Science"
- Tagline: "Pioneering research and innovative solutions in microbial science for a healthier tomorrow."
- Profile photo placeholder
- Two CTAs: "Request Collaboration" + "View Research"

**Stats Strip (4 cells in a row):**
- 09+ Research Projects
- 94.8% Success Rate
- 03+ Global Partners
- 2+ Years Research

**About Cell:**
- "Welcome to My Lab" heading
- Bio summary text
- Link to full About page

**Featured Research Cells (2 cards):**
- "Novel Antibiotic Resistance Mechanisms" with description + Learn More →
- "Microbial Ecology Dynamics" with description + Learn More →

**Expertise Cell:**
- Three tags/areas: Antimicrobial Resistance, Bacterial Pathogenesis, Microbial Ecology

**Quick Links Cell:**
- Publications count, Collaborations count with links to respective pages

All cells feature the dark theme with Petri-Green accents, subtle hover animations (lift + green border glow), and staggered entrance animations.

---

### 2. Research Page
- Grid of research project cards with placeholder images
- Each card: title, description, status badge, methodology tags
- Expandable detail view or modal for each project

### 3. Publications Page
- Searchable/filterable list of publications
- Each entry: title, journal, year, DOI (monospace), abstract preview
- Filter by year or topic

### 4. Collaborations Page
- Grid of partner institution cards with logo placeholders
- Brief description of each collaboration
- Links to institutional pages

### 5. About Page
- Full bio with profile photo placeholder
- Education & credentials timeline
- Research philosophy section
- Core expertise breakdown

### 6. Contact Page
- "Request Collaboration" form (name, email, institution, message)
- Client-side validation with Zod
- Display email and institutional affiliation alongside form
- Success toast on submission (form data stored locally or shown as confirmation — no backend initially)

---

### Design System
- **Dark mode** with deep charcoal navy background, Petri-Green (#4ade80-ish OKLCH) primary, Pathogen-Cyan accent
- **Fonts:** Geist Sans for headings, IBM Plex Sans for body, JetBrains Mono for stats/DOIs (loaded via Google Fonts/CDN)
- **Bento cells:** 24px rounded corners, subtle border, hover lift with green inner glow
- **Animations:** Framer Motion staggered scale-in entrance, spring hover effects
- **Responsive:** Bento grid collapses to single column on mobile

