const [a, b = a] = [
    1
], [c, d = c, e = e] = [
    1
], [f, g = f, h = i, i = f] = [
    1
];
!function([a1, b = a1]) {}([
    1
]), function([c1, d = c1, e1 = e1]) {}([
    1
]), function([f1, g = f1, h = i, i = f1]) {}([
    1
]);
