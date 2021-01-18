const id = (x) => x;
const inc = (x) => x + 1;
console.log(id(inc(1)), id(inc)(2));
