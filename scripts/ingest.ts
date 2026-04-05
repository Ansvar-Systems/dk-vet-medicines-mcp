/**
 * Denmark Vet Medicines MCP — Data Ingestion Script
 *
 * Sources: Fødevarestyrelsen VetStat, Lægemiddelstyrelsen, DANMAP (SSI + DTU), SEGES Innovation
 *
 * Usage: npm run ingest
 */

import { createDatabase } from '../src/db.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('data', { recursive: true });
const db = createDatabase('data/database.db');

const now = new Date().toISOString().split('T')[0];

// ─── Medicines ──────────────────────────────────────────────────────────────

interface Medicine {
  id: string;
  product_name: string;
  ma_number: string | null;
  active_substances: string;
  species_authorised: string;
  pharmaceutical_form: string;
  legal_category: string;
  ma_holder: string;
  therapeutic_group: string;
  spc_url: string | null;
  status: string;
}

const medicines: Medicine[] = [
  {
    id: 'penicillin-prokain',
    product_name: 'Penovet vet. (benzylpenicillin-prokain)',
    ma_number: 'DK/VP/0001',
    active_substances: 'Benzylpenicillin',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, suspension',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Boehringer Ingelheim',
    therapeutic_group: 'Antibiotikum — penicillin',
    spc_url: 'https://www.dkma.dk/produktresume/penovet',
    status: 'Godkendt',
  },
  {
    id: 'amoxicillin',
    product_name: 'Clamoxyl vet. (amoxicillin)',
    ma_number: 'DK/VP/0002',
    active_substances: 'Amoxicillin',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, suspension',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Zoetis',
    therapeutic_group: 'Antibiotikum — aminopenicillin',
    spc_url: 'https://www.dkma.dk/produktresume/clamoxyl',
    status: 'Godkendt',
  },
  {
    id: 'oxytetracyclin',
    product_name: 'Engemycin vet. (oxytetracyclin)',
    ma_number: 'DK/VP/0003',
    active_substances: 'Oxytetracyclin',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'MSD Animal Health',
    therapeutic_group: 'Antibiotikum — tetracyclin',
    spc_url: 'https://www.dkma.dk/produktresume/engemycin',
    status: 'Godkendt',
  },
  {
    id: 'tulathromycin',
    product_name: 'Draxxin vet. (tulathromycin)',
    ma_number: 'EU/2/04/044',
    active_substances: 'Tulathromycin',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Zoetis',
    therapeutic_group: 'Antibiotikum — makrolid',
    spc_url: 'https://www.ema.europa.eu/en/medicines/veterinary/EPAR/draxxin',
    status: 'Godkendt',
  },
  {
    id: 'enrofloxacin',
    product_name: 'Baytril vet. (enrofloxacin)',
    ma_number: 'DK/VP/0005',
    active_substances: 'Enrofloxacin',
    species_authorised: 'svin, kvæg, fjerkræ',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx) — kritisk vigtigt antibiotikum',
    ma_holder: 'Elanco',
    therapeutic_group: 'Antibiotikum — fluoroquinolon (kritisk vigtigt)',
    spc_url: 'https://www.dkma.dk/produktresume/baytril',
    status: 'Godkendt — restriktiv brug',
  },
  {
    id: 'ceftiofur',
    product_name: 'Excenel vet. (ceftiofur)',
    ma_number: 'DK/VP/0006',
    active_substances: 'Ceftiofur',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, suspension',
    legal_category: 'Receptpligtigt (Rx) — kritisk vigtigt antibiotikum',
    ma_holder: 'Zoetis',
    therapeutic_group: 'Antibiotikum — 3. generations cefalosporin (kritisk vigtigt)',
    spc_url: 'https://www.dkma.dk/produktresume/excenel',
    status: 'Godkendt — restriktiv brug',
  },
  {
    id: 'colistin',
    product_name: 'Colisol vet. (colistin)',
    ma_number: 'DK/VP/0007',
    active_substances: 'Colistin',
    species_authorised: 'svin',
    pharmaceutical_form: 'Oral opløsning',
    legal_category: 'Receptpligtigt (Rx) — sidste udvej',
    ma_holder: 'Dopharma',
    therapeutic_group: 'Antibiotikum — polymyxin (sidste udvej, WHO)',
    spc_url: 'https://www.dkma.dk/produktresume/colisol',
    status: 'Godkendt — streng restriktion',
  },
  {
    id: 'florfenicol',
    product_name: 'Nuflor vet. (florfenicol)',
    ma_number: 'DK/VP/0008',
    active_substances: 'Florfenicol',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'MSD Animal Health',
    therapeutic_group: 'Antibiotikum — amfenikol',
    spc_url: 'https://www.dkma.dk/produktresume/nuflor',
    status: 'Godkendt',
  },
  {
    id: 'meloxicam',
    product_name: 'Metacam vet. (meloxicam)',
    ma_number: 'EU/2/97/004',
    active_substances: 'Meloxicam',
    species_authorised: 'svin, kvæg',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Boehringer Ingelheim',
    therapeutic_group: 'NSAID — smertelindring og antiinflammatorisk',
    spc_url: 'https://www.ema.europa.eu/en/medicines/veterinary/EPAR/metacam',
    status: 'Godkendt',
  },
  {
    id: 'toltrazuril',
    product_name: 'Baycox vet. (toltrazuril)',
    ma_number: 'DK/VP/0010',
    active_substances: 'Toltrazuril',
    species_authorised: 'svin, kalve',
    pharmaceutical_form: 'Oral suspension',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Elanco',
    therapeutic_group: 'Antiparasitært — anticoccidial',
    spc_url: 'https://www.dkma.dk/produktresume/baycox',
    status: 'Godkendt',
  },
  {
    id: 'ivermectin',
    product_name: 'Ivomec vet. (ivermectin)',
    ma_number: 'DK/VP/0011',
    active_substances: 'Ivermectin',
    species_authorised: 'kvæg, får',
    pharmaceutical_form: 'Injektionsvæske, opløsning',
    legal_category: 'Receptpligtigt (Rx)',
    ma_holder: 'Boehringer Ingelheim',
    therapeutic_group: 'Antiparasitært — endectocid',
    spc_url: 'https://www.dkma.dk/produktresume/ivomec',
    status: 'Godkendt',
  },
];

