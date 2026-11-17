import { siteUrl } from "@/lib/site-url";

// The email a new subscriber gets the moment they join. One per newsletter; edit the words here. Each paragraph is
// plain text with optional links written as [label](address), where the address is a page on aaronwriight.com
// (/creative) or a full https:// address.
export type WelcomeEmail = {
  subject: string;
  paragraphs: string[];
  // The newsletter's page, whose unsubscribe form is linked at the foot of the email (a path or a full address).
  listPath: string;
  // Where the person signed up, as the small print names it.
  site?: string;
};

export const scopeWelcome: WelcomeEmail = {
  subject: "Welcome to Scope for Imagination",
  paragraphs: [
    "Thank you for joining the Scope for Imagination newsletter. It's my digital journal: photographs, reflections, life updates, and the occasional rant.",
    "Whenever a new entry goes up, I'll send you a short note with a link to it. That's all this list will ever be: an occasional email, and nothing more.",
    "If you'd like to start reading now, every entry so far is [in the journal](/scope-for-imagination).",
  ],
  listPath: "/scope-for-imagination/newsletter",
};

export const creativeWelcome: WelcomeEmail = {
  subject: "Welcome to the creative newsletter",
  paragraphs: [
    "Thank you for joining my creative newsletter. Every so often I'll write with new writing, notes from the blogs, and photography and other projects as they take shape.",
    "If you'd like to look around in the meantime, everything so far is [on the creative page](/creative).",
  ],
  listPath: "/creative/newsletter",
};

// Frame it Wright's newsletter is the photography part of the creative newsletter, so its pages are on frameitwright.com.
export const photographyWelcome: WelcomeEmail = {
  subject: "Welcome to Frame it Wright Photography",
  paragraphs: [
    "Thank you for joining the Frame it Wright Photography newsletter. Every so often I'll write when there are new photographs to share, a new session to show off, or dates opening up for the season ahead.",
    "If you'd like to look around in the meantime, the [portfolio](https://frameitwright.com/portfolio) is the place to start, and when you're ready to create something together, [say hello](https://frameitwright.com/contact).",
  ],
  listPath: "https://frameitwright.com/newsletter",
  site: "frameitwright.com",
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const linkPattern = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^)]*)\)/g;
const absolute = (address: string) => (address.startsWith("/") ? `${siteUrl}${address}` : address);

export function renderWelcomeEmail(welcome: WelcomeEmail, firstName: string) {
  const greeting = `Hello ${firstName || "there"},`;
  const unsubscribeUrl = absolute(welcome.listPath);
  const site = welcome.site ?? "aaronwriight.com";
  const signOff = "Aaron";

  const htmlParagraph = (paragraph: string) =>
    escapeHtml(paragraph).replace(linkPattern, (_, label: string, address: string) => `<a href="${absolute(address)}">${label}</a>`);
  const textParagraph = (paragraph: string) =>
    paragraph.replace(linkPattern, (_, label: string, address: string) => `${label} (${absolute(address)})`);

  const html = [
    `<p>${escapeHtml(greeting)}</p>`,
    ...welcome.paragraphs.map((paragraph) => `<p>${htmlParagraph(paragraph)}</p>`),
    `<p>${signOff}</p>`,
    `<p><small>You're receiving this because this address was signed up at ${site}. If that wasn't you, or you change your mind, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.</small></p>`,
  ].join("");

  const text = [
    greeting,
    ...welcome.paragraphs.map(textParagraph),
    signOff,
    `You're receiving this because this address was signed up at ${site}. If that wasn't you, or you change your mind, you can unsubscribe here: ${unsubscribeUrl}`,
  ].join("\n\n");

  return { subject: welcome.subject, html, text };
}
