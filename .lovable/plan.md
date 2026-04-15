

## Add CRUD for Research, Publications & Collaborations

Currently all data on these three pages is hardcoded. This plan moves it to the database with full admin CRUD.

### 1. Create three database tables (migration)

**research_projects**: id, title, description, status (Ongoing/Completed/Planning), tags (text[]), icon_name, image_url, sort_order, created_at, updated_at

**publications**: id, title, journal, year, doi, abstract, topics (text[]), created_at, updated_at

**collaborations**: id, institution, country, description, focus, sort_order, created_at, updated_at

All three get RLS: public SELECT, authenticated INSERT/UPDATE/DELETE.

### 2. Seed existing hardcoded data

Insert the current hardcoded entries into each table so nothing is lost.

### 3. Create three admin editor components

- `src/pages/admin/ResearchEditor.tsx` -- list all projects in cards, add/edit/delete with a form dialog (title, description, status dropdown, tags input, image URL)
- `src/pages/admin/PublicationsEditor.tsx` -- same pattern (title, journal, year, DOI, abstract, topics)
- `src/pages/admin/CollaborationsEditor.tsx` -- same pattern (institution, country, description, focus)

Each uses `supabase` client directly with react-query mutations.

### 4. Update AdminDashboard

Add three new tabs (Research, Publications, Collaborations) alongside existing Content/SEO/Images/Security. Grid changes from 4 to 7 columns (scrollable on mobile).

### 5. Update public pages to fetch from DB

- `Research.tsx` -- fetch from `research_projects` table, remove hardcoded array
- `Publications.tsx` -- fetch from `publications` table, remove hardcoded array
- `Collaborations.tsx` -- fetch from `collaborations` table, remove hardcoded array

### 6. Also fix: AdminDashboard header icon

Replace the `FlaskConical` import with `SktLogo` component to match the navbar.

### Files changed
- 1 migration (3 tables + RLS + seed data)
- 3 new files: ResearchEditor, PublicationsEditor, CollaborationsEditor
- 4 modified: AdminDashboard, Research.tsx, Publications.tsx, Collaborations.tsx
- New hooks in useSiteContent or inline queries

