import { it, expect } from 'vitest'
import { genCargo } from './seed'
it('generates 10,000 unique cargo records', () => { const c = genCargo(); expect(c.length).toBe(10000); expect(new Set(c.map(x => x.id)).size).toBe(10000); expect(genCargo()[5000].id).toBe(c[5000].id) })
