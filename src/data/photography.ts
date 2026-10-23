// Public account entry only. Client invitations never belong in site data.
export const picTimeClientUrl = "https://frameitwrightphotography.pic-time.com/client";

export const photographyCategories = [
  "Events",
  "Couples & Engagement",
  "Wedding",
  "Family, Friends, & Lifestyle",
  "Graduation (High School & College)",
  "Headshots",
  "Travel",
] as const;

export const photographyShootTypes = photographyCategories.filter((category) => category !== "Travel");
