/*
  # Seed Contact page blocks -- Tigwire Services

  Ports Tigwire's confirmed contact details into page_blocks, replacing
  Austin Phiri Advisory's content. Structure and comments below describe
  what's unchanged from the original; content values are new.

  Position 1 (between header and sidebar) is deliberately left open for the
  contact form itself, which is NOT a page_blocks row -- the form has real
  client-side state, validation, and a live form-submission POST, which
  makes it functional code rather than editable content, the same
  distinction applied to the blog editor and page-block system throughout
  this project. The form renders as a fixed React component positioned
  between these two blocks in Contact.tsx.

  Deliberately excluded:
  - Legal Registration / UN & Procurement details -- see
    20260706035534_move_registration_to_about.sql, left as a documented
    no-op since Tigwire has no real registration numbers to seed yet.
  - A LinkedIn channel -- the business plan lists social media (including
    LinkedIn) as a *planned* marketing channel, but no live handle or URL
    was provided for any of them. A placeholder link would send visitors
    to a nonexistent or wrong page, so this channel is omitted rather than
    guessed at. Add it back here once a real profile URL exists, following
    the same channel-object shape as Email/Phone/Location below.

  Block shapes (unchanged):
  - header: { title, intro }
  - contact_sidebar: { heading, channels: [{ icon, label, value, link?, sub? }],
                        response_time }
*/

INSERT INTO page_blocks (page, type, position, content)
VALUES ('contact', 'header', 0, '{"title":"Let''s Talk","intro":"Whether you need a one-time deep clean or an ongoing contract for your home, office, or institution, start here for a free quotation."}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('contact', 'contact_sidebar', 2, '{"heading":"Direct Contact","channels":[{"icon":"Mail","label":"Email","value":"rachealkamaseko7@gmail.com","link":"mailto:rachealkamaseko7@gmail.com"},{"icon":"Phone","label":"Phone / WhatsApp","value":"+265 992 477 611","link":"tel:+265992477611"},{"icon":"MapPin","label":"Location","value":"Area 18B, Lilongwe","sub":"Malawi"}],"response_time":"Within two business days"}'::jsonb);