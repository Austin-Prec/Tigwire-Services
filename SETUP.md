# Setting up Tigwire Services on a new Supabase project

This project was adapted from an existing codebase (originally built for a
different business) for Tigwire Services. It includes a private writing
area for blog posts, and a page editor for the main site pages, both backed
by a Supabase project you'll set up from scratch.

Follow these steps once, **in order**. If you skip Step 0 and go straight
to Supabase, `/admin` will just show the homepage instead of a login
screen -- that's not a bug, it means the deployed code doesn't have admin
routes live yet.

## 0. Deploy this to Cloudflare Pages (or your host of choice)

This step is what makes `/admin` exist as a real page at all.

In Cloudflare Pages, connect this project (or upload it, depending on how
you normally deploy) with these settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

You'll also need to add the two environment variables from Step 1 below
inside Cloudflare Pages itself -- **Settings → Environment variables** --
not just in a local `.env` file, since Cloudflare builds the site on its
own servers and won't see a `.env` file that only exists on your computer.

Once the deploy finishes, visiting `/admin` should show a sign-in screen
(even though signing in won't work yet -- that's Steps 2 and 4 below).

## 1. Create a new Supabase project and connect to it

Create a fresh project at supabase.com specifically for Tigwire (do not
reuse an existing project from another site). You'll need two things from
**Project Settings → API**:
- Project URL
- `anon` `public` key

Copy `.env.example` to a new file named `.env` in the project root, and
paste those two values in. (This `.env` file is for building locally on
your own machine -- for the live site, you also need to add these same two
values in Cloudflare Pages, per Step 0 above.)

## 2. Run the database migrations

In **Supabase Dashboard → SQL Editor**, run every file in
`supabase/migrations/` **in this order** (the filenames start with a
timestamp so they sort correctly -- since this is a brand-new project, run
all of them, including the earliest one):

1. `20260505100415_create_contact_messages_table.sql` -- creates the table
   backing the contact form's Supabase-based submission pathway (see the
   note in Step 3 about which submission pathway is actually live)
2. `20260702194855_create_articles_table.sql` -- creates the table that
   stores blog posts
3. `20260702194856_create_article_images_bucket.sql` -- creates storage
   for post photos
4. `20260702194857_seed_existing_articles.sql` -- **intentionally seeds
   nothing.** This file exists in the migration sequence but does not
   insert any articles -- see the comment inside it for why. It's still
   safe (and necessary, for the sequence to stay intact) to run.
5. `20260703072321_create_page_blocks_table.sql` -- creates the table that
   stores editable page sections
6. `20260703072342_seed_about_page_blocks.sql` -- seeds the About page
   with Tigwire's content
7. `20260703074807_seed_home_page_blocks.sql` -- seeds the Home page
8. `20260704081159_seed_how_we_work_page_blocks.sql` -- seeds the How We
   Work page (the 7-step service delivery process)
9. `20260704111843_seed_services_page_blocks.sql` -- seeds the Services
   page (all 11 services from the business plan)
10. `20260706035534_move_registration_to_about.sql` -- **intentionally
    seeds nothing.** Tigwire has no real business registration number yet
    to display -- see the comment inside it for how to add one later.
11. `20260708051304_seed_contact_page_blocks.sql` -- seeds the Contact
    page's header and sidebar (the form itself stays fixed, since it has
    live submission logic)
12. `20260708051814_seed_what_to_expect_page.sql` -- seeds the What to
    Expect page with four prospective service scenarios

Just open each file, copy its contents, paste into the SQL Editor, and
click Run. The two "intentionally seeds nothing" files will run without
error and simply do nothing -- that's expected, not a mistake.

## 3. Deploy the edge functions

These power saving, publishing, photo uploads, and page editing. Using the
Supabase CLI:

```bash
supabase functions deploy articles-write
supabase functions deploy articles-upload
supabase functions deploy articles-list
supabase functions deploy pages-write
```

(If you'd rather not use the CLI, you can also paste each function's
`index.ts` into **Dashboard → Edge Functions → Create a new function** with
the matching name.)

**About the contact form specifically:** the main enquiry form in
`ContactForm.tsx` is now live, posting to Tigwire's own Formspree endpoint
(`xbdnonyo`). Submissions should land wherever that Formspree form is set
to deliver — check formspree.io's dashboard if you're not sure where.

