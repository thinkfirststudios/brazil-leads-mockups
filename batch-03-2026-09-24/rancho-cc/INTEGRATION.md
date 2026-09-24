# Rancho — putting this mockup on a real platform

Written for whoever builds this, and for the conversation with Rancho about
what it costs. Checked against the code in this folder on 24 Sep 2026.

**Short version:** it runs on Shopify or on Nuvemshop, but they are different
jobs with different price tags, and the difference is not the design — it is
where the product data lives and who is allowed to ask for it.

---

## What this mockup is, and what it is not

It is a working shop front: search, category rail, dietary filters, a product
sheet, a cart drawer that names the delivery route per line, and a CEP checker
that answers local-versus-national.

It is **not** a store. There is no payment, no account, no order, no stock. The
catalogue is 23 invented products in one array, labelled illustrative on the
page. Product images are generated tiles, not photographs.

One thing to be clear about before anything else:

> **The local/national split is presentational.** The badge on the card and the
> line in the cart are user interface. On a real store the rule has to be
> enforced in shipping configuration, server side. If it is not, someone in São
> Paulo puts frozen marmitas in a basket and pays for them.

That is the single most important item in the build, on either platform, and it
is a shipping-zone problem rather than a front-end one.

---

## The seam

The catalogue is referenced directly in four places. Everything else goes
through `byId()`. Swapping the data source means rewriting roughly thirty
lines; the rendering, filtering, cart and modal stay as they are.

| `script.js` | What it is | Changes on integration |
|---|---|---|
| `CATEGORIES` (line 21) | 9 categories | Becomes collections |
| `PRODUCTS` (line 52) | 23 items | Becomes a fetch |
| `byId()` (line 207) | id → product | Reads the fetched list |
| `money()` (line 133) | cents → `R$ 24,90` | Input becomes a decimal string |
| `tile()` (line 136) | generated placeholder | Becomes the real image URL |
| `CEP_LOCAL_PREFIX` (line 131) | prefix guess | Becomes a real delivery-zone lookup |
| `render()`, `drawCart()`, `addToCart()` | rendering and cart | **No change** |

Product shape today:

```js
{ id, title, cat, price /* cents */, unit, img, entrega /* 'local' | 'nacional' */, tags, desc }
```

`entrega` is the field that does not exist natively on either platform. It
becomes a tag or a metafield, and the shipping rules key off it.

---

## Path A — Shopify

The architecture in the brief. Shopify's Storefront API is built for exactly
this: a public token that is safe in the browser, CORS allowed, and a Cart API
that returns a `checkoutUrl` to redirect to. Checkout stays Shopify-branded, as
the brief wants.

**Maps cleanly:** title, description, tags, collections, images, variants.

**Needs work:**

- Prices come back as decimal strings (`"21.90"`), not cents. One line.
- `entrega` becomes a tag or metafield, plus **shipping profiles and delivery
  zones** that actually stop perishables leaving the local area. Shopify has
  native local delivery by radius or postcode; that is the right tool.
- Search moves to the platform's endpoint with pagination once the catalogue
  outgrows a couple of dozen items.

**Two Brazil gaps that are easy to miss and belong in the quote:**

1. **Shopify Payments is not available in Brazil.** Pix, boleto and
   parcelamento need a third-party gateway — PagBrasil, PagSeguro or Mercado
   Pago. Pix is around a third of Brazilian online transactions and
   parcelamento close to another third, so this is not optional.
2. **CPF is not collected by Shopify checkout natively**, and it is needed for
   Nota Fiscal. Handled by the gateway app or a checkout extension.

---

## Path B — Nuvemshop

Brazilian-native, and it removes both gaps above: Pix, boleto, parcelamento,
CPF, Correios and CEP freight all work out of the box.

The catch is the API. Nuvemshop's is a **store-scoped OAuth REST API with a
non-expiring access token** — an admin credential, meant for server-side use.
There is no browser-safe public storefront token equivalent to Shopify's.
Putting that token in client-side JavaScript would expose the whole store,
including orders and customers.

So headless on Nuvemshop means one of two things:

1. **A small backend proxy** that holds the token and serves the catalogue to
   this front end. A real component: build, host, monitor, secure. It is not
   difficult, but it is a line item and it never goes away.
2. **Rebuild the design as a Nuvemshop theme**, using their template system,
   with the Script resource and NubeSDK browser APIs for the interactive parts.
   This is the normal path. The HTML here becomes a reference design rather
   than the shipped code — the design survives, the code largely does not.

---

## Choosing

**Shopify** if the custom front end is the point. The brief's architecture, the
code in this folder drops in behind an adapter, and the Brazilian payment gaps
are solved with a gateway app.

**Nuvemshop** if the priority is Brazilian payments and freight working on day
one with less to maintain, accepting that the front end is rebuilt as a theme.

Both are defensible. What is not defensible is promising a headless Nuvemshop
build without pricing the proxy, or promising Shopify without pricing the
payment gateway and CPF handling.

---

## Open questions that change the build

These are the `[CONFIRM]` markers from the mockup that have a cost attached:

- Does Rancho stock **frozen** goods at all? The mockup proposes the category;
  their site does not list one. It drives the whole local-delivery split.
- Which **neighbourhoods and CEP ranges** are served today, and at what fee?
- Is **national shipping** new, or already happening? Their site describes local
  delivery only.
- Which **payment methods** do they use now, and through whom?
- Does **(48) 3365-3564 take WhatsApp?** Every CTA in the mockup assumes it does.
- Is **English** in scope, or is the English page just a placeholder for it?
- How does the **monthly collective buy** interact with a permanently open
  store? Today the cycle is the business model; an always-on catalogue changes
  it, and that is a conversation with the owner, not a build decision.

---

## Sources

- Nuvemshop API authentication and store-scoped tokens —
  <https://tiendanube.github.io/api-documentation/authentication>
- Nuvemshop browser APIs and storefront scripts —
  <https://dev.nuvemshop.com.br/en/docs/applications/nube-sdk/browser-apis>
- Shopify Payments availability in Brazil —
  <https://rockty.com/blog/shopify-payments-brasil-por-que-nao-esta-disponivel-e-o-que-usar>
- Pix and installments on Shopify via gateway —
  <https://www.pagbrasil.com/integration/shopify-plugin/>
- Selling on Shopify in Brazil, CPF and Nota Fiscal —
  <https://easyappsecom.com/guides/selling-on-shopify-brazil-2026>