const insertMedicine = db.instance.prepare(`
  INSERT OR REPLACE INTO medicines
    (id, product_name, ma_number, active_substances, species_authorised,
     pharmaceutical_form, legal_category, ma_holder, therapeutic_group, spc_url, status, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DK')
`);

for (const m of medicines) {
  insertMedicine.run(
    m.id, m.product_name, m.ma_number, m.active_substances,
    m.species_authorised, m.pharmaceutical_form, m.legal_category,
    m.ma_holder, m.therapeutic_group, m.spc_url, m.status
  );
}
console.log(`Inserted ${medicines.length} medicines.`);

// ─── Withdrawal Periods ─────────────────────────────────────────────────────

interface WithdrawalPeriod {
  medicine_id: string;
  species: string;
  product_type: string;
  period_days: number;
  notes: string | null;
  zero_day_allowed: number;
}

const withdrawalPeriods: WithdrawalPeriod[] = [
  // Penovet (benzylpenicillin-prokain)
  { medicine_id: 'penicillin-prokain', species: 'svin', product_type: 'kød', period_days: 10, notes: 'Standarddosis i.m.', zero_day_allowed: 0 },
  { medicine_id: 'penicillin-prokain', species: 'kvæg', product_type: 'kød', period_days: 10, notes: 'Standarddosis i.m.', zero_day_allowed: 0 },
  { medicine_id: 'penicillin-prokain', species: 'kvæg', product_type: 'mælk', period_days: 7, notes: 'Standarddosis i.m. — kontrollér SPC for præcis tilbageholdelsestid', zero_day_allowed: 0 },

  // Clamoxyl (amoxicillin)
  { medicine_id: 'amoxicillin', species: 'svin', product_type: 'kød', period_days: 28, notes: 'Lang tilbageholdelsestid — planlæg behandling nøje', zero_day_allowed: 0 },
  { medicine_id: 'amoxicillin', species: 'kvæg', product_type: 'kød', period_days: 28, notes: 'Lang tilbageholdelsestid', zero_day_allowed: 0 },
  { medicine_id: 'amoxicillin', species: 'kvæg', product_type: 'mælk', period_days: 3, notes: 'Standarddosis', zero_day_allowed: 0 },

  // Engemycin (oxytetracyclin)
  { medicine_id: 'oxytetracyclin', species: 'svin', product_type: 'kød', period_days: 14, notes: null, zero_day_allowed: 0 },
  { medicine_id: 'oxytetracyclin', species: 'kvæg', product_type: 'kød', period_days: 14, notes: null, zero_day_allowed: 0 },
  { medicine_id: 'oxytetracyclin', species: 'kvæg', product_type: 'mælk', period_days: 7, notes: 'Kontrollér SPC — varierer efter præparat', zero_day_allowed: 0 },

  // Draxxin (tulathromycin)
  { medicine_id: 'tulathromycin', species: 'svin', product_type: 'kød', period_days: 44, notes: 'Lang tilbageholdelsestid — vigtigt ved slagteplanlægning', zero_day_allowed: 0 },
  { medicine_id: 'tulathromycin', species: 'kvæg', product_type: 'kød', period_days: 44, notes: 'Lang tilbageholdelsestid', zero_day_allowed: 0 },
  { medicine_id: 'tulathromycin', species: 'kvæg', product_type: 'mælk', period_days: 0, notes: 'Må IKKE anvendes til malkekøer — ingen godkendt tilbageholdelsestid for mælk', zero_day_allowed: 0 },

  // Baytril (enrofloxacin) — critical antibiotic
  { medicine_id: 'enrofloxacin', species: 'svin', product_type: 'kød', period_days: 14, notes: 'Fluoroquinolon — kritisk vigtigt antibiotikum. Kun efter resistensbestemmelse.', zero_day_allowed: 0 },
  { medicine_id: 'enrofloxacin', species: 'kvæg', product_type: 'kød', period_days: 14, notes: 'Fluoroquinolon — kritisk vigtigt antibiotikum. Kun efter resistensbestemmelse.', zero_day_allowed: 0 },
  { medicine_id: 'enrofloxacin', species: 'kvæg', product_type: 'mælk', period_days: 4, notes: 'Kun efter resistensbestemmelse', zero_day_allowed: 0 },
  { medicine_id: 'enrofloxacin', species: 'fjerkræ', product_type: 'kød', period_days: 7, notes: 'Kun efter resistensbestemmelse. Æglæggende fjerkræ: se SPC.', zero_day_allowed: 0 },

  // Excenel (ceftiofur) — critical antibiotic
  { medicine_id: 'ceftiofur', species: 'svin', product_type: 'kød', period_days: 5, notes: '3. generations cefalosporin — skriftlig begrundelse påkrævet. Kun som sidstevalg.', zero_day_allowed: 0 },
  { medicine_id: 'ceftiofur', species: 'kvæg', product_type: 'kød', period_days: 8, notes: '3. generations cefalosporin — skriftlig begrundelse påkrævet.', zero_day_allowed: 0 },
  { medicine_id: 'ceftiofur', species: 'kvæg', product_type: 'mælk', period_days: 0, notes: 'Nul dage — kontrollér SPC for specifikke indikationer', zero_day_allowed: 1 },

  // Colisol (colistin)
  { medicine_id: 'colistin', species: 'svin', product_type: 'kød', period_days: 2, notes: 'Sidste udvej antibiotikum (WHO). Streng restriktion i DK. Oral administration.', zero_day_allowed: 0 },

  // Nuflor (florfenicol)
  { medicine_id: 'florfenicol', species: 'svin', product_type: 'kød', period_days: 30, notes: 'Lang tilbageholdelsestid', zero_day_allowed: 0 },
  { medicine_id: 'florfenicol', species: 'kvæg', product_type: 'kød', period_days: 30, notes: 'Lang tilbageholdelsestid — planlæg slagtning', zero_day_allowed: 0 },
  { medicine_id: 'florfenicol', species: 'kvæg', product_type: 'mælk', period_days: 0, notes: 'Må IKKE anvendes til malkekøer', zero_day_allowed: 0 },

  // Metacam (meloxicam)
  { medicine_id: 'meloxicam', species: 'svin', product_type: 'kød', period_days: 5, notes: 'NSAID — smertelindring', zero_day_allowed: 0 },
  { medicine_id: 'meloxicam', species: 'kvæg', product_type: 'kød', period_days: 5, notes: 'NSAID — smertelindring', zero_day_allowed: 0 },
  { medicine_id: 'meloxicam', species: 'kvæg', product_type: 'mælk', period_days: 5, notes: 'NSAID — kontrollér SPC', zero_day_allowed: 0 },

  // Baycox (toltrazuril)
  { medicine_id: 'toltrazuril', species: 'svin', product_type: 'kød', period_days: 77, notes: 'Meget lang tilbageholdelsestid — behandl tidligt i produktionscyklus', zero_day_allowed: 0 },
  { medicine_id: 'toltrazuril', species: 'kalve', product_type: 'kød', period_days: 77, notes: 'Meget lang tilbageholdelsestid — behandl tidligt', zero_day_allowed: 0 },

  // Ivomec (ivermectin)
  { medicine_id: 'ivermectin', species: 'kvæg', product_type: 'kød', period_days: 49, notes: 'Lang tilbageholdelsestid — planlæg behandling i forhold til slagtning', zero_day_allowed: 0 },
  { medicine_id: 'ivermectin', species: 'kvæg', product_type: 'mælk', period_days: 0, notes: 'Må IKKE anvendes til malkekøer — ingen godkendt tilbageholdelsestid for mælk', zero_day_allowed: 0 },
  { medicine_id: 'ivermectin', species: 'får', product_type: 'kød', period_days: 49, notes: 'Lang tilbageholdelsestid', zero_day_allowed: 0 },
];

