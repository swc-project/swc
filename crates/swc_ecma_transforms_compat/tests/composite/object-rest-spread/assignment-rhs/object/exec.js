let source = { first: 1, second: 2 };
let tail;
const original = source;
const result = ({ first: source, ...tail } = source);
console.log(result === original, source, JSON.stringify(tail));
