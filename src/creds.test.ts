import { describe, it, expect } from 'vitest'
import { ROLES, CREDS } from './data'
describe('credentials', () => {
  it('every portal has its own unique login ID and password', () => {
    expect(Object.keys(CREDS).sort()).toEqual(ROLES.map(r => r.id).sort())
    expect(new Set(Object.values(CREDS).map(c => c[0])).size).toBe(ROLES.length)
    expect(new Set(Object.values(CREDS).map(c => c[1])).size).toBe(ROLES.length)
  })
})
describe('permissions', () => {
  it('every portal can add, edit and use operations', () => { const d = ROLES.find(r => r.id === 'driver')!; expect(d.ops).toBe(true); expect(d.tabs).toContain('ops'); expect(ROLES.every(r => r.add && r.ops && r.tabs.includes('add'))).toBe(true); expect(d.add).toBe(true) })
})
