/*
  # Seed Home page blocks — Tigwire Services

  Ports Tigwire's business concept (from Executive_Summary.docx) into
  page_blocks rows, reusing Austin Phiri Advisory's four Home block types
  (hero, value_cards, stat_bar, link_preview) with content rewritten for a
  Malawian cleaning company rather than a governance advisory practice.

  Content notes:
  - hero.floating_stats and hero.badge_text are new optional fields added to
    HeroBlock.tsx during this rebuild — the old component hardcoded three
    forensic-finance stat cards directly in JSX, which had no Tigwire
    equivalent, so the cards are now content-driven from here instead.
  - stat_bar figures below are drawn directly from the business plan's
    stated Year One *objectives* (30 clients, 90%+ satisfaction, etc.),
    framed explicitly as commitments/targets rather than achieved results,
    since Tigwire is pre-launch and has no track record yet to report.

  Block shapes (unchanged from the original Home migration):

  - hero:         { background_image_url, badge_text, headline, subheadline,
                     quote, buttons: [{ label, link, style }],
                     floating_stats: [{ icon, value, label, detail }] }
  - value_cards:  { title, subtitle, cards: [{ icon, title, description }] }
  - stat_bar:     { label, stats: [{ value, label, detail }] }
  - link_preview: { title, body, link_text, link }
*/

INSERT INTO page_blocks (page, type, position, content)
VALUES ('home', 'hero', 0, '{"background_image_url":"/landing-page-bg.jpg","badge_text":"Serving Lilongwe and beyond","headline":"Reliable, affordable cleaning for homes, offices, and institutions across Malawi.","subheadline":"Professional cleaning and facility services built on integrity, professionalism, and consistent results — every visit, every time.","quote":"“Our mission is to deliver high-quality, affordable, and environmentally responsible cleaning solutions through professionalism, innovation, and integrity.”","buttons":[{"label":"Get a Free Quote","link":"/contact","style":"primary"},{"label":"See Our Services","link":"/services","style":"secondary"}],"floating_stats":[{"icon":"Sparkles","value":"11","label":"Service types","detail":"From homes to hotels and banks"},{"icon":"Leaf","value":"Eco","label":"Friendly products","detail":"Safe for families and staff"},{"icon":"Clock","value":"24/7","label":"Emergency callouts","detail":"For urgent cleaning needs"}]}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('home', 'value_cards', 1, '{"title":"Why Choose Tigwire","subtitle":"Not just a clean space. A service you can rely on, at a price that makes sense.","cards":[{"icon":"Shield","title":"Trained & Trustworthy Staff","description":"Every team member is trained, vetted, and supervised, so you can hand over your keys with confidence."},{"icon":"Leaf","title":"Environmentally Responsible","description":"We use eco-friendly products and sustainable methods that protect your family, staff, and the environment."},{"icon":"FileCheck","title":"Free Quotes & Site Inspections","description":"No surprises. We assess your space, agree the scope, and price it fairly before any work begins."}]}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('home', 'stat_bar', 2, '{"label":"What we are building toward in Year One","stats":[{"value":"30+","label":"Long-term clients","detail":"Our Year One target across Malawi"},{"value":"90%+","label":"Customer satisfaction","detail":"The standard we hold every job to"},{"value":"11","label":"Core service types","detail":"Residential to commercial and institutional"},{"value":"8","label":"Core values","detail":"Integrity, professionalism, and more guide every job"}]}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('home', 'link_preview', 3, '{"title":"About Tigwire Services","body":"Tigwire Services is a Malawian-owned cleaning company built to become the country's most trusted provider of professional cleaning and facility management. We serve homes, offices, schools, hotels, and banks with reliable, affordable, and environmentally responsible service.","link_text":"Read our full story","link":"/about"}'::jsonb);