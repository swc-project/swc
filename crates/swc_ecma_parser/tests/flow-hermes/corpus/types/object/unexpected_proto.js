// error: object types don't have proto fields
type A = { proto x: X }

// ok: prop named proto
type B = { proto: X }

// ok: parsed as a method named proto
type C = { proto(): R }