A second, separate pathway also exists in this codebase but is **not**
what the live form uses: `supabase/functions/contact` is a currently-unused
edge function that would instead save messages to the `contact_messages`
table and optionally email them via Resend if you set a `RESEND_API_KEY`
secret. Nothing calls it right now. There's no reason to set this up
unless you'd specifically rather have enquiries land in a searchable
Supabase table instead of Formspree — if so, you'd need to update
`ContactForm.tsx` to call it instead, and deploy it with
`supabase functions deploy contact`.

There's also a **separate** Formspree placeholder for the newsletter
signup form on the Insights page (`REPLACE_WITH_TIGWIRE_NEWSLETTER_FORM_ID`)
that's still unconfigured — that's a different form on Formspree's side
from the contact form above, so it needs its own real endpoint pasted in
if you want that feature to work.

## 4. Create your login

In **Dashboard → Authentication → Users → Add user**, create one user with
your email and a password. That's the only account -- this is a private
writing area, not a public sign-up.

## 5. Try it

Once Steps 0-4 are all done, go to your live site's `/admin/login` (the
one on Cloudflare, e.g. `yoursite.com/admin/login`). Sign in.

For a blog post: click **New post**, try typing or pasting something in,
dragging a photo into the text. Hit **Publish**, then check `/insights` --
your post is there.

For the page editor: click **Site pages** at the top of the dashboard,
then pick a page. Try editing text, replacing a stat number, or changing a
button's destination. Hit **Save block**, then check the live page -- the
change is there.

(You can also test locally first with `npm install` then `npm run dev`,
using the `.env` file from Step 1 -- useful for trying things out before
they're live, but the real target is the Cloudflare URL above.)

---

### A couple of things worth knowing

- **Drafts stay private.** Save draft vs. Publish is a real distinction --
  a draft never appears on the public site until you publish it.
- **Clean web addresses.** Posts get a readable URL from the title, like
  `/insights/five-tips-for-a-cleaner-office`, instead of a plain number.
- **Accented letters in titles** (é, ñ, etc.) currently get dropped from
  the web address rather than converted -- the post itself displays
  correctly either way, only the URL looks a little rougher.
- **Cover images are optional.** If you skip one, the post falls back to a
  simple icon tile on the Insights page.
- **The Insights page starts genuinely empty.** No placeholder posts were
  seeded, deliberately -- see the comment in
  `20260702194857_seed_existing_articles.sql` for why. Write your first
  real post through the admin area whenever you're ready.
- **All pages are wired up**: Home, About, How We Work, Services, Contact,
  and What to Expect all use the block editor system.
- **What to Expect describes typical scenarios, not past clients.** The
  four entries are grounded in the services and process from the business
  plan, framed as "here's what to expect if you book this," since Tigwire
  is a new business with no engagement history yet to draw real examples
  from. Replace them with real, anonymized examples once you have some.
- **No business registration details are shown yet.** The About page has
  no legal registration number, TPIN, or similar -- add these once the
  business is actually registered (see
  `20260706035534_move_registration_to_about.sql` for where and how).
- **No photo on the About page yet.** There's no individual founder
  described in the business plan, and no photo was provided for the
  business itself. Add one (of Racheal, the team, or the premises) via a
  `photo` page block whenever you have one -- the page already handles
  showing or not showing a photo gracefully either way.
- **Block types are currently fixed** -- each page uses a specific set
  suited to its own content. You can freely add, remove, and reorder
  blocks of these kinds on their respective pages, but a genuinely new
  kind of block (say, a video embed) still needs to be built by a
  developer once, after which it becomes available to add anywhere like
  the others.
- **Button and link destinations** on several pages use a dropdown of real
  pages rather than free text, so a typo can never produce a broken link.
- **Bold text in the bio and pricing-notes editors:** select the words you
  want bold, then click the bold icon above that field. No need to type
  any tags.
- **No logo file exists yet.** The navbar and a couple of fallback image
  references point at `/tigwire-logo.png`, which doesn't currently exist
  in `public/`. Add a real logo file there with that exact filename (or
  update the references if you'd rather use a different filename).
- **Analytics and chatbot were removed, not carried over.** The previous
  site's Google Analytics tag and Chatbase chatbot embed both belonged to
  the business this codebase was adapted from. See the comments in
  `index.html` for how to add Tigwire's own versions of either, if wanted.
