# Projects page aesthetic reference

## Project index — September 29, 2026

Primary reference: [Levari Lab research](https://levarilab.com/research.html).
Additional references: [Agata Wolna](https://a-wolna.github.io/projects/) and
[Karen Sasmita](https://ksasmita.github.io/projects/).

The index groups projects under research, software, and creative, each with a
brief introduction above its placards. Category labels remain inside the cards.
Each placard pairs a visual with a title, subtitle, description,
and link to its individual page, without a caption below the preview image.
Hover and keyboard focus highlight only the title, subtitle, explore link, and
placard outline. Crisp outlined rows retain the site's serif
type, olive links, generous spacing, and light/dark themes. Figures stack above
the text on smaller screens.

Preview assets in `public/images/projects/` come from Aaron's local projects:

- `extended-language-network.png`: `extended_language_network-osf/viz/images/supplemental/ext_lang_net_brain.png`.
- `cortex.png`: `cortex/assets/cortex-social-card.png` (conceptual project artwork).
- `tidy-tuesday.png`: `coding/archive/gordon_DSC_proj2_twitter_sentiment_analysis/elon_afinn_sentiment_analysis.png` (Aaron's undergraduate Twitter sentiment project, used as the current preview).

These are local copies, so deployed previews do not depend on neighboring repositories.

## Creative index — September 30, 2026

`/creative` is the brief creative about/landing page; `/creative/projects` holds
the project index. Its four visible placards reuse
`src/components/site/project-placard.tsx`, also used by cognitive science.
Photography, Venture, and Scope for Imagination link to their existing routes.
Sand Dollar Hunting is an unlinked coming-soon card. Shared Agency and Theory of
Change are temporarily hidden. Unchosen artwork is left blank; empty image areas
collapse on small screens.

`public/images/projects/venture-atlas.png` is a still of the existing Venture atlas
globe, including its Natural Earth terrain and country boundaries. Sand Dollar
Hunting uses the existing `public/sand_dollar_cutout.png` site logo.

The cards are ordered Frame It Wright, Scope for Imagination, Venture, and Sand Dollar
Hunting. Three groups — photography, notes & travel, and literature — each have a
short introduction. Group headings
use h2 and card titles use h3.

The home menu has exactly five entries: cognitive science, photography, creative,
personal, and contact. Creative has two local menu options: about and projects.
Creative projects retain their own section menus and link back to the creative
project index in a separate parent-navigation group. Scope for Imagination uses
its full name in navigation. About pages use an “about” title within their named
section; existing page URLs, including Venture’s atlas landing page, are preserved.
The cognitive science menu uses the same section/parent navigation pattern.

## Shared navigation and contact placards — September 30, 2026

`src/data/navigation.ts` defines the site and section hierarchy. A shared
`NavigationList` expands indented submenus on hover, with a disclosure button for
keyboard and touch, an expanded-state indicator, and Escape to close. Parent
labels remain links. Resources and personal submenu anchors open the relevant
accordion. The articles/resources URL remains unchanged for existing bookmarks.
Section menus begin with About. Cognitive science's former overview route redirects
to `/cognitive-science/about`, which holds the greeting, research overview, and
academic timeline; the mentorship statement introduces its own page. Resources and
personal accordion labels use neutral text, and personal labels begin with capitals.
About also exposes lowercase research overview and timeline submenu anchors; the
on-page section titles remain capitalized. Opening statements use regular weight.
Timeline entries use a narrow date column inspired by the CV, without bullets;
dates stack above their entries on smaller screens. Related entries and notes use
a subtle left rule and inset. PEAC runs from 2026 to Present; Gordon is 2020–2024.
Project pages place their Projects return link in the sidebar directly before Home;
individual posts and destinations put their more specific return link before both.
Resource sections are alphabetical after Articles, with page and menu ordering drawn
from the same data. Code retains the existing `#coding` anchor for saved links.
Shared Agency and Theory of Change are temporarily hidden from project lists and
navigation, with their placeholder pages retained for later use. The literature
group currently shows only Sand Dollar Hunting; the empty music group is hidden.

Hover waits 350ms on a parent row before opening. Passing over a row cancels the
pending action. Each branch stays open while hovering its parent or descendants,
then closes after a 300ms grace period outside that branch. Returning cancels the
close; deliberately hovering elsewhere in the menu does not keep it open. A shared
document-level pointer tracker updates both opening and closing intent only after
at least 4px of mouse travel. Layout-generated enter/leave events do not change the
selected branch or cancel its pending opening. This keeps a neighboring menu stable
when an earlier submenu collapses and moves it away from a stationary cursor. Tiny
cursor jitter is ignored; deliberate movement resumes normal hover behavior.
Clicking or keyboard-activating an arrow pins even a hover-opened branch until the
next click, Escape, or navigation. Keyboard focus inside a branch also keeps it open.
After an explicit close, hovering resumes only after leaving and returning to its row.
Closing a branch resets its descendants; pending timers are cleared on navigation.
Expansion and collapse ease over 400ms, with entries fading and settling into place
25ms apart. There is no spring or overshoot. Exit contents remain mounted for the
transition but become inert and hidden from assistive technology immediately.
Interrupted transitions reverse smoothly; reduced-motion disables the animation.
`scripts/test_navigation_hover.mjs` covers the shifting-neighbor regression with
both animated and reduced-motion menus, including deliberate exit and click pinning.

Contact uses two static outlined placards with the original portrait, introduction,
affiliation, updated email addresses, and contact links; the former EvLab link is
removed. Only the links inside
each card are interactive.

`docs/design/placard-reference.html` is a portable design reference with working
HTML/CSS specimens, light/dark previews, responsive rules, and implementation
notes. A copy belongs in Cortex's `docs/development/placard-reference.html`.

## Individual page reference

- Reference: [Measuring event segmentation — Karen Sasmita](https://ksasmita.github.io/projects/1_project/)
- Saved: September 9, 2026
- Intended use: aesthetic and structural ideal for a future projects page in Frame It Wright.

## What to carry forward

- A restrained, editorial research-portfolio feel with generous whitespace and a narrow, readable content column.
- A large project title followed by a concise subtitle that explains the work in one sentence.
- Small, understated text links near the top for related outputs such as the paper, code, poster, data, or demo.
- A clear narrative sequence built from compact section headings: background, questions, method, findings, and practical takeaways.
- Large research figures placed directly in the story, with subtle rounding/shadow and quiet captions beneath them.
- Occasional two-column figure layouts when visual comparison is useful.
- Lightweight typography, restrained color, and minimal navigation/chrome so the project itself remains the focus.
- Support for both light and dark themes.
- A responsive single-column reading experience on smaller screens.

## Interpretation for Frame It Wright

Use this as a mood and information-design reference, not a literal copy. Preserve the site's own type, colors, voice, and visual identity while borrowing the reference page's calm pacing, scientific clarity, figure-led storytelling, and simple hierarchy.

The source page uses the Jekyll [al-folio](https://github.com/alshedivat/al-folio) theme and Raleway/Raleway Slab typography; those implementation choices are useful context but are not requirements.
