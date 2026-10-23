export type Reading = {
  title: string;
  href: string;
  tags: string[];
  favorite?: boolean;
  companion?: { label: string; href: string };
};

export type Resource = {
  name: string;
  description: string;
  href: string;
};

export type ResourceSection = {
  id: string;
  title: string;
  introduction: string;
  resources: Resource[];
};

export const resourceSections: ResourceSection[] = [
  {
    id: "tutorials",
    title: "Tutorials",
    introduction: "A few places to begin, revisit the basics, or work through something new.",
    resources: [
      { name: "Sam Hutchinson’s fMRI tutorial", description: "A walk through the Kanwisher Lab’s fMRI workflow, from localizer data to an analysis you can follow step by step.", href: "https://github.com/samhutch511/kanwisher_lab_fmri" },
      { name: "Naturalistic Data Analysis", description: "For studying brains amid stories, films, and other experiences that look a little more like life. A collection of Python tutorials on shared responses, individual differences, and the dynamics of naturalistic data.", href: "https://naturalistic-data.org/content/intro.html" },
      { name: "How to create a Slurm script", description: "A practical introduction from Johns Hopkins to asking a computing cluster to do some work for you.", href: "https://www.arch.jhu.edu/short-tutorial-how-to-create-a-slurm-script/" },
      { name: "How Transformers Work: A Detailed, Conceptual Explanation", description: "A video walkthrough by IbanDlank for thinking through transformers without beginning with code or equations.", href: "https://www.youtube.com/watch?v=cGMnNi4XGvc" },
      { name: "Computational Neuroscience: Exploring fMRI Data Analysis with Python", description: "An introduction to exploring fMRI data in Python, with examples to work through along the way.", href: "https://medium.com/@bhuvanav/computational-neuroscience-exploring-fmri-data-analysis-with-python-820b06ae4674" },
      { name: "Andy’s Brain Book", description: "Neuroimaging walkthroughs, from getting oriented to working through an analysis.", href: "https://andysbrainbook.readthedocs.io/en/latest/index.html" },
      { name: "3Blue1Brown", description: "Animated mathematics by Grant Sanderson; a lovely invitation to build intuition alongside technique.", href: "https://www.3blue1brown.com" },
    ],
  },
  {
    id: "coding",
    title: "Code",
    introduction: "Simple companions for everyday science.",
    resources: [
      { name: "An Introduction to Pipelines and Code-building with Classes", description: "An approachable introduction to Python classes and object-oriented programming, especially for the moment when a collection of scripts starts becoming a pipeline.", href: "https://prappleizer.github.io/Tutorials/OOP/OOP_and_Classes.html" },
      { name: "Coding Cheat Sheets", description: "A collection of quick references for the syntax and tools that don’t always stay in one’s head.", href: "https://github.com/jramshur/Coding-Cheat-Sheets" },
      { name: "{here}", description: "A simpler way to find your files in R, and a little less time wondering where your working directory has wandered.", href: "https://here.r-lib.org" },
    ],
  },
  {
    id: "datasets",
    title: "Databases & datasets",
    introduction: "Collections that make it possible to ask new questions about language, meaning, and the ways we relate to one another.",
    resources: [
      { name: "CLICS", description: "A database of cross-linguistic colexifications: cases in which a language uses the same word for multiple concepts. A starting point for exploring how languages connect meanings.", href: "https://clics.clld.org" },
      { name: "CANDOR", description: "A corpus of naturalistic conversations, with audio, video, transcripts, and speakers’ reflections on their interactions. For those of us interested in what unfolds between people; access requires an application.", href: "https://talkbank.org/ca/access/CANDOR.html" },
    ],
  },
  {
    id: "visualization-design",
    title: "Data visualization & design",
    introduction: "For the intersection of scientific clarity and visual curiosity: ways of making patterns easier to see, understand, and share.",
    resources: [
      { name: "ninejs gallery", description: "A gallery of interactive visualization examples to explore when thinking about how a figure might invite a little more participation.", href: "https://y-sunflower.github.io/ninejs/gallery/" },
      { name: "The R Graph Gallery", description: "A collection of charts made with R, with code to help turn a visual idea into a figure.", href: "https://r-graph-gallery.com" },
    ],
  },
  {
    id: "research-resources",
    title: "Research resources",
    introduction: "References and support for organizing, carrying out, and communicating research.",
    resources: [
      { name: "BIDS", description: "The Brain Imaging Data Structure: a shared approach to organizing neuroimaging data.", href: "https://bids.neuroimaging.io" },
      { name: "FreeSurferWiki", description: "Documentation and guidance for structural and functional MRI analysis.", href: "https://surfer.nmr.mgh.harvard.edu/fswiki" },
      { name: "Científico Latino Writing Center", description: "STEM writing support and resources.", href: "https://www.cientificolatino.com/writing-center" },
    ],
  },
  {
    id: "interesting-reads",
    title: "Interesting reads",
    introduction: "A gathering of essays, blogs, and other pieces that don’t quite belong on a textbook shelf. I don’t necessarily share the opinions in any given piece; I merely appreciate a thought-provoking read, and the conversations it might invite.",
    resources: [
      { name: "A coding agent is six functions in a trenchcoat", description: "Hadley Wickham on the small set of tools behind a coding agent.", href: "https://tidydesign.substack.com/p/a-coding-agent-is-six-functions-in" },
      { name: "Theory of Mind as a Central Skill for Researchers", description: "Tom McCoy on considering other minds in the everyday work of writing, teaching, reviewing, and collaborating.", href: "https://rtmccoy.com/posts/theory_of_mind.html" },
      { name: "The machines are fine. I’m worried about us.", description: "An essay from Ergosphere on AI and the people using it.", href: "https://ergosphere.blog/posts/the-machines-are-fine/" },
      { name: "Emotion research has a communication conundrum", description: "A piece from The Transmitter on how we talk about emotion in science.", href: "https://www.thetransmitter.org/the-big-picture/emotion-research-has-a-communication-conundrum/" },
      { name: "Slack is bad for thinking", description: "Todd Gureckis on the relationship between our communication tools and the space we leave for thought.", href: "https://todd.gureckislab.org/2026/03/19/slack-bad-thinking" },
    ],
  },
].sort((a, b) => a.title.localeCompare(b.title, "en"));

