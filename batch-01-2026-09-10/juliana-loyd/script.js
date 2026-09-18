/* ==========================================================================
   JULIANA LOYD — one engine, EN at / and pt-BR at /pt/
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed. Greenfield: no website exists and Instagram
   is behind a login wall, so NOTHING about this business was recoverable.

   ⚠ SOLO TEACHER, NOT A SCHOOL. Everything on this site is first person. There
   is no course catalogue in this file, no teacher roster, no level matrix and
   no student counter — because a school site is a catalogue and a solo teacher
   site is a conversation with one person. The whole build has exactly one job:
   turn a visitor into a booked trial lesson.

   ⚠ THE LANGUAGE ORDER IS INVERTED FROM THE SCHOOL BUILD, DELIBERATELY.
   Her students are people who already live in or are moving to Florianópolis
   and do NOT speak Portuguese — so they find her in English. EN is the root
   tree and holds x-default. The /pt/ tree is not for students: it is for the
   REFERRAL LAYER — relocation consultants, brokers, HR at Floripa's tech
   companies, and Brazilian friends recommending her to a foreign colleague.

   ⚠ NOTHING IS INVENTED, and for a solo teacher this is existential rather
   than merely careful: her entire business is her name. No certification
   (CELTA, TESOL, TEFL, DELTA, a degree, examiner status), no student count,
   no rating, no testimonial, no years-of-experience figure and no price
   appears anywhere unless she supplies it. There are no outcome promises —
   no fluency timelines, no exam-score guarantees.
   ========================================================================== */

'use strict';

/* The root tree is ENGLISH here. Portuguese lives at /pt/. */
var IS_PT = document.documentElement.lang.toLowerCase().indexOf('pt') === 0;
function L(en, pt) { return IS_PT ? pt : en; }

/* ==========================================================================
   CONTACT — there is nothing to wire
   --------------------------------------------------------------------------
   No phone, no WhatsApp, no email was captured. Every WhatsApp control renders,
   is visibly disabled, and explains why. A wa.me link is non-negotiable on the
   final build, but the number has to come from her.
   ========================================================================== */
var WA_NUMBER = null;                                                  // [CONFIRM]
var INSTAGRAM = 'https://www.instagram.com/julianaloyditeacher/';      // the only real URL

var T = IS_PT ? {
  waMissing: 'Nenhum número de WhatsApp foi confirmado para a Juliana.\n\n' +
             'O único canal público conhecido é o Instagram: @julianaloyditeacher — e o perfil ' +
             'está atrás de um login, que é exatamente o problema que este site resolve.\n\n' +
             'Este mockup nunca publica um dado de contato que não pôde verificar.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  mock: 'Isto é um mockup — nada é enviado.',
  videoNote: 'O vídeo de apresentação é o ativo que mais converte para um professor particular — e é a única ' +
             'coisa que um site de escola ou um perfil de marketplace não consegue reproduzir.\n\n' +
             'Quando o vídeo existir, ele carrega em embed sem cookies (ou por clique), com legendas e ' +
             'transcrição completa. Nunca com áudio automático.',
  calNote: 'A agenda é um processador terceiro: ela grava cookies e transfere dados ANTES de o visitante ' +
           'ter agendado qualquer coisa.\n\nPor isso ela só carrega depois do consentimento — ou é ' +
           'substituída por um link externo. [CONFIRM qual ferramenta: Calendly, Cal.com ou outra.]'
} : {
  waMissing: 'No WhatsApp number has been confirmed for Juliana.\n\n' +
             'The only known public channel is Instagram: @julianaloyditeacher — and that profile sits ' +
             'behind a login wall, which is exactly the problem this site solves.\n\n' +
             'This mockup never publishes a contact detail it could not verify.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  mock: 'This is a mockup — nothing is sent.',
  videoNote: 'The introduction video is the highest-converting asset a private teacher has — and the one ' +
             'thing a school site or a marketplace profile cannot reproduce.\n\n' +
             'Once it exists it loads as a no-cookie embed (or click-to-load), with captions and a full ' +
             'transcript. Never with sound on autoplay.',
  calNote: 'The calendar is a third-party processor: it sets cookies and transfers data BEFORE the visitor ' +
           'has booked anything.\n\nSo it only loads after consent — or it is replaced with a link-out. ' +
           '[CONFIRM which tool: Calendly, Cal.com or another.]'
};

function wireWhatsApp() {
  var nodes = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      var msg = el.getAttribute('data-wa') ||
                L('Hi Juliana! I found your site and I would like to book a trial lesson.',
                  'Oi, Juliana! Encontrei o seu site e queria agendar uma aula experimental.');
      if (WA_NUMBER) {
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        el.setAttribute('data-unconfirmed', 'true');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', function (ev) { ev.preventDefault(); alert(T.waMissing); });
      }
    })(nodes[i]);
  }
}

