// Site-wide settings. Edit this file to rebrand the theme — every page,
// the RSS feed, and Open Graph tags read from here.

export const SITE = {
  /** Site name — used in the header brand, <title>, and og:site_name. */
  title: 'Miguel Ramírez Exojo',
  /** Default meta description for pages that don't set their own. */
  description:
    'Senior cloud infrastructure contractor. Remote B2B engagements across Europe in AWS, GCP, Azure, Terraform, FinOps, and DevSecOps.',
  /** Description of the RSS feed at /rss.xml. */
  rssDescription:
    'Articles for engineering leaders on cloud infrastructure decisions: architecture, migration, automation, cost, and delivery.',
  /** Default social share image, relative to the site root (see public/). */
  ogImage: '/og.jpg',
  /** Footer credit line. */
  footerText: 'Senior cloud infrastructure contractor — remote across Europe.',
} as const;

/** Header navigation. `href` is relative to the site root; the configured
 *  `base` is applied automatically via `withBase()`. */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/works/', label: 'Services' },
  { href: '/#experience', label: 'Experience' },
  { href: '/blog/', label: 'Vision' },
  { href: '/#contact', label: 'Contact' },
] as const;

export const CONTACT = {
  email: 'services@mrexojo.com',
  calendarUrl:
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1G9_RkCSFehT2I-96BKFTDmvF1c5RfB2jlGxyfmcG3JboZT_ftvIH4nD4izfE7dpTTuBJZl0dR?gv=true',
} as const;

/** All profiles are @mrexojo. */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mrexojo/' },
  { label: 'GitHub', href: 'https://github.com/mrexojo' },
  { label: 'YouTube', href: 'https://youtube.com/@mrexojo' },
] as const;

/** Career history, most recent first. Source: src/content/cv/cv.pdf. */
export const EXPERIENCE = [
  {
    period: '2022 — Present',
    company: 'mrexojo.com · B2B Contractor',
    role: 'Freelance Cloud & DevSecOps Engineer',
    description:
      'Remote engagements for Orange Bank, SantaLucía, and Jefferson Frank IT Consulting: DevSecOps pipelines, FinOps cost control, and AI infrastructure operations.',
    stack: ['Terraform', 'GitHub Actions', 'AWS', 'Azure', 'FinOps'],
  },
  {
    period: '2021 — 2022',
    company: 'Copado (US)',
    role: 'Cloud Infrastructure Engineer',
    description:
      'Custom Terraform modules for a Salesforce DevOps platform on GKE; observability (Sumo Logic, Prometheus) sustaining 98% uptime across a team spanning US, India, and Europe.',
    stack: ['GKE', 'Terraform', 'GitLab CI', 'HashiCorp Vault'],
  },
  {
    period: '2018 — 2021',
    company: 'Sngular (Spain)',
    role: 'Cloud & DevOps Engineer',
    description:
      'Client engagements at Decathlon Spain (AWS EKS to GCP GKE migration) and Telefónica Foundation (IaC for a global high-availability platform).',
    stack: ['AWS', 'GCP', 'Terraform', 'Ansible'],
  },
  {
    period: '2016 — 2018',
    company: 'Nokia Spain',
    role: 'Site Reliability Engineer',
    description:
      'OpenStack and bare-metal operations for telecom OTT streaming infrastructure; automated provisioning with MAAS.',
    stack: ['OpenStack', 'MAAS', 'Puppet'],
  },
  {
    period: '2007 — 2016',
    company: 'IIC / ZeppelinTV',
    role: 'Linux Systems Administrator',
    description:
      'Foundational systems administration: Linux, virtualization, databases, backups, and network infrastructure.',
    stack: ['Linux', 'VMware', 'Databases'],
  },
] as const;

/** Certifications, most recent first. Source: src/content/cv/cv.pdf. */
export const CERTIFICATIONS = [
  { name: 'NVIDIA NCA-AIIO — AI Infrastructure and Operations', year: '2026' },
  { name: 'Google Cloud Certified Engineer (Renewed)', year: '2025' },
  { name: 'AWS Solutions Architect Associate', year: '2023' },
  { name: 'FinOps Certified Practitioner (FOCP)', year: '2023' },
  { name: 'AWS Security Specialty', year: '2022' },
  { name: 'HashiCorp Terraform Certified Associate', year: '2020' },
  { name: 'Linux LPIC-3 (Virtualization & HA)', year: '2018' },
  { name: 'OpenStack Certified Administrator (COA)', year: '2017' },
] as const;

/** YouTube channel, organized by topic rather than upload date. Add entries
 *  to a section's `videos` array as they publish; empty sections render a
 *  "coming soon" placeholder. */
export const VIDEO_SECTIONS = [
  {
    title: 'Cloud Architecture & Migration',
    description: 'Decision-making behind cloud moves — what to check before committing budget.',
    videos: [] as { title: string; youtubeId: string; publishDate: string }[],
  },
  {
    title: 'Automation & Infrastructure as Code',
    description: 'Terraform and pipeline patterns, and the over-engineering failure modes to avoid.',
    videos: [] as { title: string; youtubeId: string; publishDate: string }[],
  },
  {
    title: 'FinOps & Cost Optimization',
    description: 'Where cloud spend actually goes, and what is worth fixing first.',
    videos: [] as { title: string; youtubeId: string; publishDate: string }[],
  },
  {
    title: 'DevSecOps & Delivery',
    description: 'Security controls that survive daily engineering, not just an audit.',
    videos: [] as { title: string; youtubeId: string; publishDate: string }[],
  },
] as const;
