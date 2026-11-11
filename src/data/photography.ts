// Public account entry only. Client invitations never belong in site data.
export const picTimeClientUrl = "https://frameitwrightphotography.pic-time.com/client";
export const instagramUrl = "https://www.instagram.com/frameitwrightphotography/";

// While the photography site's last pages are written it is closed: the front door's photography plaque shows an
// "under construction" card, and every photography address serves only the under-construction page (with
// PHOTOGRAPHY_LOCKED in next.config.mjs). Set both to false to open it.
export const photographyUnderConstruction = true;

// The categories galleries are published under (scripts/photography.py). Kept whole: events and travel stay in the
// data even though the portfolio shows only the five sessions below.
export const photographyCategories = [
  "Events",
  "Couples & Engagement",
  "Wedding",
  "Family, Friends, & Lifestyle",
  "Graduation (High School & College)",
  "Headshots",
  "Travel",
] as const;

// The five sessions offered, in portfolio order. Each draws its gallery from the published categories listed.
export const photographySessions = [
  { slug: "wedding", title: "wedding", categories: ["Wedding"], line: "The whole day, from getting ready to the last dance." },
  { slug: "couples-engagement", title: "couples & engagement", categories: ["Couples & Engagement"], line: "The two of you, somewhere that feels like you." },
  { slug: "family-friends-lifestyle", title: "family, friends, & lifestyle", categories: ["Family, Friends, & Lifestyle"], line: "Your people, together, doing what you love." },
  { slug: "graduation-seniors", title: "graduation & seniors", categories: ["Graduation (High School & College)"], line: "A milestone, in the places that got you there." },
  { slug: "portraits", title: "portraits", categories: ["Headshots"], line: "Just you: for work, for fun, or for no reason at all." },
] as const;

export type PhotographySession = (typeof photographySessions)[number];

// What the booking form asks someone to describe, by session. The fuller per-session questions come later.
export const sessionPrompts: Record<string, string> = {
  wedding: "The date, the venue, roughly how many guests, and how much of the day you'd like covered.",
  "couples-engagement": "A season, a place that means something to you both, and whether it's a surprise.",
  "family-friends-lifestyle": "How many people, any little ones or pets, and whether home or outdoors feels right.",
  "graduation-seniors": "Your school, your graduation date, and any campus spots you'd love.",
  portraits: "What they're for (personal, professional, creative) and the look you're after.",
  events: "The occasion, the date, and roughly how many people.",
  "something else": "What would your perfect shoot look like?",
};

// The booking form's choices: the five sessions, then events and anything else. Each key finds its prompt above.
export const photographyShootTypes = [
  ...photographySessions.map(({ slug, title }) => ({ key: slug as string, label: title as string })),
  { key: "events", label: "events" },
  { key: "something else", label: "something else" },
];

// Kudos from clients, in clients' own words. The bracketed ones are placeholders until more come in.
export const kudos = [
  // From writing/testimonials.rtf (Steph, 7/11/26).
  { quote: "Thank you so much for yesterday!!! I have never seen the kids be so into pictures before and have such authentic smiles! You made it very fun and your prompts were awesome 👏🏻", by: "Steph", session: "family, friends, & lifestyle" },
  { quote: "[a client's words about the photographs themselves]", by: "[name]", session: "graduation & seniors" },
  { quote: "[a client's words about working with you]", by: "[names]", session: "family, friends, & lifestyle" },
];

// Questions for the contact page. Answers in brackets are yours to write.
export const photographyFaq = [
  { question: "Where do sessions happen?", answer: "[Your home base, and how far you're happy to travel.]" },
  { question: "I've never been photographed. Will it be awkward?", answer: "[How you guide people who feel camera-shy.]" },
  { question: "What should we wear?", answer: "[Your advice on outfits and colors.]" },
  { question: "When will I get my photos?", answer: "[Your delivery time.] They arrive in a private Pic-Time gallery; the galleries page explains how to find yours." },
  { question: "What if the weather turns?", answer: "[Your rain plan.]" },
];

// Where the section lives on aaronwriight.com. On frameitwright.com the same pages are served from the root (see the
// host rules in next.config.mjs), so links keep this prefix and that domain strips it.
export const photographyBase = "/frame-it-wright-photography";
export const photoPath = (path = "") => `${photographyBase}${path}`;

export const photographyNav = [
  { label: "about", href: photoPath("/about") },
  { label: "portfolio", href: photoPath("/portfolio") },
  { label: "galleries", href: photoPath("/galleries") },
  { label: "contact", href: photoPath("/contact") },
];
