# What is still missing — recounted against the repo on 22 Sep 2026

Read this before building anything, so we do not build the same site twice.

**Published right now: 180 mockups.**

| Batch | Folder | Count |
|---|---|---|
| Batch 1 | `batch-01-2026-09-10/` | 86 |
| Batch 2 | `batch-02-2026-09-16/` | 93 |
| Batch 3 | `batch-03-2026-09-22/` | 1 (VIVERE, 22 Sep) |

The 86 folders at the repo root are the **same batch-1 sites** in their original
location, kept so the CRM links handed over before the split still resolve. They
are duplicates. Count batches only, or you will count batch 1 twice — that is
where "179 built but only 71 in the link file" comes from.

Batch 2 includes three built on 20 Sep that are **not** in older link lists:
`queiroz-contabilidade`, `yuca-floripa`, `dra-juliana-harmonizacao-facial`.
They are done. Do not rebuild them.

## Where every lead came from, and what happened to it

| Handed over | Leads | Built | Not built |
|---|---|---|---|
| `PASTE-THIS-84-BRAZIL-LEADS.txt`, 9 Sep | 84 named, 86 folders created | 86 | — |
| `PASTE-THIS-91-CASSIUS-BATCH-2.txt`, 16 Sep | 91 | 90 | `aurora-floripa` — brief says DO NOT BUILD YET |
| `2026-09-20-...-updated-5.csv`, 20 Sep | 3 whose contact details finally appeared | 3 | — |
| VIVERE, direct, 22 Sep | 1 | 1 | — |
| | | **180** | **1** |

The 91 slugs in the 16 Sep file were checked one by one against the folders on
disk on 22 Sep: all 91 are present. The 9 Sep file names 84 but 86 folders exist,
so batch 1 ran two leads **ahead** of its handover note, not behind it.

**Nothing from either handover is unbuilt** apart from `aurora-floripa`.

## The gap against Cassius's sheet

Sheet used: `2026-09-20-walk-in-presentation-leads-updated-5.csv`, 102 businesses
once section headers and duplicate rows are removed. 94 have a mockup.

**8 have no mockup.** Every one was skipped for the same reason: no website, no
phone and no confirmed address, so there was nothing to build a page from.

| Lead | What the sheet has | What is needed before building |
|---|---|---|
| Lumina Saúde e Bem Estar | Phone (48) 98436-0300, Instagram handle looks inactive | Confirm the business exists and the handle spelling |
| Frederico Korndorfer Neto | Instagram only, no match found anywhere | Confirm what the business does |
| Antonio Gomides | Instagram only; the one online match is an unrelated farmer in Ceará | Confirm identity and trade |
| Mateus Hulse Imóveis | Instagram only, no CRECI record found | Confirm the agency exists and its CRECI |
| Tadeu Farias Feijão | Instagram handle unverified; mind-mapping courses | Confirm handle and what is sold |
| Elisabete Coimbra (mundodasmedicinais) | Instagram blocked to checking; herbal content implied | Confirm trade and city |
| Massagem Luz | Nothing at all | Confirm it exists; the name is generic |
| Aurora Floripa | Phone (48) 99614-1187, Multi Open Shopping Sala 114A | Confirm what the business actually is |

`aurora-floripa` already has a brief on Alex's machine, and that brief opens with
**DO NOT BUILD YET**: nobody could establish what the business does. Cassius
needs to walk in and ask.

## If Cassius says 15 are missing

Recounted on 22 Sep: **there is no set of 15.** The two handover files account
for 175 leads and every one is built except `aurora-floripa`. The largest honest
number is the **8 above**, all skipped for the same reason — no website, no
phone, no confirmed address.

So a claim of 15 means one of three things, and they are worth separating before
anyone builds anything:

1. **A newer sheet.** He has rows we were never sent. Only his file can settle it.
2. **Rows we set aside on purpose** — the 8 above, plus `aurora-floripa`, is 9.
   Add a few he counts differently and you are near 15.
3. **Counting the link file instead of the repo.** `MOCKUP-LINKS.txt` was written
   for batch 1 before the split and is short of what exists. The repo is the
   source of truth, not the link files.

Reconcile before building:

1. Get his list in writing, with business names.
2. Check each name against this repo — search both batch folders, and remember
   the folder name is often longer than the sheet name
   (*Imóveis Floripa* → `imoveis-floripa-sc`, *Veritá* → `verita-campeche`,
   *inFlux English School* → `influx-floripa`, *ANNA'Z* → `annaz-floripa`,
   *Habiflex* → `batch-01-2026-09-10/habiflex-engenharia-e-negocios`).
3. Only what survives both checks is genuinely missing.

`CRM-LINKS-by-lead.csv` in Alex's Brazil Leads folder pairs every sheet row with
its mockup URL and is the quickest way to see what exists.

## Where a new mockup goes

- Folder: `batch-02-2026-09-16/<slug>/`, slug in lower case with hyphens, named
  after the business as the sheet writes it.
- Files: `index.html`, `styles.css`, `script.js`, `privacidade.html`, plus
  `en/index.html` and `en/privacidade.html`.
- Add the URL to `MOCKUP-LINKS-batch-02.txt`.
- Build rules are in `WORKFLOW.md`. The short version: never invent a price,
  phone number, CNPJ, CRECI, CRM, CRC, rating, award or founding year — leave a
  visible `[CONFIRM]` marker instead; no children in photographs; no stock face
  standing in for a real named person; `noindex` on every page; Portuguese first
  with a real `/en/` page; WhatsApp as the primary contact, unlinked until the
  number is confirmed; and an LGPD privacy page on every site.

## Claim work before starting

Say which slugs you are taking. Whoever builds, pull first and push each site as
it is finished.