/* ==========================================================================
   the intro video — click-to-load, never autoplay
   --------------------------------------------------------------------------
   If the real video ends up on YouTube or Vimeo it uses a privacy-enhanced
   no-cookie embed or a click-to-load facade, so a visitor is not tracked by a
   third party before they have interacted with anything.
   ========================================================================== */
function video() {
  var btn = document.querySelector('.video__play');
  if (!btn) return;
  btn.addEventListener('click', function () { alert(T.videoNote); });
}

/* The calendar embed is gated the same way, and for the same reason. */
function calendar() {
  var el = document.querySelector('[data-cal]');
  if (!el) return;
  el.addEventListener('click', function (ev) { ev.preventDefault(); alert(T.calNote); });
}

/* ==========================================================================
   FAQ — every panel ships open, JS collapses.
   With scripting off the whole FAQ is readable, which is also what makes it
   worth marking up as FAQPage: it is a genuine organic asset for someone who
   currently has no website at all.
   ========================================================================== */
function faq() {
  var btns = document.querySelectorAll('.acc__b');
  for (var i = 0; i < btns.length; i++) {
    (function (b, idx) {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      var open = (idx === 0);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      p.hidden = !open;
      b.addEventListener('click', function () {
        var isOpen = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        p.hidden = isOpen;
      });
    })(btns[i], i);
  }
}

/* ==========================================================================
   chrome, reveals, forms, LGPD/GDPR
   ========================================================================== */
function chrome() {
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var stick = function () { hdr.classList.toggle('is-stuck', window.scrollY > 10); };
    stick();
    window.addEventListener('scroll', stick, { passive: true });
  }
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      mnav.classList.toggle('open', !open);
    });
    var links = mnav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mnav.classList.remove('open');
      });
    }
  }
}

function reveals() {
  var els = document.querySelectorAll('[data-rv]');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var sibs = el.parentNode ? el.parentNode.children : [el];
      var idx = Array.prototype.indexOf.call(sibs, el);
      el.style.transitionDelay = Math.min(idx, 6) * 100 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* NOTE: there is deliberately NO counter function on this build.
   A school counts students. A solo teacher who counts students is quoting a
   number nobody can check, about a business that is entirely her reputation.
   No student count, no rating, no years-of-experience figure ships here. */

function forms() {
  var fs = document.querySelectorAll('form[data-mock]');
  for (var i = 0; i < fs.length; i++) {
    fs[i].addEventListener('submit', function (ev) {
      ev.preventDefault();
      var need = this.querySelectorAll('[required]');
      for (var j = 0; j < need.length; j++) {
        if (!need[j].value) { alert(T.needFields); need[j].focus(); return; }
      }
      var c = this.querySelector('[data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(T.mock);
    });
  }
}

/* ==========================================================================
   LGPD *and* GDPR
   --------------------------------------------------------------------------
   Her audience is explicitly foreign, so European and UK students are in
   scope. Non-essential is off by default, refusing is exactly as easy as
   accepting, and the calendar embed — a third-party processor — sits inside
   the consented branch rather than loading on page view.
   ========================================================================== */
var CKKEY = 'jl_consent_v1';

function consent() {
  var bar = document.querySelector('.ck');
  if (!bar) return;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(CKKEY) || 'null'); } catch (e) { saved = null; }
  function apply(pref) {
    if (pref && pref.analytics) { /* analytics tag goes HERE and only here — [CONFIRM] */ }
    if (pref && pref.embeds) {
      /* the booking calendar and any video embed load HERE and only here,
         never on page view — [CONFIRM which tools and their processing terms] */
    }
  }
  function save(pref) {
    try { localStorage.setItem(CKKEY, JSON.stringify(pref)); } catch (e) {}
    bar.classList.remove('show');
    apply(pref);
  }
  if (saved) apply(saved); else bar.classList.add('show');
  var a = document.getElementById('ckA'), m = document.getElementById('ckM');
  var btns = bar.querySelectorAll('[data-ck]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
      var k = this.getAttribute('data-ck');
      if (k === 'all')  return save({ analytics: true,  embeds: true });
      if (k === 'none') return save({ analytics: false, embeds: false });
      save({ analytics: !!(a && a.checked), embeds: !!(m && m.checked) });
    });
  }
  var reopen = document.querySelectorAll('[data-ck-open]');
  for (var j = 0; j < reopen.length; j++) {
    reopen[j].addEventListener('click', function (ev) { ev.preventDefault(); bar.classList.add('show'); });
  }
}

/* ========================================================================== */
function boot() {
  wireWhatsApp();
  chrome();
  video();
  calendar();
  faq();
  reveals();
  forms();
  consent();

  var links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (ev) {
      var t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      ev.preventDefault();
      t.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
      history.replaceState(null, '', this.getAttribute('href'));
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
