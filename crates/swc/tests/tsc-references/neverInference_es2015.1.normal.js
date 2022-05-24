let neverArray = [];
let a1 = f1([]); // never
let a2 = f1(neverArray); // never
const list = mkList([], compareNumbers);
f2(Array.from([
    0
]), [], (a11, a21)=>a11 - a21);
f2(Array.from([]), [
    0
], (a12, a22)=>a12 - a22);
