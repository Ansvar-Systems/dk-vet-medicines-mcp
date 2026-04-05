import { describe, test, expect } from 'vitest';
import { handleAbout } from '../../src/tools/about.js';

describe('about tool', () => {
  test('returns server metadata', () => {
    const result = handleAbout();
    expect(result.name).toBe('Danish Veterinary Medicines MCP');
    expect(result.description).toContain('veterinary');
    expect(result.jurisdiction).toEqual(['DK']);
    expect(result.tools_count).toBe(10);
    expect(result.links).toHaveProperty('homepage');
    expect(result._meta).toHaveProperty('disclaimer');
  });

  test('disclaimer warns about withdrawal periods', () => {
    const result = handleAbout();
    expect(result._meta.disclaimer).toContain('SPC');
  });
});