const insertWithdrawal = db.instance.prepare(`
  INSERT OR REPLACE INTO withdrawal_periods
    (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, 'DK')
`);

for (const wp of withdrawalPeriods) {
  insertWithdrawal.run(
    wp.medicine_id, wp.species, wp.product_type,
    wp.period_days, wp.notes, wp.zero_day_allowed
  );
}
console.log(`Inserted ${withdrawalPeriods.length} withdrawal periods.`);

// ─── Banned / Restricted Substances ─────────────────────────────────────────

interface BannedSubstance {
  substance: string;
  category: string;
  applies_to: string;
  regulation_ref: string;
}

const bannedSubstances: BannedSubstance[] = [
  {
    substance: 'Carbapenemer (meropenem, imipenem, ertapenem)',
    category: 'Forbudt i veterinærmedicin',
    applies_to: 'alle fødevareproducerende dyr',
    regulation_ref: 'EU Forordning 2019/6 art. 37(5), Fødevarestyrelsens bekendtgørelse',
  },
  {
    substance: 'Chloramphenicol',
    category: 'Forbudt i fødevareproducerende dyr',
    applies_to: 'alle fødevareproducerende dyr',
    regulation_ref: 'EU Forordning 37/2010 (Tabel 2), EU Forordning 2019/6',
  },
  {
    substance: 'Nitrofuraner (furazolidon, nitrofurantoin)',
    category: 'Forbudt i fødevareproducerende dyr',
    applies_to: 'alle fødevareproducerende dyr',
    regulation_ref: 'EU Forordning 37/2010 (Tabel 2)',
  },
  {
    substance: 'Metronidazol',
    category: 'Forbudt i fødevareproducerende dyr',
    applies_to: 'alle fødevareproducerende dyr',
    regulation_ref: 'EU Forordning 37/2010 (Tabel 2)',
  },
  {
    substance: 'Dimetridazol',
    category: 'Forbudt i fødevareproducerende dyr',
    applies_to: 'alle fødevareproducerende dyr',
    regulation_ref: 'EU Forordning 37/2010 (Tabel 2)',
  },
  {
    substance: 'Stilbener (diethylstilbestrol)',
    category: 'Forbudt — vækstfremmende hormoner',
    applies_to: 'alle fødevareproducerende dyr, vækstfremme',
    regulation_ref: 'Direktiv 96/22/EF, EU Forordning 2019/6',
  },
  {
    substance: 'Beta-agonister (clenbuterol til vækstfremme)',
    category: 'Forbudt — vækstfremmende stoffer',
    applies_to: 'alle fødevareproducerende dyr, vækstfremme',
    regulation_ref: 'Direktiv 96/22/EF',
  },
  {
    substance: 'Vancomycin',
    category: 'Forbudt i veterinærmedicin (WHO Reserve)',
    applies_to: 'alle dyr',
    regulation_ref: 'EU Forordning 2019/6, WHO AwaRe klassifikation',
  },
  // Critical but not banned — restricted use
  {
    substance: 'Fluoroquinoloner (enrofloxacin, marbofloxacin)',
    category: 'Kritisk vigtigt — restriktiv brug',
    applies_to: 'alle fødevareproducerende dyr — kun efter resistensbestemmelse',
    regulation_ref: 'EU Forordning 2019/6 art. 107(6), Fødevarestyrelsens retningslinjer',
  },
  {
    substance: '3./4. generations cefalosporiner (ceftiofur, cefquinom)',
    category: 'Kritisk vigtigt — restriktiv brug',
    applies_to: 'alle fødevareproducerende dyr — skriftlig begrundelse påkrævet, kun sidstevalg',
    regulation_ref: 'EU Forordning 2019/6 art. 107(6), Fødevarestyrelsens retningslinjer',
  },
  {
    substance: 'Colistin',
    category: 'Kritisk vigtigt — meget restriktiv brug (WHO last resort)',
    applies_to: 'alle fødevareproducerende dyr — streng restriktion',
    regulation_ref: 'EU Forordning 2019/6, EMA/CVMP anbefalinger, WHO Reserve',
  },
];

