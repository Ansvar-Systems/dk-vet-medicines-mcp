import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface CascadeArgs {
  species: string;
  condition: string;
  jurisdiction?: string;
}

export function handleCheckCascadeRules(db: Database, args: CascadeArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const rules = db.all<{
    step_order: number; description: string; documentation_required: string;
    default_withdrawal_meat_days: number; default_withdrawal_milk_days: number;
    source: string;
  }>(
    'SELECT step_order, description, documentation_required, default_withdrawal_meat_days, default_withdrawal_milk_days, source FROM cascade_rules WHERE jurisdiction = ? ORDER BY step_order',
    [jv.jurisdiction]
  );

  return {
    species: args.species,
    condition: args.condition,
    jurisdiction: jv.jurisdiction,
    cascade_steps: rules.map(r => ({
      step: r.step_order,
      description: r.description,
      documentation_required: r.documentation_required,
      default_withdrawal_periods: {
        meat_days: r.default_withdrawal_meat_days,
        milk_days: r.default_withdrawal_milk_days,
      },
      source: r.source,
    })),
    guidance: `Kaskadereglen gælder, når intet veterinærlægemiddel er godkendt i Danmark til ` +
      `den pågældende dyreart (${args.species}) og indikation (${args.condition}). Dyrlægen skal ` +
      'følge trinene i rækkefølge. Ved brug af kaskaden gælder lovbestemte ' +
      'minimumstilbageholdelsestider, medmindre længere perioder er angivet i produktresuméet (SPC).',
    _meta: buildMeta({
      source_url: 'https://eur-lex.europa.eu/eli/reg/2019/6/oj',
    }),
  };
}
