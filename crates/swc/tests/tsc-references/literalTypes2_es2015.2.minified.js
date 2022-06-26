var E;
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
const a = [
    1,
    2
];
g1(1), g2(1, 1), g2(1, 2), g3(1, "two"), g4(1), g5(1, 2), g6([
    1,
    2
]), g6(a), g7(a), g8(1, (x)=>x), g8(1, (x)=>x + 1);
let aa = [
    0
];
aa = function(a, x) {
    let result = a.slice();
    return result.push(1), result;
}(aa, 1);
