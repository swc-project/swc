var neverArray = [];
var a11 = f1([]); // never
var a21 = f1(neverArray); // never
var list = mkList([], compareNumbers);
f2(Array.from([
    0
]), [], function(a1, a2) {
    return a1 - a2;
});
f2(Array.from([]), [
    0
], function(a1, a2) {
    return a1 - a2;
});
