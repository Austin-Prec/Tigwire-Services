/*
  # Seed About page blocks -- Tigwire Services

  Replaces Austin Phiri Advisory's personal practitioner bio (a named
  individual's credentials, photo, and career history) with a company-voice
  About page for Tigwire, since the business plan (Executive_Summary.docx)
  names no individual founder, owner, or principal -- it describes a
  business concept, not a practitioner's career.

  Deliberate omissions and why:
  - No 'photo' block is seeded. The original had one pointing at
    /Austin-Photo.jpeg (Austin's actual photo, since deleted from public/
    along with this file's reference to it) -- there is no equivalent photo
    for Tigwire to use, and reusing Austin's photo would misrepresent who
    runs this company. About.tsx and BioBlock.tsx were both updated (see
    those files) so the page degrades gracefully to a full-width bio
    section when no photo block exists, rather than a lopsided 2/3-width
    layout. Add a photo block back here (see the original About migration
    in git history for the exact shape) once a real photo exists -- of
    Racheal, the team, or the premises.
  - The 'list' block below holds Tigwire's required equipment
    (Executive_Summary.docx, "Equipment Required") rather than personal
    certifications (Wharton, WVU, UIUC, CFE candidacy, etc.), which were
    Austin's individual credentials with no Tigwire equivalent. An
    equipment list is a genuinely sourced, verifiable substitute for
    "proof of capability" in the same list-block slot, not an invented one.
  - The bio's closing footnote about company registration is omitted
    rather than adapted, since the business plan's own Year One objectives
    include registering the business -- implying it has not happened yet.
    See 20260706035534_move_registration_to_about.sql, which is left in
    place but neutralized into a no-op for the same reason (no real
    registration number, TPIN, or UNGM number exists to seed).

  Block shapes (unchanged): header, bio, list -- see the block type
  registry in src/admin/PageEditor.tsx for the authoritative shape of each.
*/

INSERT INTO page_blocks (page, type, position, content)
VALUES ('about', 'header', 0, '{"title":"About","intro":"A Malawian-owned cleaning company built on integrity, professionalism, and reliable, affordable service."}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('about', 'bio', 2, '{"name":"Tigwire Services","title":"Professional Cleaning & Facility Services","quote":"Our vision is to become the most trusted provider of professional cleaning and facility management services in Malawi.","paragraphs":["Tigwire Services is a Malawian cleaning company offering professional cleaning and hygiene services for both residential and commercial clients across Malawi.","We exist to meet a growing need: as organisations increasingly focus on their core business, more of them are choosing to outsource cleaning to a provider they can trust to do it properly, consistently, and affordably.","Every member of our team is trained in cleaning techniques, customer service, health and safety, proper equipment use, and environmental protection, so the standard of work stays consistent no matter who is on the job.","Our work is guided by eight core values: <strong>Integrity</strong>, <strong>Professionalism</strong>, <strong>Reliability</strong>, <strong>Customer Satisfaction</strong>, <strong>Innovation</strong>, <strong>Teamwork</strong>, <strong>Accountability</strong>, and <strong>Environmental Responsibility</strong>."],"footnote":""}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('about', 'list', 3, '{"title":"Our Equipment","icon":"Award","items":["Commercial vacuum cleaners","Floor scrubbers and polishers","Mops and buckets","Microfiber cloths","Cleaning trolleys","Waste bins","Personal protective equipment","Ladders","Professional-grade chemicals and detergents"],"footnote":"We use environmentally responsible products wherever possible, balancing effective cleaning with the safety of your family, staff, and the environment."}'::jsonb);
