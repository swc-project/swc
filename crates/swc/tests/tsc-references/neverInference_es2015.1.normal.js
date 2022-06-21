let neverArray = [];
let a1 = f1([]); // never
let a2 = f1(neverArray); // never
const list = mkList([], compareNumbers);
f2(Array.from([
    0
]), [], (a1, a2)=>a1 - a2);
f2(Array.from([]), [
    0
], (a1, a2)=>a1 - a2);
