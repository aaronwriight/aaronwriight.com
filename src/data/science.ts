// The research program's name, shown under "science" on the home page's plaque. Two names are on trial: set
// researchFocus to framings.conversation or framings.communication.
//
// Draft, not shown anywhere yet: the central question and the three trails below are for a later rewrite of the science
// about page's research overview (and the mentorship page's list), once the program's framing settles.
const framings = {
  conversation: {
    name: "embodied conversation",
    line: "the cognitive, social, affective, and interoceptive processes underlying human communication",
  },
  communication: {
    name: "embodied communication",
    line: "the cognitive, social, affective, and interoceptive processes at work when people talk with one another",
  },
};

export const researchFocus = framings.conversation;

export const centralQuestion = "How do interacting minds and bodies navigate, construct, and regulate meaning together through conversation?";

// The three lines of inquiry, each with its question and what it takes in.
export const researchTrails = [
  {
    title: "Social inference",
    question: "How do we understand others during conversation?",
    points: [
      "Representing others’ mental and emotional states",
      "Inferring communicative intentions",
      "Integrating linguistic, prosodic, contextual, and social information",
      "Updating representations as conversations unfold",
    ],
  },
  {
    title: "Interoceptive awareness",
    question: "How do we experience and interpret ourselves during conversation?",
    points: [
      "Monitoring internal bodily states",
      "The relationship between bodily signals and affective experience",
      "Interoceptive contributions to attention, appraisal, and decision-making",
      "How internal states influence linguistic interpretation and behavioral responses",
    ],
  },
  {
    title: "Interpersonal regulation",
    question: "How do we dynamically coordinate with others during conversation?",
    points: [
      "Emotional and behavioral regulation",
      "Affective alignment and co-regulation",
      "Negotiating conversational tone",
      "Misinterpretation, conversational repair, and social adaptation",
      "How interlocutors influence one another’s internal states",
    ],
  },
];
