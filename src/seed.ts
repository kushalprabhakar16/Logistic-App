import { Cargo, SEED_CARGO } from './data'
// Deterministic generator: the same 10,000 records every time. Only your changes are saved in the browser.
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
type R = () => number
const ri = (r: R, a: number, b: number) => a + Math.floor(r() * (b - a + 1))
const pick = <T,>(r: R, a: T[]) => a[Math.floor(r() * a.length)]
const CITIES = ['Chennai, IN', 'Mumbai, IN', 'Bengaluru, IN', 'Delhi, IN', 'Kolkata, IN', 'Kochi, IN', 'Pune, IN', 'Rotterdam, NL', 'Singapore, SG', 'Dubai, AE', 'Hamburg, DE', 'Shanghai, CN', 'Los Angeles, US', 'New York, US', 'London, GB', 'Tokyo, JP', 'Sydney, AU', 'Colombo, LK', 'Antwerp, BE', 'Jeddah, SA']
type Part = Pick<Cargo, 'product' | 'category' | 'qty' | 'count' | 'massKg' | 'volumeM3' | 'packaging'>
const T: ((r: R) => Part)[] = [
  r => { const q = ri(r, 5, 200), b = q * 10; return { product: pick(r, ['Basmati rice', 'Wheat', 'Sugar', 'Cement']), category: 'solid', qty: `${q} q (${b} bags)`, count: b, massKg: q * 100, volumeM3: null, packaging: 'bags' } },
  r => { const n = ri(r, 20, 400), kg = n * ri(r, 2, 40); return { product: pick(r, ['Steel components', 'Furniture', 'Electronics', 'Timber']), category: 'solid', qty: `${kg / 1000} t (${n} pieces)`, count: n, massKg: kg, volumeM3: null, packaging: 'pieces' } },
  r => { const l = ri(r, 500, 20000), d = Math.ceil(l / 200); return { product: pick(r, ['Edible oil', 'Milk', 'Fruit juice', 'Industrial liquid']), category: 'liquid', qty: `${l} L (${d} drums)`, count: d, massKg: null, volumeM3: l / 1000, packaging: 'drums' } },
  r => { const b = ri(r, 12, 50) * 24, s = pick(r, [0.5, 1, 2]), l = b * s; return { product: `${pick(r, ['Drinking water', 'Orange juice', 'Milk', 'Cooking oil'])} ${s} L`, category: 'bottled', qty: `${b} bottles of ${s} L`, count: b, massKg: Math.round(l * 1.05), volumeM3: l / 1000, packaging: `${Math.ceil(b / 24)} cartons` } },
  r => { const n = ri(r, 200, 3000), s = pick(r, [1, 2, 5]); return { product: pick(r, ['Rice packets', 'Flour packets', 'Sugar packets']), category: 'packaged', qty: `${n} packets of ${s} kg`, count: n, massKg: n * s, volumeM3: null, packaging: `${Math.ceil(n / 20)} boxes` } },
  r => { const n = ri(r, 50, 800); return { product: pick(r, ['Garments', 'Mobile phones', 'Medical supplies', 'Spare parts']), category: 'boxes', qty: `${n} boxes`, count: n, massKg: n * ri(r, 5, 30), volumeM3: Math.round(n * (ri(r, 5, 20) / 100) * 1000) / 1000, packaging: `${Math.ceil(n / 48)} pallets` } },
  r => { const n = ri(r, 1, 6); return { product: pick(r, ['CNC machines', 'Generators', 'Excavators', 'Turbines']), category: 'machinery', qty: `${n} machines`, count: n, massKg: n * ri(r, 500, 4000), volumeM3: n * ri(r, 3, 12), packaging: 'Crane lift' } },
  r => { const t = ri(r, 100, 5000); return { product: pick(r, ['Coal', 'Fertilizer', 'Sand', 'Wheat (bulk)']), category: 'bulk', qty: `${t} t`, count: 0, massKg: t * 1000, volumeM3: Math.round(t * 1.2), packaging: 'Conveyor' } },
  r => { const n = ri(r, 50, 500); return { product: 'Textile rolls', category: 'custom', qty: `${n} rolls`, count: n, massKg: n * ri(r, 10, 30), volumeM3: null, packaging: 'rolls' } },
]
const W: [string, number][] = [['Booked', 12], ['Accepted', 10], ['Received', 10], ['Awaiting verification', 10], ['Verified', 8], ['Loaded', 10], ['In transit', 18], ['Unloaded', 6], ['Delivered', 12], ['Damaged', 3], ['Draft', 1]]
const WT = W.reduce((a, b) => a + b[1], 0)
const LOC: Record<string, string[]> = { Road: ['Chennai Depot', 'Hyderabad Transit Hub', 'Bengaluru Warehouse A', 'Nagpur Depot'], Ship: ['Chennai Port, Terminal 2', 'Mumbai Port', 'Kochi Port', 'Rotterdam Port'], Air: ['BLR Cargo Terminal', 'DEL Cargo Terminal', 'DXB Cargo Terminal'], Rail: ['Nagpur Rail Yard', 'ICD Tughlakabad'], Multimodal: ['Warehouse B', 'Port Gate 3', 'Warehouse C'] }
const DEPT: Record<string, string[]> = { Road: ['Road Transport & Dispatch'], Ship: ['Port Ground Staff', 'Shipping Company'], Air: ['Airport Ground Staff', 'Air Cargo Company'], Rail: ['Road Transport & Dispatch'], Multimodal: ['Warehouse Staff', 'Port Ground Staff'] }
export function genCargo(total = 10000): Cargo[] {
  const r = rng(20261024), now = Date.now(), out: Cargo[] = [...SEED_CARGO]
  for (let i = out.length; i < total; i++) {
    const p = T[ri(r, 0, T.length - 1)](r); const mode = pick(r, ['Road', 'Ship', 'Air', 'Rail', 'Multimodal']); const o = pick(r, CITIES); let d = pick(r, CITIES); if (d === o) d = CITIES[(CITIES.indexOf(o) + 1) % CITIES.length]
    let x = r() * WT, status = 'Booked'; for (const [s, w] of W) { if (x < w) { status = s; break } x -= w }
    out.push({ id: `CG-${100000 + i}`, shipmentId: `SHP-${2000 + Math.floor(i / 2)}`, ...p, origin: o, destination: d, mode, dept: pick(r, DEPT[mode]), location: pick(r, LOC[mode]), status, updated: new Date(now - Math.floor(r() * 60 * 86400000)).toISOString() })
  }
  return out
}
