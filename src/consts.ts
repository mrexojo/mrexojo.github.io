// Site-wide settings. Edit this file to rebrand the theme — every page,
// the RSS feed, and Open Graph tags read from here.

export const SITE = {
  /** Site name — used in the header brand, <title>, and og:site_name. */
  title: 'Miguel Ramírez Exojo',
  /** Default meta description for pages that don't set their own. */
  description:
    'Cloud, DevOps e infraestructura para pymes industriales y empresas IT que necesitan apoyo técnico avanzado.',
  /** Description of the RSS feed at /rss.xml. */
  rssDescription:
    'Artículos sobre cloud gestionado, automatización, continuidad operativa e infraestructura.',
  /** Default social share image, relative to the site root (see public/). */
  ogImage: '/og.jpg',
  /** Footer credit line. */
  footerText: 'Cloud, DevOps e infraestructura con foco en continuidad y simplicidad.',
} as const;

/** Header navigation. `href` is relative to the site root; the configured
 *  `base` is applied automatically via `withBase()`. */
export const NAV_ITEMS = [
  { href: '/', label: 'Inicio' },
  { href: '/about/', label: 'Perfil' },
  { href: '/works/', label: 'Servicios' },
  { href: '/blog/', label: 'Blog' },
  { href: '/search/', label: 'Buscar' },
] as const;
