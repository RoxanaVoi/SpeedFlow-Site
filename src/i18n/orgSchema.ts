/**
 * ProfessionalService node for the homepage.
 *
 * It reuses the `#organization` @id emitted globally by Layout.astro, so the two
 * nodes merge into a single entity typed as both Organization and
 * ProfessionalService. That is what puts Speed Flow in the "services firm"
 * category for search and AI engines, rather than leaving it a generic company.
 *
 * `addressLocality` is intentionally absent: adding the city strengthens the
 * "in Romania" signal further, but is not required for a valid PostalAddress.
 */
const SITE = 'https://www.speed-flow.ai';

type Locale = 'ro' | 'en';

const copy: Record<Locale, { description: string; services: string[]; country: string }> = {
  ro: {
    description:
      'Consultanță și software pentru conformitate CBAM, EUDR și guvernanță AI, pentru companii din România.',
    services: ['Consultanță CBAM', 'Consultanță EUDR', 'Consultanță guvernanță AI'],
    country: 'România',
  },
  en: {
    description:
      'Consulting and software for CBAM, EUDR and AI governance compliance, for companies in Romania.',
    services: ['CBAM consulting', 'EUDR consulting', 'AI governance consulting'],
    country: 'Romania',
  },
};

export function professionalServiceSchema(locale: Locale): Record<string, unknown> {
  const c = copy[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}/#organization`,
    name: 'Speed Flow',
    url: `${SITE}/`,
    description: c.description,
    email: 'office@speed-flow.ai',
    areaServed: { '@type': 'Country', name: c.country },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RO',
    },
    knowsAbout: [
      'CBAM',
      'EUDR',
      'EU AI Act',
      'ISO/IEC 42001',
      locale === 'ro' ? 'guvernanță AI' : 'AI governance',
      locale === 'ro' ? 'conformitate de mediu' : 'environmental compliance',
      locale === 'ro' ? 'achiziții publice' : 'public procurement',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'ro' ? 'Servicii' : 'Services',
      itemListElement: c.services.map(name => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}