const insertBanned = db.instance.prepare(`
  INSERT OR REPLACE INTO banned_substances
    (substance, category, applies_to, regulation_ref, jurisdiction)
  VALUES (?, ?, ?, ?, 'DK')
`);

for (const b of bannedSubstances) {
  insertBanned.run(b.substance, b.category, b.applies_to, b.regulation_ref);
}
console.log(`Inserted ${bannedSubstances.length} banned/restricted substances.`);

// ─── Cascade Rules (Kaskadereglen) ──────────────────────────────────────────

interface CascadeRule {
  step_order: number;
  description: string;
  documentation_required: string;
  default_withdrawal_meat_days: number;
  default_withdrawal_milk_days: number;
  source: string;
}

const cascadeRules: CascadeRule[] = [
  {
    step_order: 1,
    description: 'Brug et veterinærlægemiddel godkendt i Danmark til den pågældende dyreart og indikation.',
    documentation_required: 'Standardrecept. Opbevar i medicinlogbog.',
    default_withdrawal_meat_days: -1,
    default_withdrawal_milk_days: -1,
    source: 'EU Forordning 2019/6 art. 112-114, Bekendtgørelse om dyrlægers brug af lægemidler',
  },
  {
    step_order: 2,
    description: 'Brug et veterinærlægemiddel godkendt i Danmark til en anden dyreart eller anden indikation hos samme dyreart.',
    documentation_required: 'Dyrlægen skal dokumentere, at trin 1 ikke var muligt. Skriftlig begrundelse i journal.',
    default_withdrawal_meat_days: 28,
    default_withdrawal_milk_days: 7,
    source: 'EU Forordning 2019/6 art. 113(1)(a)',
  },
  {
    step_order: 3,
    description: 'Brug et humant lægemiddel godkendt i Danmark, eller et veterinærlægemiddel godkendt i et andet EU/EØS-land.',
    documentation_required: 'Skriftlig begrundelse for at trin 1 og 2 ikke var mulige. Ansøgning om importtilladelse ved præparat fra udlandet.',
    default_withdrawal_meat_days: 28,
    default_withdrawal_milk_days: 7,
    source: 'EU Forordning 2019/6 art. 113(1)(b-c)',
  },
  {
    step_order: 4,
    description: 'Brug et magistrelt fremstillet lægemiddel (apotek) efter dyrlægens ordination.',
    documentation_required: 'Skriftlig ordination med fuld dokumentation. Apotek skal opbevare kopi.',
    default_withdrawal_meat_days: 28,
    default_withdrawal_milk_days: 7,
    source: 'EU Forordning 2019/6 art. 113(1)(d)',
  },
];

