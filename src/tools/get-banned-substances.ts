import { buildMeta } from '../metadata.js';
import { buildCitation } from '../citation.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface BannedSubstancesArgs {
  species?: string;
  production_type?: string;
  jurisdiction?: string;
}

export function handleGetBannedSubstances(db: Database, args: BannedSubstancesArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const conditions: string[] = ['jurisdiction = ?'];
  const params: unknown[] = [jv.jurisdiction];

  if (args.species) {
    conditions.push('(LOWER(applies_to) LIKE ? OR LOWER(applies_to) LIKE ?)');
    params.push(`%${args.species.toLowerCase()}%`, '%all%');
  }

  if (args.production_type) {
    conditions.push('LOWER(applies_to) LIKE ?');
    params.push(`%${args.production_type.toLowerCase()}%`);
  }

  const substances = db.all<{
    substance: string; category: string; applies_to: string; regulation_ref: string;
  }>(
    `SELECT substance, category, applies_to, regulation_ref
     FROM banned_substances WHERE ${conditions.join(' AND ')}`,
    params
  );

  return {
    jurisdiction: jv.jurisdiction,
    filter: {
      species: args.species ?? 'all',
      production_type: args.production_type ?? 'all',
    },
    results_count: substances.length,
    banned_substances: substances.map(s => ({
      substance: s.substance,
      category: s.category,
      applies_to: s.applies_to,
      regulation_ref: s.regulation_ref,
    })),
    warning: 'Brug af forbudte stoffer i fødevareproducerende dyr er en strafbar handling under ' +
      'EU Forordning 2019/6 og dansk lovgivning. Konsekvenser omfatter strafansvar, ' +
      'tilbagekaldelse af produkter og besætningsrestriktioner.',
    _meta: buildMeta({
      source_url: 'https://eur-lex.europa.eu/eli/reg/2019/6/oj',
    }),
    _citation: buildCitation(
      `banned-substances:${args.species ?? 'all'}`,
      `Banned substances${args.species ? ` (${args.species})` : ''}`,
      'get_banned_substances',
      {
        ...(args.species ? { species: args.species } : {}),
        ...(args.production_type ? { production_type: args.production_type } : {}),
      },
      'https://eur-lex.europa.eu/eli/reg/2019/6/oj',
    ),
  };
}
