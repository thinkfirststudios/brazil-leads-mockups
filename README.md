# Brazil Leads — spec mockups

Static, self-contained website mockups for **84 prospect businesses in Florianópolis, Santa
Catarina, Brazil**. Each one is built from that prospect's own public information — their live
site where they have one, their Instagram where they don't — and is designed to be the artefact
you put on the table in the first meeting.

**40 of 84 are built.** Open [`index.html`](index.html) in a browser for a filterable contact
sheet of everything finished, with direct links into every language tree and sub-section.

---

## ⚠️ What this is, and what it is not

**Speculative work. None of these businesses commissioned it. None has signed. None has seen or
approved any of it.**

The builds carry **real trading names, real phone numbers and real addresses**, taken from each
business's own public sources — their live website where they have one, their Instagram where they
don't. They are pitch artefacts, and must not be read as a representation of the businesses they
depict, or mistaken for those businesses' actual websites.

Two safeguards are in place because this repository is public:

- **Every page carries `<meta name="robots" content="noindex,nofollow">`.** These mockups must never
  be indexed, and must never compete in search with the real business they depict. (A `robots.txt`
  would not work here — this is a *project* Pages site on a subpath, and crawlers only honour
  `robots.txt` at a domain root.)
- **The build briefs and lead research are not published.** `PROMPT.md` and `LEAD-NOTES.md` hold
  decision-maker names, contact details and candid critiques of each prospect's current site. They
  are git-ignored and stay on local disk.

If a single mockup goes in front of the prospect it belongs to, send that one build — and say
plainly that it is an unsolicited concept containing unverified placeholders.

---

## How to view a build

Every mockup is plain HTML, CSS and JS. No build step, no framework, no package manager.

```bash
git clone <repo-url>
cd "Brazil Leads"
# then just open index.html in a browser
```

Photography is hot-linked from Unsplash, so viewing needs a network connection. Everything else
works from the filesystem.

If you prefer a local server (some browsers are fussy about `file://` for certain features):

```bash
python -m http.server 8000
# then http://localhost:8000
```

---

## What is in a folder

```
<prospect-slug>/
├── index.html         the pt-BR build
├── styles.css
├── script.js
├── privacidade.html   LGPD privacy policy (pt-BR)
├── en/
│   ├── index.html     the English build — a real translated page, never a JS text swap
│   └── privacy.html
└── es/  fr/  …        further language trees where the brief called for them
```

Some builds carry extra indexable sections in their own directories — `grao-mestre/buffet/`,
`grao-mestre/emporio/`, and similar — because those are separate search intents that deserve
separate pages.

---

## Conventions that hold across all 40

These are not stylistic preferences. They are the rules that make a spec mockup safe to show to
the business it depicts.

**Nothing is invented.** No price, room rate, menu item, licence number, CNPJ, CADASTUR / CRECI /
CREA / OAB registration, review score, award, founding year or years-in-business appears unless
the prospect published it themselves. Where a fact is missing, the page renders a visible
`[CONFIRM]` marker rather than a plausible guess. There are currently **11,726 open `[CONFIRM]`
markers** across the 40 builds — that is the size of the question list, and it is meant to be
visible.

**Count-up animations refuse to animate a `[CONFIRM]`.** Every stat counter checks `isNaN` and
leaves the placeholder alone, so no unverified figure ever counts up to a number nobody confirmed.

**Contradictions are surfaced, not quietly fixed.** Several prospects' live sites disagree with
themselves — a room described with two different views on two pages, a page that says four suites
and lists five, a price quoted at two figures. Those are shown on the mockup as flagged
discrepancies, because raising them is the point.

**No children in any stock photograph** — not in heroes, galleries, testimonials or backgrounds,
including for businesses that serve families or teach children. Facilities, equipment, food,
interiors, landscape and adult staff instead.

**No stock face stands in for a real named person.** Where a build has a founder or broker
portrait, the frame holds a labelled non-facial placeholder. A stranger's face under a real
person's name survives a screenshot in a way a caption does not.

**WhatsApp buttons render but stay disabled** where no number could be verified — around a quarter
of these leads publish no dialable number anywhere. The button explains why when pressed. A
fabricated number can be dialled, which is worse than no number.

**Brazilian market conventions throughout.** BRL only, never converted to USD or EUR, even on the
English and Spanish trees. `R$ 00,00` with a comma decimal. `DD/MM` dates. Pix surfaced wherever
payment appears. WhatsApp as the primary contact and booking channel.

**Compliance is built in, not bolted on.** LGPD cookie consent with non-essential off by default
and *reject* exactly as prominent as *accept*; a privacy policy on every build; ANVISA RDC 26/2015
allergen declarations on food businesses; CDC price-display rules; CADASTUR for lodging and
travel; CRECI for real estate; and no third-party logo reproduced without written permission.

**Accessibility.** WCAG 2.1/2.2 AA. Every text/background pair in every stylesheet has its
contrast ratio computed and recorded in a comment, including the ones that **fail** and the
darkened value used instead. State is never conveyed by colour alone. `prefers-reduced-motion` is
honoured throughout.

**Progressive enhancement.** Multi-step forms, accordions and menu modules ship fully expanded in
the HTML and are collapsed by JS — so with scripting off the content is still readable, printable
and indexable.

---

## Status

| | |
|---|---|
| Built | 40 |
| Remaining | 44 |
| HTML pages | 247 |
| Open `[CONFIRM]` markers | 11,726 |

Every completed folder passes a validator checking for unfilled `[IMAGE: …]` slots, `<img>` without
`alt`, dead local links, JS syntax errors, and HTTP-verified stock photo URLs. All 40 are at zero
problems.

Work continues alphabetically. `index.html` regenerates as builds land.
