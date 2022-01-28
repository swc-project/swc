let x;
let four = 4;
({ [5 + 2 - four]: x } = { [1 + 2]: 42 });
console.log(x);