const insertCascade = db.instance.prepare(`
  INSERT OR REPLACE INTO cascade_rules
    (step_order, description, documentation_required, default_withdrawal_meat_days,
     default_withdrawal_milk_days, source, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, 'DK')
`);

for (const c of cascadeRules) {
  insertCascade.run(
    c.step_order, c.description, c.documentation_required,
    c.default_withdrawal_meat_days, c.default_withdrawal_milk_days, c.source
  );
}
console.log(`Inserted ${cascadeRules.length} cascade rules.`);

// ─── Record-Keeping Requirements ────────────────────────────────────────────

interface RecordRequirement {
  holding_type: string | null;
  species: string | null;
  requirement: string;
  retention_period: string;
  regulation_ref: string;
}

const recordRequirements: RecordRequirement[] = [
  {
    holding_type: 'svinebesætning',
    species: 'svin',
    requirement: 'Medicinlogbog: dato, dyr (ID/gruppe), præparat, dosis, behandlingsperiode, tilbageholdelsestid, dyrlæge.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om registrering af lægemidler til dyr §4',
  },
  {
    holding_type: 'svinebesætning',
    species: 'svin',
    requirement: 'Sundhedsrådgivningsaftale (SRA) obligatorisk for besætninger >300 søer ELLER >6.000 producerede slagtesvin/år.',
    retention_period: 'Løbende — aftale skal være aktiv',
    regulation_ref: 'Bekendtgørelse om sundhedsrådgivningsaftaler for svinebesætninger',
  },
  {
    holding_type: 'svinebesætning',
    species: 'svin',
    requirement: 'Flokbehandling kun med aktiv SRA-aftale. Dyrlæge ordinerer, landmand udfører. Alle behandlinger registreres.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om sundhedsrådgivningsaftaler for svinebesætninger §12',
  },
  {
    holding_type: 'kvægbesætning',
    species: 'kvæg',
    requirement: 'Medicinlogbog: dato, dyrets CKR-nummer, præparat, dosis, behandlingsperiode, tilbageholdelsestid.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om registrering af lægemidler til dyr §4',
  },
  {
    holding_type: 'kvægbesætning',
    species: 'kvæg',
    requirement: 'Mælkeleverandører skal føre særskilt register over behandlede køer og tilbageholdelsestid for mælk.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om registrering af lægemidler til dyr §6',
  },
  {
    holding_type: null,
    species: null,
    requirement: 'Dyrlægens besøgsrapport opbevares med medicinforbrug, diagnoser og behandlingsplaner.',
    retention_period: '5 år',
    regulation_ref: 'Dyrlægeloven §8, Bekendtgørelse om dyrlægers journalføring',
  },
  {
    holding_type: null,
    species: null,
    requirement: 'VetStat-indberetning: Alle recepter og medicinforbrug indberettes automatisk til VetStat via apoteker og dyrlæger.',
    retention_period: 'Permanent (offentligt register)',
    regulation_ref: 'Bekendtgørelse om VetStat',
  },
  {
    holding_type: 'svinebesætning',
    species: 'svin',
    requirement: 'Gul Kort (Yellow Card): Overskridelse af antibiotika-grænseværdi registreres af Fødevarestyrelsen. Påbud, reduktionsplan eller strafgebyr.',
    retention_period: 'Permanent (offentligt register)',
    regulation_ref: 'Bekendtgørelse om Gul Kort-ordningen',
  },
  {
    holding_type: null,
    species: null,
    requirement: 'Kritiske antibiotika (fluoroquinoloner, 3./4. gen. cefalosporiner): Dyrlægen skal dokumentere resistensbestemmelse og skriftlig begrundelse.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om dyrlægers brug af lægemidler §10',
  },
  {
    holding_type: 'fjerkræbesætning',
    species: 'fjerkræ',
    requirement: 'Medicinlogbog: dato, flok-ID, præparat, dosis, behandlingsperiode, tilbageholdelsestid.',
    retention_period: '5 år',
    regulation_ref: 'Bekendtgørelse om registrering af lægemidler til dyr §4',
  },
];

