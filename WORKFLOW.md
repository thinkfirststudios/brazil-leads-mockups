# Working on this repo, two people at once

Alex and Jason both push to `main`. Nothing here needs pull requests: the sites
are independent folders, so conflicts only happen if we edit the same one.

## One-time setup

```bash
git clone https://github.com/thinkfirststudios/brazil-leads-mockups.git
cd brazil-leads-mockups
git config user.name  "Your Name"
git config user.email "you@thinkfirststudios.com"
```

**Clone somewhere outside OneDrive** — `C:\dev\` or `C:\Users\<you>\dev\`.
A git repo inside a synced OneDrive folder corrupts its own index and slows to a
crawl; that already happened once on Alex's machine.

## Every working session

```bash
git pull            # first thing, every time
# ... work on one site ...
git add -A
git commit -m "site-slug: what changed"
git push            # last thing, every time
```

Push after each site rather than batching a day's work. Short-lived commits are
what keep two people out of each other's way.

## Splitting the work

Claim work **by site folder**, never by file. Two people in different folders
never conflict, even on the same day.

- Say in chat which slugs you are taking before you start, e.g. "taking
  `aldo-imoveis` and `alici-imoveis`".
- Alphabetical split works well for a sweep: Alex takes A–L, Jason M–Z.
- If you must touch a shared file — `index.html` at the root, `MOCKUP-LINKS*.txt`,
  this file — say so first, then pull, edit and push straight away.

If a push is rejected because the other person pushed first:

```bash
git pull --rebase
git push
```

## What lives where

| Path | What it is |
|---|---|
| `batch-01-2026-09-10/<slug>/` | First 86 mockups |
| `batch-02-2026-09-16/<slug>/` | Batch 2 mockups |
| `<slug>/index.html` at the root | Redirect stubs from before the batch folders existed. Leave them alone: old links sent to prospects still go through them. |
| `index.html` at the root | The gallery page (batch 1 only so far) |
| `MOCKUP-LINKS*.txt` | Link lists for pasting into the CRM |

Published at `https://thinkfirststudios.github.io/brazil-leads-mockups/<path>/`,
usually within a minute of a push.

## Not in this repo

`PROMPT.md` and `LEAD-NOTES.md` are git-ignored on purpose. They hold contact
names, decision-makers and candid notes on prospects, and this repo is public.
They live in the working folder on Alex's machine. If both of us need them,
they go in a separate **private** repo, never here.

Before pushing, a quick sanity check:

```bash
git status --short          # nothing named PROMPT.md or LEAD-NOTES.md should appear
```

## House rules for the sites themselves

These are the rules the whole batch was built to. Keep them when editing.

1. **Never invent a fact.** No price, phone number, CNPJ, CRECI/CRM/CRC number,
   review score, award or founding year unless the client supplied it. Anything
   unknown stays a visible `[CONFIRM]` marker.
2. **No stock face stands in for a real named person.**
3. **No children in any photograph.**
4. **Every page carries `<meta name="robots" content="noindex">`.** These are
   pitches, not the client's live site.
5. **Portuguese first**, with a real `/en/` (and sometimes `/es/`) page and
   reciprocal hreflang — never a JavaScript text swap.
6. **WhatsApp is the primary contact.** Without a confirmed number the button
   stays unlinked and labelled `[CONFIRM]`.
7. **Every site keeps its LGPD privacy page.**
8. **Prices in BRL only.**

## Before you push a site

- Open it at phone width and desktop width; check nothing scrolls sideways.
- Check every link and anchor resolves.
- Check images load and each has meaningful `alt` text.
- Check the page still says `noindex`.

## Publishing a new mockup

1. Build it in `batch-02-2026-09-16/<slug>/`.
2. Add its URL to `MOCKUP-LINKS-batch-02.txt`.
3. Commit, push, then open the live URL once to confirm it serves.
