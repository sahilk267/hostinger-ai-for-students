# Organic Growth & SEO Implementation — 11 November 2026

## Goal

Make AI for Students discoverable through genuinely useful public resources and convert relevant search visitors into lesson/game users. Traffic is **not guaranteed** by adding metadata alone.

## Implemented this iteration

- Six manually authored evergreen guides with step-by-step advice, example prompts, actionable checklists and direct practice links.
- Searchable free guides hub at `/guides`; individual public paths under `/guides/:slug`.
- Homepage guide section and footer navigation; related resources linked from the 120-topic catalog.
- Route-aware canonical/OG/Twitter metadata for guide hub and article pages; Article JSON-LD for article pages.
- Server-generated article text and metadata in the initial production HTML response (progressive SEO content for crawlers that do not execute JavaScript).
- Curated `sitemap.xml` and `robots.txt`; excluded private account/progress/parent-report paths from crawl requests.
- Updated homepage title and description targeting free student learning guides and AI games.
- Replaced nonfunctional newsletter fake success state with honest direct access to free resources. No email is collected.

## Publishing / operational dependencies

1. Confirm the canonical production host is exactly `https://aiforstudents.in` and that it resolves to this app. If the primary domain uses `www`, update canonical and sitemap URLs consistently; redirect secondary host to primary.
2. Deploy this commit; this source change alone does not change the live site.
3. Open `/sitemap.xml`, `/robots.txt`, `/guides`, and every guide path on production. Check HTTP 200 and that a non-JavaScript fetch of each guide includes heading, article text, title, canonical, and JSON-LD.
4. Verify Google Search Console ownership, submit `https://aiforstudents.in/sitemap.xml`, and inspect priority guide URLs for indexing. Bing Webmaster Tools is optional.
5. Monitor Search Console *impressions, indexed pages, search queries, CTR and average ranking* weekly; monitor anonymous Umami landing pages and engaged guide-to-game clicks where consent/configuration applies.
6. Prioritize revisions to pages with search impressions and low CTR; expand only with original, relevant material that answers genuine questions. Avoid mass-producing thin topic pages.
7. Establish editorial authorship, reviewed dates and links to trustworthy sources where suitable before stronger expertise claims. Do not invent reviews, backlinks, search traffic or success metrics.

## Architecture note

The current app is Vite/React SPA. The public guide routes now emit meaningful HTML on the Node server in production before React loads. Other client-only routes still depend on JS rendering and may need a later server-rendering/prerender improvement. Ensure Hostinger serves the Node app, not merely static build assets, for these guide responses.

## Intentional exclusions

No test/build execution was performed in this feature/SEO-focused iteration as requested. No fabricated traffic numbers, ranking promises, newsletter subscriber storage, domain verification, Search Console connection, external backlink campaign or deployment were claimed.
