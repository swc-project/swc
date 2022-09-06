let l;
let e = 4;
({ [5 + 2 - e]: l } = { [1 + 2]: 42 });
console.log(l);
