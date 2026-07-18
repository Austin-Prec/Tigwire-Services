/*
  # Seed What to Expect page blocks -- Tigwire Services

  Replaces Austin Phiri Advisory's Case Studies page (three anonymized
  composite engagement summaries, framed retrospectively as "Challenge /
  Approach / Outcome") with a "What to Expect" page for Tigwire, framed
  prospectively instead.

  Why prospective rather than retrospective: Austin's composites were
  grounded in his own real, documented practitioner history even without a
  specific verified client record to cite. Tigwire has no operating history
  at all -- the business plan's own Year One objective is to secure its
  *first* 30 clients. A "case study" implies "this happened"; presenting
  composite scenarios that way for a pre-launch company would misrepresent
  a target market description as a track record, however clearly
  disclaimed. Describing typical scenarios as things a visitor can expect
  when they book, rather than things that have already happened, avoids
  that regardless of disclaimer wording.

  Structural changes from the original migration this file replaces:
  - Page slug changed from 'case-studies' to 'what-to-expect' (see the
    matching route change in App.tsx / Navbar.tsx).
  - CaseStudyGridBlock.tsx's fields were renamed challenge->situation and
    outcome->expect, and its hardcoded section labels changed from
    "Challenge / Approach / Outcome" to "Situation / Our Approach / What to
    Expect" (see that file and its admin editor counterpart,
    CaseStudyGridBlockEditor.tsx, for the full rename).
  - CaseStudyGridBlock.tsx's icon lookup changed from a governance set
    (Shield, Search, TrendingUp, FileCheck) to a cleaning-relevant set
    (Home, Building2, Droplets, HardHat).
  - The four scenarios below are grounded directly in services and the
    7-step process described in Executive_Summary.docx (residential,
    office, disinfection, post-construction), not invented client
    narratives -- no named client, company, or specific outcome figure
    appears anywhere in this content, in keeping with that.

  Block shape (field names updated, same overall structure):
  - case_study_grid: { intro_note, studies: [{ category, icon, situation,
                        approach, expect }] }
*/

INSERT INTO page_blocks (page, type, position, content)
VALUES ('what-to-expect', 'header', 0, '{"title":"What to Expect","intro":"A look at how Tigwire approaches a few common situations, so you know what booking with us actually looks like."}'::jsonb);

INSERT INTO page_blocks (page, type, position, content)
VALUES ('what-to-expect', 'case_study_grid', 1, '{"intro_note":"Tigwire Services is a newly established company. The scenarios below describe how we approach common situations based on our planned service offering and delivery process, not specific past engagements.","studies":[{"category":"Residential Cleaning","icon":"Home","situation":"A household wants regular help keeping a home clean, but is unsure how often they actually need a visit or what a fair price looks like for their space.","approach":"We start with a short conversation about the home and, where useful, a site visit, then prepare a clear quotation based on the size of the space and how often you would like us to come.","expect":"A consistent, trained team on a schedule that suits your household, with pricing agreed upfront and no surprises."},{"category":"Office Cleaning","icon":"Building2","situation":"A small office wants a dependable cleaning contract covering desks, common areas, and washrooms, without having to manage the details themselves.","approach":"We assess the premises, agree a contract (daily, weekly, or monthly), and assign a team briefed on your specific space and any access or timing requirements.","expect":"A consistently presentable workplace, with a supervisor quality check after each visit and a simple way to give feedback."},{"category":"Disinfection & Hygiene","icon":"Droplets","situation":"A school, hotel, or bank needs a thorough disinfection service, either as a one-time job or on a recurring basis, and wants confidence that it is done properly.","approach":"We scope the areas that need attention, use products chosen to be effective and safe for staff and visitors, and carry out the work on an agreed schedule.","expect":"A genuinely sanitised space, not just a visibly clean one, backed by our quality inspection step before we consider the job complete."},{"category":"Post-Construction Cleaning","icon":"HardHat","situation":"A building or renovation project has just finished, and the space is covered in dust and debris that needs clearing before it can be used or handed over.","approach":"We inspect the site, quote based on its size and condition, and bring the right equipment for a genuine post-construction deep clean rather than a standard visit.","expect":"A space that is actually ready for use or handover, not just tidied on the surface."}]}'::jsonb);
