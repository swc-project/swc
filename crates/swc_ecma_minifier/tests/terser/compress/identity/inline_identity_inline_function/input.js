const id = (x) => x;
console.log(id((x) => x + 1)(1), id(((x) => x + 1)(2)));
