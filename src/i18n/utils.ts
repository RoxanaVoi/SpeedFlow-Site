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

export function getNavItems(locale: Locale) {
  return [
    { label: t(locale, 'nav.solutions'), href: getLocalizedPath(locale, '/solutii/cbam') , hasDropdown: true,
      children: [
        { label: 'CBAM', href: getLocalizedPath(locale, locale === 'en' ? '/solutions/cbam' : '/solutii/cbam') },
        { label: 'EUDR', href: getLocalizedPath(locale, locale === 'en' ? '/solutions/eudr' : '/solutii/eudr') },
        { label: 'ePaap', href: getLocalizedPath(locale, locale === 'en' ? '/solutions/epaap' : '/solutii/epaap') },
        { label: 'FindEquip', href: getLocalizedPath(locale, locale === 'en' ? '/solutions/findequip' : '/solutii/findequip') },
        { label: t(locale, 'nav.retail'), href: getLocalizedPath(locale, locale === 'en' ? '/solutions/retail' : '/solutii/retail') },
      ]
    },
    { label: t(locale, 'nav.howWeWork'), href: getLocalizedPath(locale, locale === 'en' ? '/how-we-work' : '/cum-lucram') },
    { label: t(locale, 'nav.about'), href: getLocalizedPath(locale, locale === 'en' ? '/about' : '/despre') },
    { label: t(locale, 'nav.contact'), href: getLocalizedPath(locale, '/contact') },
  ];
}
