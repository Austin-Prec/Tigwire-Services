/*
  # Registration credentials -- intentionally not seeded for Tigwire

  The original version of this migration (for Austin Phiri Advisory) added
  a credentials_panel block to the About page holding real Legal
  Registration and UN & Procurement details -- legal name, registration
  number, tax ID (TPIN), and UNGM number.

  Tigwire has no equivalent real values to seed here: the business plan's
  own Year One objectives ("Register the business and obtain all
  operational licenses") state that registration has not happened yet.
  Inventing a plausible-looking registration number, TPIN, or UNGM number
  would misrepresent the business's legal status on a live site, so this
  migration is left as a deliberate no-op rather than adapted with
  placeholder data.

  This file is kept in place (rather than deleted) so the migration
  timestamp sequence isn't disturbed, and so this explanation is visible
  to whoever next works on this codebase.

  Once Tigwire is actually registered, add a credentials_panel block with
  the real details using the shape below as a template (matches the
  admin block type registry in src/admin/PageEditor.tsx):

    INSERT INTO page_blocks (page, type, position, content)
    VALUES ('about', 'credentials_panel', 4, '{"panels":[{"heading":"Legal Registration","fields":[{"label":"Legal Name","value":"<real value>"},{"label":"Registration #","value":"<real value>"}],"note":"<real value>"}]}'::jsonb);

  No INSERT statement runs from this file.
*/
