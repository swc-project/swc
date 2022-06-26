const [a, b = a] = [
    1
], [c, d = c, e = e] = [
    1
], [f, g = f, h = i, i = f] = [
    1
];
!function([a, b = a]) {}([
    1
]), function([c, d = c, e = e]) {}([
    1
]), function([f, g = f, h = i, i1 = f]) {}([
    1
]);
