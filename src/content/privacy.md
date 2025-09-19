---
layout: page.njk
title: Privacy
description: Privacy information for treadmill.phisch.de
permalink: /privacy/
---

# Privacy

Your privacy matters to me — this is a short story site, not an ad network.

## What I Measure

I use [Matomo](https://matomo.org/) to understand how people read *The Treadmill* — which pages are opened, how far readers scroll, and whether the PDF gets downloaded. This helps me improve the site and nothing else.

By default, Matomo runs in a **cookieless mode**:

- No persistent identifiers
- Your IP address is truncated before storage
- I respect your browser’s **Do Not Track** setting
- No cross-site tracking or advertising cookies

This gives me anonymous, aggregate numbers like “120 people read to the end this week”.

## Optional Cookies

If you click **“Yes, I’m cool”** in the consent bubble, I enable Matomo’s first-party cookies on [treadmill.phisch.de](https://treadmill.phisch.de/). This lets me:

- Estimate returning readers
- Better understand how reading patterns change over time

Rejecting keeps Matomo in cookieless mode — nothing on the site stops working.

You can change your choice at any time. Use this button to reset consent and reload the page:

<!-- Inline HTML is allowed in Eleventy Markdown; this avoids javascript: links being stripped -->
<p>
  <button id="reset-consent" type="button">Reset consent now</button>
</p>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('reset-consent');
  if (!btn) return;
  btn.addEventListener('click', function () {
    try { localStorage.removeItem('consent-choice'); } catch (e) {}
    location.reload();
  });
});
</script>

<noscript>
If JavaScript is disabled, clear this site’s data in your browser settings to reset your choice.
</noscript>

## Your Control

- To opt out entirely, enable **Do Not Track** in your browser — I honor it.
- You can also block analytics requests via a content blocker if you prefer.

## Data Retention

I keep detailed visit logs for a maximum of 6 months and aggregated statistics for 18 months. Older data is deleted automatically.

## Contact

This site is operated by me, Philippe Schrettenbrunner.  
Questions? Reach out via [phisch.de](https://phisch.de/).
