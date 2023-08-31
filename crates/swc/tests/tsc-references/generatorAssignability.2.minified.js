//// [generatorAssignability.ts]
// spread iterable
[
    ...g1
], [
    ...g2
];
// binding pattern over iterable
let [x1] = g1, [x2] = g2, [...y1] = g1, [...y2] = g2; // error
// for-of over iterable
for (_ of (// assignment pattern over iterable
[_] = g1, [_] = g2, // assignment rest pattern over iterable
[..._] = g1, [..._] = g2, g1)); // error
for (_ of g2); // ok
