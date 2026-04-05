import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetWithdrawalPeriod } from '../../src/tools/get-withdrawal-period.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-withdrawal.db';

describe('get_withdrawal_period tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns correct meat withdrawal for oxytetracyclin svin', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'oxytetracyclin',
      species: 'svin',
      product_type: 'kød',
    });
    expect(result).toHaveProperty('withdrawal_periods');
    const periods = (result as { withdrawal_periods: { period_days: number }[] }).withdrawal_periods;
    expect(periods).toHaveLength(1);
    expect(periods[0].period_days).toBe(14);
  });

  test('returns correct milk withdrawal for oxytetracyclin kvæg', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'oxytetracyclin',
      species: 'kvæg',
      product_type: 'mælk',
    });
    const periods = (result as { withdrawal_periods: { period_days: number }[] }).withdrawal_periods;
    expect(periods).toHaveLength(1);
    expect(periods[0].period_days).toBe(7);
  });

  test('returns correct meat withdrawal for ceftiofur kvæg', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'ceftiofur',
      species: 'kvæg',
      product_type: 'kød',
    });
    const periods = (result as { withdrawal_periods: { period_days: number }[] }).withdrawal_periods;
    expect(periods).toHaveLength(1);
    expect(periods[0].period_days).toBe(8);
  });

  test('returns zero-day withdrawal for ceftiofur kvæg mælk', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'ceftiofur',
      species: 'kvæg',
      product_type: 'mælk',
    });
    const periods = (result as { withdrawal_periods: { period_days: number; zero_day_allowed: boolean }[] }).withdrawal_periods;
    expect(periods).toHaveLength(1);
    expect(periods[0].period_days).toBe(0);
    expect(periods[0].zero_day_allowed).toBe(true);
  });

  test('ALWAYS includes SPC warning', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'oxytetracyclin',
      species: 'svin',
    });
    expect(result).toHaveProperty('warning');
    const warning = (result as { warning: string }).warning;
    expect(warning).toContain('SPC');
    expect(warning).toContain('fødevarekæden');
  });

  test('returns not_found for invalid medicine', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'nonexistent',
      species: 'svin',
    });
    expect(result).toHaveProperty('error', 'not_found');
  });

  test('returns no_withdrawal_period for unmatched species', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'ceftiofur',
      species: 'får',
    });
    expect(result).toHaveProperty('error', 'no_withdrawal_period');
    expect(result).toHaveProperty('available_species');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetWithdrawalPeriod(db, {
      medicine_id: 'oxytetracyclin',
      species: 'svin',
      jurisdiction: 'GB',
    });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});
