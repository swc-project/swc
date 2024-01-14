//// [generatorAssignability.ts]
[
    ...g1
], [
    ...g2
];
let [x1] = g1, [x2] = g2, [...y1] = g1, [...y2] = g2;
for (_11 of ([_11] = g1, [_11] = g2, [..._11] = g1, [..._11] = g2, g1));
for (_11 of g2);
