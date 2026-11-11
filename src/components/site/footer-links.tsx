import Link from "next/link";

// Small grey symbols for the footers: Instagram on the photography site, GitHub on the main site.

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

// The main site's footer links: the wiki, then GitHub, then whatever follows (the night switch).
export function SiteFooterLinks({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 leading-none">
      <Link href="/about" className="site-mono leading-none text-stone-500">wiki</Link>
      <span aria-hidden="true" className="leading-none text-stone-400">•</span>
      <a href="https://github.com/aaronwriight" aria-label="GitHub" title="GitHub" className="footer-icon">
        <GitHubIcon />
      </a>
      {children && (
        <>
          <span aria-hidden="true" className="leading-none text-stone-400">•</span>
          {children}
        </>
      )}
    </div>
  );
}
