//// [asOpEmitParens.ts]
// Must emit as (x + 1) * 3
x, // Should still emit as x.y
x.y, // Emit as new (x())
new (x());
