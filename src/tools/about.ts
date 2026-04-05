import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Danish Veterinary Medicines MCP',
    description:
      'Danish veterinary medicines data from Fødevarestyrelsen and Lægemiddelstyrelsen. ' +
      'Covers authorised products, withdrawal periods for food-producing animals, ' +
      'cascade prescribing rules (kaskadereglen), banned/restricted substances, ' +
      'Gul Kort (Yellow Card) antibiotic thresholds, SRA obligations, ' +
      'DANMAP resistance data, and record-keeping requirements.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: [
      'Fødevarestyrelsen VetStat',
      'Lægemiddelstyrelsen',
      'DANMAP (SSI + DTU)',
      'SEGES Innovation',
    ],
    tools_count: 10,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/Ansvar-Systems/dk-vet-medicines-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
