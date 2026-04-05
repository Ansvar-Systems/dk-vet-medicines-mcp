export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'Data er vejledende og baseret på offentligt tilgængelige kilder (Fødevarestyrelsen, Lægemiddelstyrelsen, DANMAP). ' +
  'Tilbageholdelsestider er for standarddosering — kontrollér altid det specifikke produktresumé (SPC) for dit ' +
  'præparat og dosis. Forkerte tilbageholdelsestider kan føre til restkoncentrationer i fødevarer. ' +
  'Alle antibiotika kræver veterinærmæssig ordination. Kontakt din dyrlæge.';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://foedevarestyrelsen.dk/kvaeg/telefonisk-medicin/vetstat',
    copyright: 'Data: Fødevarestyrelsen, Lægemiddelstyrelsen, DANMAP (SSI + DTU). Server: Apache-2.0 Ansvar Systems.',
    server: 'dk-vet-medicines-mcp',
    version: '0.1.0',
    ...overrides,
  };
}