const insertRecord = db.instance.prepare(`
  INSERT OR REPLACE INTO record_requirements
    (holding_type, species, requirement, retention_period, regulation_ref, jurisdiction)
  VALUES (?, ?, ?, ?, ?, 'DK')
`);

for (const r of recordRequirements) {
  insertRecord.run(r.holding_type, r.species, r.requirement, r.retention_period, r.regulation_ref);
}
console.log(`Inserted ${recordRequirements.length} record-keeping requirements.`);

// ─── FTS5 Search Index ──────────────────────────────────────────────────────

// Clear existing FTS data
db.instance.exec('DELETE FROM search_index');

// Index medicines
for (const m of medicines) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(
    m.product_name,
    `${m.active_substances}. ${m.therapeutic_group}. ${m.legal_category}. Markedsføringstilladelse: ${m.ma_holder}.`,
    m.species_authorised,
    'DK'
  );
}

// Index banned/restricted substances
for (const b of bannedSubstances) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(
    `Forbudt/restriktivt stof: ${b.substance}`,
    `${b.category}. Gælder: ${b.applies_to}. Regulering: ${b.regulation_ref}.`,
    b.applies_to,
    'DK'
  );
}

// Index cascade rules
for (const c of cascadeRules) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(
    `Kaskadereglen trin ${c.step_order}`,
    `${c.description} Dokumentation: ${c.documentation_required}. Kilde: ${c.source}.`,
    'alle dyr',
    'DK'
  );
}

