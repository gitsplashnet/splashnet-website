# Splashnet Technology — website

Static marketing site for [Splashnet Technology Limited](https://splashnetech.com/). Plain HTML/CSS/JS, no build step or CMS, so it can be hosted anywhere (Netlify, Vercel, GitHub Pages, cPanel, S3).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, services overview, security, process, sectors, client feedback |
| `services.html` | Detail for each of the six services + FAQ |
| `about.html` | Company story, why choose us, UK & Nigeria offices |
| `contact.html` | Contact details and enquiry form |
| `privacy.html` | Privacy policy (UK GDPR / NDPA 2023) |

Shared styles live in `assets/css/styles.css`, behaviour in `assets/js/main.js`.
The header and footer are repeated in each page, so edit all five when changing them.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Contact form

There's no backend yet, so the form opens the visitor's email app with a pre-filled message to `info@splashnetech.com`.
To receive submissions directly, point the form at a service such as Formspree: add `action="https://formspree.io/f/<id>" method="POST" data-native` to `<form id="contact-form">` in `contact.html`.




work in prpogress