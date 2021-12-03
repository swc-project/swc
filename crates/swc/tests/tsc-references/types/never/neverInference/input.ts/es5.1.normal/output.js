var neverArray = [];
var a1 = f1([]); // never
var a2 = f1(neverArray); // never
var list = mkList([], compareNumbers);
f2(Array.from([
    0
]), [], function(a11, a21) {
    return a11 - a21;
});
f2(Array.from([]), [
    0
], function(a12, a22) {
    return a12 - a22;
});