export const readingTags = [
  ["language", "#859900"],
  ["emotion", "#2AA198"],
  ["social", "#5B8FA8"],
  ["computational", "#6c71c4"],
  ["conversation", "#954F72"],
  ["behavioral", "#d693c4"],
  ["neuroimaging", "#e0519a"],
  ["culture", "#f4a825"],
  ["perception", "#B87540"],
] as const;

export const readings: Reading[] = [
  {
    title: "Botch, T. L., & Finn, E. S. (2025). Sensory context as a universal principle of language in humans and LLMs. PsyArXiv Preprints.",
    href: "https://osf.io/preprints/psyarxiv/nz5eg_v1",
    tags: ["language", "computational"],
    favorite: true,
  },
  {
    title: "Celen, E., van Rijn, P., Lee, H., & Jacoby, N. (2025). Are Expressions for Music Emotions the Same Across Cultures?. arXiv preprint arXiv:2502.08744.",
    href: "https://arxiv.org/pdf/2502.08744",
    tags: ["language", "emotion", "computational", "culture"],
  },
  {
    title: "Dingemanse, M., & Enfield, N. J. (2024). Interactive repair and the foundations of language. Trends in Cognitive Sciences, 28(1), 30-42.",
    href: "https://pure.mpg.de/rest/items/item_3530697/component/file_3558979/content",
    tags: ["language", "computational", "behavioral"],
  },
  {
    title: "Fedorenko, E., Duncan, J., & Kanwisher, N. (2013). Broad domain generality in focal regions of frontal and parietal cortex. PNAS, 110(41), 16616-16621.",
    href: "https://www.pnas.org/doi/pdf/10.1073/pnas.1315235110",
    tags: ["neuroimaging"],
    favorite: true,
  },
  {
    title: "Fedorenko, E., Ivanova, A. A., & Regev, T. I. (2024). The language network as a natural kind within the broader landscape of the human brain. Nature Reviews Neuroscience, 25(5), 289-312.",
    href: "https://www.nature.com/articles/s41583-024-00802-4",
    tags: ["language", "neuroimaging"],
  },
  {
    title: "Fedorenko, E., Piantadosi, S. T., & Gibson, E. A. (2024). Language is primarily a tool for communication rather than thought. Nature, 630(8017), 575-586.",
    href: "https://www.nature.com/articles/s41586-024-07522-w",
    tags: ["language"],
  },
  {
    title: "FeldmanHall, O., & Heffner, J. (2022). A generalizable framework for assessing the role of emotion during choice. American Psychologist, 77(9), 1017.",
    href: "https://static1.squarespace.com/static/56100827e4b0a8aca363cc5f/t/63b86dad78612c089553c06f/1673031085505/2022_AP_GeneralFrameworkEmotion.pdf",
    tags: ["emotion", "computational"],
    favorite: true,
  },
  {
    title: "Heffner, J., & FeldmanHall, O. (2022). A probabilistic map of emotional experiences during competitive social interactions. Nature Communications, 13(1), 1718.",
    href: "https://www.nature.com/articles/s41467-022-29372-8.pdf",
    tags: ["emotion", "social", "computational"],
  },
  {
    title: "Houlihan, S. D., Kleiman-Weiner, M., Hewitt, L. B., Tenenbaum, J. B., & Saxe, R. (2023). Emotion prediction as computation over a generative theory of mind. Philosophical Transactions of the Royal Society A, 381(2251), 20220047.",
    href: "https://cbmm.mit.edu/sites/default/files/publications/houlihan2023computedappraisals_1.pdf",
    tags: ["emotion", "social", "computational"],
  },
  {
    title: "Hoemann, K., Lee, Y., Kuppens, P., Gendron, M., & Boyd, R. L. (2023). Emotional granularity is associated with daily experiential diversity. Affective Science, 4(2), 291-306.",
    href: "https://link.springer.com/article/10.1007/s42761-023-00185-2",
    tags: ["emotion", "behavioral"],
  },
  {
    title: "Jackson, J. C., Watts, J., Henry, T. R., List, J. M., Forkel, R., Mucha, P. J., et al. (2019). Emotion semantics show both cultural variation and universal structure. Science, 366(6472), 1517-1522.",
    href: "https://www.science.org/doi/10.1126/science.aaw8160",
    tags: ["language", "emotion", "culture"],
    favorite: true,
  },
  {
    title: "Jackson, J. C., Rand, D., Lewis, K., Norton, M. I., & Gray, K. (2017). Agent-based modeling: A guide for social psychologists. Social Psychological and Personality Science, 8(4), 387-395.",
    href: "https://journals.sagepub.com/doi/pdf/10.1177/1948550617691100",
    tags: ["social", "computational", "behavioral"],
    favorite: true,
  },
  {
    title: "Kroll, J. F., Bobb, S. C., & Hoshino, N. (2014). Two languages in mind: Bilingualism as a tool to investigate language, cognition, and the brain. Current Directions in Psychological Science, 23(3), 159-163.",
    href: "https://journals.sagepub.com/doi/pdf/10.1177/0963721414528511",
    tags: ["language"],
    favorite: true,
  },
  {
    title: "Malik-Moraleda, S., Ayyash, D., Gallee, J., Affourtit, J., Hoffmann, M., Mineroff, Z., et al. (2022). An investigation across 45 languages and 12 language families reveals a universal language network. Nature Neuroscience, 25(8), 1014-1019.",
    href: "https://www.nature.com/articles/s41593-022-01114-5",
    tags: ["language", "neuroimaging"],
  },
  {
    title: "Rubio-Fernandez, P., Berke, M. D., & Jara-Ettinger, J. (2025). Tracking minds in communication. Trends in Cognitive Sciences, 29(3), 269-281.",
    href: "https://pure.mpg.de/rest/items/item_3623483_2/component/file_3627375/content",
    tags: ["language", "social", "computational", "conversation"],
  },
  {
    title: "Teoh, Y. Y., & FeldmanHall, O. (2025). Deviations from normative emotion representation predicts social and affective dysfunction. PsyArXiv Preprints.",
    href: "https://osf.io/preprints/psyarxiv/23k8b_v1",
    tags: ["emotion", "social", "behavioral"],
    favorite: true,
  },
  {
    title: "Tuckute, G., Kanwisher, N., & Fedorenko, E. (2024). Language in brains, minds, and machines. Annual Review of Neuroscience, 47, 277-301.",
    href: "https://www.annualreviews.org/content/journals/10.1146/annurev-neuro-120623-101142?TRACK=RSS",
    tags: ["language", "computational", "neuroimaging"],
  },
  {
    title: "Wolna, A., Szewczyk, J., Diaz, M., Domagalik, A., Szwed, M., & Wodniecka, Z. (2024). Domain-general and language-specific contributions to speech production in a second language. Scientific Reports, 14(1), 57.",
    href: "https://www.nature.com/articles/s41598-023-49375-9.pdf",
    tags: ["language", "neuroimaging"],
    favorite: true,
  },
  {"title": "Cooney, G., & Wheatley, T. (2025). Conversation. In D. T. Gilbert, S. T. Fiske, E. J. Finkel, & W. B. Mendes (Eds.), The handbook of social psychology (6th ed.). Situational Press.", "href": "https://doi.org/10.70400/ZKHH6259", "tags": ["language", "social", "conversation"]},
  {"title": "FeldmanHall, O., & Chang, L. J. (2018). Social learning: Emotions aid in optimizing goal-directed social behavior. In Goal-directed decision making (pp. 309–330). Academic Press.", "href": "https://doi.org/10.1016/B978-0-12-812098-9.00014-0", "tags": ["emotion", "social", "computational"]},
  {"title": "FeldmanHall, O., & Nassar, M. R. (2021). The computational challenge of social learning. Trends in Cognitive Sciences, 25(12), 1045–1057.", "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8585698/", "tags": ["social", "computational", "behavioral"]},
  {"title": "O’Nell, K. C., Sanchez, K. L., & Finn, E. S. (2025). Complex mutual adaptation in dyads’ semantic similarity trajectories predicts conversation success. PsyArXiv.", "href": "https://doi.org/10.31234/osf.io/t53fy_v1", "tags": ["language", "social", "computational", "conversation"]},
  {"title": "Schloss, K. B. (2024). Color semantics in human cognition. Current Directions in Psychological Science, 33(1), 58–67.", "href": "https://doi.org/10.1177/09637214231208189", "tags": ["perception", "behavioral"], "favorite": true},
  {"title": "Williams, C. C., Owen, L. L. W., Gunsilius, C., Nassar, M. R., & Petzschner, F. H. (2026). Computational signatures of pain chronification: Duration-dependent decision-making shifts across acute and chronic pain (Version 2). bioRxiv.", "href": "https://www.biorxiv.org/content/10.1101/2025.07.09.663993v2.abstract", "tags": ["computational", "behavioral"]},
  {"title": "Wilson, R. C., & Collins, A. G. E. (2019). Ten simple rules for the computational modeling of behavioral data. eLife, 8, e49547.", "href": "https://elifesciences.org/articles/49547", "tags": ["computational", "behavioral"], "companion": {"label": "code & examples", "href": "https://github.com/AnneCollins/TenSimpleRulesModeling"}},
  {"title": "Zada, Z., Goldstein, A., Michelmann, S., Simony, E., Price, A., Hasenfratz, L., et al. (2024). A shared model-based linguistic space for transmitting our thoughts from brain to brain in natural conversations. Neuron, 112(18), 3211–3222.e5.", "href": "https://doi.org/10.1016/j.neuron.2024.06.025", "tags": ["language", "social", "computational", "conversation", "neuroimaging"]},
];