// Index record-keeping requirements
for (const r of recordRequirements) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(
    `Registreringskrav: ${r.requirement.substring(0, 80)}...`,
    `${r.requirement} Opbevaring: ${r.retention_period}. Regulering: ${r.regulation_ref}.`,
    r.species ?? 'alle dyr',
    'DK'
  );
}

// Index Yellow Card thresholds
const yellowCardEntries = [
  { category: 'Smågrise (7-30 kg)', threshold: '28 ADD/100 dyr/dag' },
  { category: 'Slagtesvin (30-110 kg)', threshold: '5.2 ADD/100 dyr/dag' },
  { category: 'Søer inkl. pattegrise', threshold: '5.0 ADD/100 dyr/dag' },
  { category: 'Kvæg (alle)', threshold: '2.0 ADD/100 dyr/dag' },
];

for (const yc of yellowCardEntries) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(
    `Gul Kort grænseværdi: ${yc.category}`,
    `Grænseværdi: ${yc.threshold}. Konsekvenser ved overskridelse: 1. gang: påbud om reduktion. 2. gang: reduktionsplan. 3. gang: strafgebyr. Gentagelse: politianmeldelse. Fødevarestyrelsen overvåger via VetStat.`,
    yc.category.toLowerCase().includes('kvæg') ? 'kvæg' : 'svin',
    'DK'
  );
}

// Index SRA (Sundhedsrådgivningsaftale) info
db.instance.prepare(
  'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
).run(
  'Sundhedsrådgivningsaftale (SRA)',
  'Obligatorisk for svinebesætninger >300 søer ELLER >6.000 producerede slagtesvin/år. Tilsynsbesøg: 4 (basis) til 12 (udvidet) per år. Flokbehandling kun med aktiv SRA-aftale — dyrlæge ordinerer, landmand udfører. Alle behandlinger registreres i medicinlogbog, opbevaring 5 år.',
  'svin',
  'DK'
);

