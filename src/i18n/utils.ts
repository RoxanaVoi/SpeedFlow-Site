import ro from './ro.json';
import en from './en.json';

type Locale = 'ro' | 'en';

const translations: Record<Locale, Record<string, string>> = { ro, en };

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'en') return 'en';
  return 'ro';
}

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations['ro']?.[key] ?? key;
}

export function getLocalizedPath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function getConsultingBase(locale: Locale): string {
  return locale === 'en' ? '/ai-consulting' : '/consultanta-ai';
}

export function getConsultingServices(locale: Locale) {
  const services = [
    { key: 'diagnostic', ro: '/consultanta-ai/diagnostic', en: '/ai-consulting/diagnostic' },
    { key: 'dataPrep', ro: '/consultanta-ai/pregatire-date', en: '/ai-consulting/data-preparation' },
    { key: 'governance', ro: '/consultanta-ai/guvernanta', en: '/ai-consulting/governance' },
    { key: 'agents', ro: '/consultanta-ai/agenti-automatizare', en: '/ai-consulting/agents-automation' },
    { key: 'adoption', ro: '/consultanta-ai/adoptie-scalare', en: '/ai-consulting/adoption-scaling' },
  ];
  return services.map(s => ({
    key: s.key,
    titleKey: `services.${s.key}.title`,
    shortKey: `services.${s.key}.short`,
    href: getLocalizedPath(locale, locale === 'en' ? s.en : s.ro),
    altPath: locale === 'en' ? s.ro : s.en,
  }));
}

export interface NavChild {
  label: string;
  href?: string;
  heading?: boolean;
}

export function getNavItems(locale: Locale) {
  const solutionPath = (slug: string) =>
    getLocalizedPath(locale, locale === 'en' ? `/solutions/${slug}` : `/solutii/${slug}`);

  return [
    { label: t(locale, 'nav.consulting'), href: getLocalizedPath(locale, getConsultingBase(locale)) },
    { label: t(locale, 'nav.solutions'), href: solutionPath('cbam'), hasDropdown: true,
      children: [
        { label: t(locale, 'solutions.group.compliance'), heading: true },
        { label: 'CBAM Manager', href: solutionPath('cbam') },
        { label: 'EUDR Manager', href: solutionPath('eudr') },
        { label: t(locale, 'solutions.group.authorities'), heading: true },
        { label: 'ePaap', href: solutionPath('epaap') },
        { label: t(locale, 'solutions.group.bidders'), heading: true },
        { label: 'TenderCraft', href: solutionPath('tendercraft') },
        { label: 'FindEquip', href: solutionPath('findequip') },
        { label: t(locale, 'solutions.group.internal'), heading: true },
        { label: t(locale, 'nav.retail'), href: solutionPath('retail') },
      ] as NavChild[]
    },
    { label: t(locale, 'nav.howWeWork'), href: getLocalizedPath(locale, locale === 'en' ? '/how-we-work' : '/cum-lucram') },
    { label: t(locale, 'nav.about'), href: getLocalizedPath(locale, locale === 'en' ? '/about' : '/despre') },
    { label: t(locale, 'nav.contact'), href: getLocalizedPath(locale, '/contact') },
  ];
}
