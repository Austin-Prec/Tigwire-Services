/*
  # Existing articles -- intentionally not ported for Tigwire

  The original version of this migration ported three of Austin Phiri
  Advisory's real, published thought-leadership articles (his own written
  analysis, under his own byline, with real publish dates) from a static
  JSON file into the new articles table.

  Those three articles are Austin's own professional writing and belong to
  Austin Phiri Advisory, not Tigwire Services -- they are not ported here.

  No placeholder or "starter" articles are seeded for Tigwire in their
  place, deliberately. Writing new posts now and backdating them to make
  the Insights page look like it has an existing publishing history would
  misrepresent a brand-new company's track record, the same reasoning
  applied elsewhere in this rebuild (see the What to Expect page and the
  About page bio, for example). The Insights page will simply show "no
  posts yet" until real posts are written through the admin writing area
  (/admin), which has already been updated for this rebuild:
  - Editor.tsx's CATEGORIES changed from governance topics (Governance,
    Forensic Finance, etc.) to cleaning-relevant ones (Cleaning Tips,
    Hygiene & Health, Company News, Sustainability).
  - Editor.tsx's ICONS, and the matching lookup tables in Insights.tsx and
    Article.tsx, changed from a governance icon set to a cleaning-relevant
    one (Sparkles, Droplets, Leaf, Building2).
  - The articles table's author column default, and the articles-write
    edge function's fallback author, both changed from "Austin Precious
    Phiri" to "Tigwire Services" (see
    20260702194855_create_articles_table.sql and
    supabase/functions/articles-write/index.ts).

  No INSERT statement runs from this file.
*/