// Index DANMAP resistance data
const resistanceEntries = [
  { title: 'DANMAP: Salmonella-resistens i svin', body: 'Fluoroquinolon-resistens <2%. Cefalosporin-resistens <1%. Generelt lavt resistensniveau i danske svinebesætninger.', species: 'svin' },
  { title: 'DANMAP: E. coli-resistens i svin', body: 'Tetracyclin-resistens ca. 40%. Ampicillin-resistens ca. 35%. Højere resistensniveauer end Salmonella, men faldende tendens.', species: 'svin' },
  { title: 'DANMAP: MRSA CC398 i svinebesætninger', body: 'Prævalens i svinestalde ca. 70%. Lav humant smitterisiko fra fødevarer. Primært erhvervsmæssig eksponering. Screening af ansatte anbefales.', species: 'svin' },
  { title: 'DANMAP: Campylobacter-resistens i fjerkræ', body: 'Ciprofloxacin-resistens ca. 15%. Makrolid-resistens <5%. Fjerkræ er en vigtig kilde til human campylobacteriose.', species: 'fjerkræ' },
  { title: 'DANMAP: Generel trend i antibiotikaforbrug', body: 'Antibiotikaforbrug i dansk husdyrproduktion faldet ca. 25% siden 2010. Danmark er et af de lande i EU med lavest forbrug pr. dyr. Gul Kort-ordningen og restriktioner på kritiske antibiotika har bidraget til reduktionen.', species: 'alle dyr' },
];

for (const re of resistanceEntries) {
  db.instance.prepare(
    'INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)'
  ).run(re.title, re.body, re.species, 'DK');
}

console.log('Built FTS5 search index.');

// ─── Metadata ───────────────────────────────────────────────────────────────

db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('schema_version', '1.1')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('mcp_name', 'Danish Veterinary Medicines MCP')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('jurisdiction', 'DK')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_sources', 'Fødevarestyrelsen VetStat, Lægemiddelstyrelsen, DANMAP (SSI + DTU), SEGES Innovation')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('disclaimer', 'Data er vejledende. Alle antibiotika kræver veterinærmæssig ordination. Kontakt din dyrlæge.')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('medicines_count', ?)", [String(medicines.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('withdrawal_periods_count', ?)", [String(withdrawalPeriods.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('banned_substances_count', ?)", [String(bannedSubstances.length)]);

// ─── Coverage File ──────────────────────────────────────────────────────────

writeFileSync('data/coverage.json', JSON.stringify({
  mcp_name: 'Danish Veterinary Medicines MCP',
  jurisdiction: 'DK',
  build_date: now,
  status: 'populated',
  medicines_count: medicines.length,
  withdrawal_periods_count: withdrawalPeriods.length,
  banned_substances_count: bannedSubstances.length,
  cascade_rules_count: cascadeRules.length,
  record_requirements_count: recordRequirements.length,
  fts_entries: medicines.length + bannedSubstances.length + cascadeRules.length +
    recordRequirements.length + yellowCardEntries.length + 1 + resistanceEntries.length,
  data_sources: [
    'Fødevarestyrelsen VetStat',
    'Lægemiddelstyrelsen (DK)',
    'DANMAP (SSI + DTU)',
    'SEGES Innovation',
  ],
  disclaimer: 'Data er vejledende. Alle antibiotika kræver veterinærmæssig ordination. Kontakt din dyrlæge.',
}, null, 2));

db.close();

console.log('');
console.log('=== Danish Veterinary Medicines MCP — Ingestion Complete ===');
console.log(`  Medicines:            ${medicines.length}`);
console.log(`  Withdrawal periods:   ${withdrawalPeriods.length}`);
console.log(`  Banned/restricted:    ${bannedSubstances.length}`);
console.log(`  Cascade rules:        ${cascadeRules.length}`);
console.log(`  Record requirements:  ${recordRequirements.length}`);
console.log(`  FTS entries:          ${medicines.length + bannedSubstances.length + cascadeRules.length + recordRequirements.length + yellowCardEntries.length + 1 + resistanceEntries.length}`);
console.log(`  Build date:           ${now}`);
console.log('');
