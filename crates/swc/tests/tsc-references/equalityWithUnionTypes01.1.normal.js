//// [equalityWithUnionTypes01.ts]
var x = {
    p1: 10,
    p2: 20
};
var y = x;
var z = x;
if (y === z || z === y) {} else if (y !== z || z !== y) {} else if (y == z || z == y) {} else if (y != z || z != y) {}
