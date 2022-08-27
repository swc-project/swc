//// [generatorAssignability.ts]
let [x1] = g1, [x2] = g2, [...y1] = g1, [...y2] = g2;
for (_ of ([_] = g1, [_] = g2, [..._] = g1, [..._] = g2, g1));
for (_ of g2);
