import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Medicines
  db.run(
    `INSERT INTO medicines (id, product_name, ma_number, active_substances, species_authorised,
     pharmaceutical_form, legal_category, ma_holder, spc_url, status, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['oxytetracyclin', 'Engemycin vet. (oxytetracyclin)', 'DK/VP/0003', 'Oxytetracyclin', 'svin, kvæg',
     'Injektionsvæske, opløsning', 'Receptpligtigt (Rx)', 'MSD Animal Health',
     'https://www.dkma.dk/produktresume/engemycin', 'Godkendt', 'DK']
  );
  db.run(
    `INSERT INTO medicines (id, product_name, ma_number, active_substances, species_authorised,
     pharmaceutical_form, legal_category, ma_holder, spc_url, status, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['ceftiofur', 'Excenel vet. (ceftiofur)', 'DK/VP/0006', 'Ceftiofur', 'svin, kvæg',
     'Injektionsvæske, suspension', 'Receptpligtigt (Rx) — kritisk vigtigt antibiotikum', 'Zoetis',
     'https://www.dkma.dk/produktresume/excenel', 'Godkendt — restriktiv brug', 'DK']
  );
  db.run(
    `INSERT INTO medicines (id, product_name, ma_number, active_substances, species_authorised,
     pharmaceutical_form, legal_category, ma_holder, spc_url, status, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['meloxicam', 'Metacam vet. (meloxicam)', 'EU/2/97/004', 'Meloxicam', 'svin, kvæg',
     'Injektionsvæske, opløsning', 'Receptpligtigt (Rx)', 'Boehringer Ingelheim',
     'https://www.ema.europa.eu/en/medicines/veterinary/EPAR/metacam', 'Godkendt', 'DK']
  );

  // Withdrawal periods
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['oxytetracyclin', 'svin', 'kød', 14, null, 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['oxytetracyclin', 'kvæg', 'kød', 14, null, 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['oxytetracyclin', 'kvæg', 'mælk', 7, 'Kontrollér SPC — varierer efter præparat', 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ceftiofur', 'svin', 'kød', 5, '3. generations cefalosporin — skriftlig begrundelse påkrævet.', 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ceftiofur', 'kvæg', 'kød', 8, '3. generations cefalosporin — skriftlig begrundelse påkrævet.', 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ceftiofur', 'kvæg', 'mælk', 0, 'Nul dage — kontrollér SPC for specifikke indikationer', 1, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['meloxicam', 'svin', 'kød', 5, 'NSAID — smertelindring', 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['meloxicam', 'kvæg', 'kød', 5, 'NSAID — smertelindring', 0, 'DK']
  );
  db.run(
    `INSERT INTO withdrawal_periods (medicine_id, species, product_type, period_days, notes, zero_day_allowed, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['meloxicam', 'kvæg', 'mælk', 5, 'NSAID — kontrollér SPC', 0, 'DK']
  );

  // Banned substances
  db.run(
    `INSERT INTO banned_substances (substance, category, applies_to, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['Chloramphenicol', 'Forbudt i fødevareproducerende dyr', 'alle fødevareproducerende dyr',
     'EU Forordning 37/2010 (Tabel 2), EU Forordning 2019/6', 'DK']
  );
  db.run(
    `INSERT INTO banned_substances (substance, category, applies_to, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['Metronidazol', 'Forbudt i fødevareproducerende dyr', 'alle fødevareproducerende dyr',
     'EU Forordning 37/2010 (Tabel 2)', 'DK']
  );
  db.run(
    `INSERT INTO banned_substances (substance, category, applies_to, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['Carbapenemer (meropenem, imipenem, ertapenem)', 'Forbudt i veterinærmedicin', 'alle fødevareproducerende dyr',
     'EU Forordning 2019/6 art. 37(5), Fødevarestyrelsens bekendtgørelse', 'DK']
  );

  // Cascade rules
  db.run(
    `INSERT INTO cascade_rules (step_order, description, documentation_required, default_withdrawal_meat_days, default_withdrawal_milk_days, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [1, 'Brug et veterinærlægemiddel godkendt i Danmark til den pågældende dyreart og indikation.',
     'Standardrecept. Opbevar i medicinlogbog.', null, null, 'EU Forordning 2019/6 art. 112-114', 'DK']
  );
  db.run(
    `INSERT INTO cascade_rules (step_order, description, documentation_required, default_withdrawal_meat_days, default_withdrawal_milk_days, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [2, 'Brug et veterinærlægemiddel godkendt i Danmark til en anden dyreart eller anden indikation hos samme dyreart.',
     'Dyrlægen skal dokumentere, at trin 1 ikke var muligt. Skriftlig begrundelse i journal.', 28, 7, 'EU Forordning 2019/6 art. 113(1)(a)', 'DK']
  );

  // Record requirements
  db.run(
    `INSERT INTO record_requirements (holding_type, species, requirement, retention_period, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['svinebesætning', 'svin',
     'Medicinlogbog: dato, dyr (ID/gruppe), præparat, dosis, behandlingsperiode, tilbageholdelsestid, dyrlæge.',
     '5 år', 'Bekendtgørelse om registrering af lægemidler til dyr §4', 'DK']
  );

  // FTS5 search index
  db.run(
    `INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Engemycin vet. (oxytetracyclin)', 'Oxytetracyclin. Antibiotikum — tetracyclin. Svin kød: 14 dage. Kvæg kød: 14 dage. Kvæg mælk: 7 dage.', 'svin, kvæg', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Excenel vet. (ceftiofur)', 'Ceftiofur. Antibiotikum — 3. generations cefalosporin (kritisk vigtigt). Svin kød: 5 dage. Kvæg kød: 8 dage. Kvæg mælk: 0 dage.', 'svin, kvæg', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, species, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Forbudt/restriktivt stof: Chloramphenicol', 'Forbudt i fødevareproducerende dyr. Gælder: alle fødevareproducerende dyr.', 'alle fødevareproducerende dyr', 'DK']
  );

  return db;
}
