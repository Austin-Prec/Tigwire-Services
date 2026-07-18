/*
  # Seed How We Work page blocks — Tigwire Services

  Replaces the original Frameworks page (Austin Phiri Advisory's SIF/FRF
  proprietary methodologies, presented as two framework_section blocks with
  downloadable framework papers) with Tigwire's 7-step Service Delivery
  Process from the business plan, since a cleaning company has no direct
  equivalent to downloadable governance frameworks.

  Structural changes from the original migration this file replaces:
  - Two framework_section blocks (SIF, FRF) collapsed into one, since the
    delivery process is a single ordered sequence, not two co-equal
    methodologies.
  - pillars[].number now uses "1"-"7" instead of roman numerals "I"-"V",
    since a strictly ordered 7-step process reads more naturally as a
    numbered sequence than as parallel "pillars" -- the component itself
    (FrameworkSectionBlock.tsx / PillarCard) renders `number` as a raw
    string either way, so this is a content choice, not a code change.
  - download_label / download_url are omitted entirely rather than left
    empty: there is no downloadable "process paper" equivalent, and both
    static HTML framework-paper files this used to point to
    (/sif-framework-paper.html, /frf-framework-paper.html) have been
    deleted from public/, since they were Austin-specific content with no
    Tigwire equivalent. FrameworkSectionBlock.tsx already conditionally
    renders the download button only when both fields are present
    (`content.download_url && content.download_label`), so omitting them
    here cleanly produces no button -- no component change was needed for
    this part.
  - FrameworkSectionBlock.tsx's icon lookup was changed (see that file)
    from a governance-specific set (Shield, Search, FileCheck, TrendingUp)
    to a process-oriented set (ClipboardCheck, Sparkles, Truck,
    MessageCircle), and its lgCols grid logic was extended with an
    explicit 7-item case (4 columns, giving a 4+3 layout) since it
    previously only had explicit cases for 4 and 5 items.

  This migration keeps the page's Supabase slug as 'how-we-work' (not
  'frameworks') to match the route change in App.tsx / Navbar.tsx -- see
  those files for the corresponding rename.

  The filename timestamp is left unchanged from the original
  (20260704081159) since this is a wholesale content replacement for the
  same migration slot, not a new migration layered on top of it.
*/

INSERT INTO page_blocks (page, type, position, content)
VALUES ('how-we-work', 'header', 0, '{"title":"How We Work","intro":"A clear, consistent process from your first enquiry to the finished job, so you always know what happens next."}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('how-we-work', 'framework_section', 1, '{"icon":"ClipboardCheck","heading":"Our Service Delivery Process","subtitle":"Seven steps, every time, so nothing gets missed","body":"Whether it is a one-time deep clean or a long-term contract, every Tigwire engagement follows the same seven-step process. It keeps expectations clear on both sides, from the first phone call through to the finished job and beyond.","pillars":[{"number":"1","name":"Inquiry & Site Inspection","description":"You get in touch, and where useful, we visit your space in person to understand exactly what needs doing."},{"number":"2","name":"Quotation","description":"We prepare a clear quotation based on the size of the space, the type of cleaning required, and how often you need us."},{"number":"3","name":"Agreement Signing","description":"For contracts, we put the scope, schedule, and price in writing before any work begins."},{"number":"4","name":"Team Assignment","description":"We assign a trained cleaning team suited to the job, briefed on your specific requirements."},{"number":"5","name":"Service Delivery","description":"Our team carries out the agreed work, using the right equipment and environmentally responsible products."},{"number":"6","name":"Quality Inspection","description":"A supervisor inspects the completed work against our standards before we consider the job done."},{"number":"7","name":"Feedback & Follow-Up","description":"We check in with you afterward, and your feedback shapes how we serve you next time."}],"variant":"light"}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('how-we-work', 'cta_banner', 2, '{"body":"Ready to get started? Reach out for a free quotation and, where useful, a site inspection. No obligation.","button_label":"Get a Free Quote","button_link":"/contact"}'::jsonb);
