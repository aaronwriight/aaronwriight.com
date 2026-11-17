// The research program: its name (under "science" on the home page's plaque), its line and central question (the
// science about page's research overview), and its three trails (the about page and the mentorship page). Two names
// are on trial: set researchFocus to framings.conversation or framings.communication.
const framings = {
  conversation: {
    name: "embodied conversation",
    title: "Embodied Conversation",
    line: "the cognitive, social, affective, and interoceptive processes underlying human communication",
  },
  communication: {
    name: "embodied communication",
    title: "Embodied Communication",
    line: "the cognitive, social, affective, and interoceptive processes at work when people talk with one another",
  },
};

export const researchFocus = framings.conversation;

// Its three verbs are the three trails, in order.
export const centralQuestion =
  "How do interacting minds and bodies infer, regulate, and coordinate internal states to make meaning together?";

// The three lines of inquiry, each with its research question.
export const researchTrails = [
  {
    title: "Social inference",
    question:
      "How do people infer a conversational partner’s internal states from what they say and how they say it, and do their own internal states bias those inferences?",
  },
  {
    title: "Interoceptive regulation",
    question:
      "How do people infer and regulate their own internal states during conversation, and does this regulation process change how they perceive and engage in conversation?",
  },
  {
    title: "Interpersonal coordination",
    question:
      "How do interlocutors’ internal states become coupled through conversation, and what does that coupling do for the conversation and connection?",
  },
] as const;

// Work the overview cites.
export const researchSources = {
  petzschner2021: { label: "Petzschner et al., 2021", href: "https://doi.org/10.1016/j.tins.2020.09.012" },
  onell2026: { label: "O’Nell, Sanchez, & Finn, 2026", href: "https://doi.org/10.1126/sciadv.aeb2684" },
  avidan2026: { label: "Avidan et al., 2026", href: "https://doi.org/10.1523/JNEUROSCI.1178-26.2026" },
  lettieri2026: { label: "Lettieri, 2026", href: "https://doi.org/10.3389/fnins.2026.1771470" },
  feldmanhall2021: { label: "FeldmanHall & Nassar, 2021", href: "https://doi.org/10.1016/j.tics.2021.09.002" },
};
