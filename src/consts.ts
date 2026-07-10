// Site-wide settings. Edit this file to rebrand the theme — every page,
// the RSS feed, and Open Graph tags read from here.

export const SITE = {
  /** Site name — used in the header brand, <title>, and og:site_name. */
  title: 'Miguel Ramírez Exojo',
  /** Default meta description for pages that don't set their own. */
  description:
    'Cloud, DevOps and infrastructure for industrial SMEs and IT companies needing advanced technical support.',
  /** Description of the RSS feed at /rss.xml. */
  rssDescription:
    'Articles on managed cloud, automation, operational continuity and infrastructure.',
  /** Default social share image, relative to the site root (see public/). */
  ogImage: '/og.jpg',
  /** Footer credit line. */
  footerText: 'Cloud, DevOps and infrastructure focused on continuity and simplicity.',
} as const;

/** Header navigation. `href` is relative to the site root; the configured
 *  `base` is applied automatically via `withBase()`. */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/works/', label: 'Services' },
  { href: '/blog/', label: 'Blog' },
  { href: '/search/', label: 'Search' },
] as const;
