import { buildMeta } from '../metadata.js';
import type { Database } from '../db.js';

interface Source {
  name: string;
  authority: string;
  official_url: string;
  retrieval_method: string;
  update_frequency: string;
  license: string;
  coverage: string;
  last_retrieved?: string;
}

export function handleListSources(db: Database): { sources: Source[]; _meta: ReturnType<typeof buildMeta> } {
  const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);

  const sources: Source[] = [
    {
      name: 'Fødevarestyrelsen VetStat',
      authority: 'Fødevarestyrelsen (Danish Veterinary and Food Administration)',
      official_url: 'https://foedevarestyrelsen.dk/kvaeg/telefonisk-medicin/vetstat',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'quarterly',
      license: 'Danish public data',
      coverage: 'Antibiotic consumption data, Yellow Card thresholds, SRA obligations',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Lægemiddelstyrelsen (Danish Medicines Agency)',
      authority: 'Lægemiddelstyrelsen',
      official_url: 'https://laegemiddelstyrelsen.dk/da/veterinaeromraadet/',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Danish public data',
      coverage: 'Authorised veterinary medicines, product summaries (SPC), marketing authorisations',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'DANMAP — Danish Integrated Antimicrobial Resistance Monitoring',
      authority: 'Statens Serum Institut (SSI) + DTU National Food Institute',
      official_url: 'https://www.danmap.org/',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'annual',
      license: 'Open access — Danish public research',
      coverage: 'Antimicrobial resistance data, consumption trends, MRSA surveillance, species-specific resistance rates',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'SEGES Innovation',
      authority: 'SEGES Innovation (Landbrug & Fødevarer)',
      official_url: 'https://www.seges.dk/',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_published',
      license: 'Public guidance',
      coverage: 'Practical guidance for livestock producers on medicine use, SRA compliance, and Gul Kort management',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'EU Veterinary Medicines Regulation 2019/6',
      authority: 'European Parliament and Council',
      official_url: 'https://eur-lex.europa.eu/eli/reg/2019/6/oj',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'EUR-Lex open data',
      coverage: 'Cascade prescribing rules, critical antibiotic restrictions, banned substances',
      last_retrieved: lastIngest?.value,
    },
  ];

  return {
    sources,
    _meta: buildMeta({ source_url: 'https://foedevarestyrelsen.dk/kvaeg/telefonisk-medicin/vetstat' }),
  };
}
