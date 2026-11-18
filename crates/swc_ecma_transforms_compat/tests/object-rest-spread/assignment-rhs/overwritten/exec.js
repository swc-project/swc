let source = [1, 2];
let tail;
const original = source;
const result = ([...{ 0: source, ...tail }] = source);
console.log(result === original, source, JSON.stringify(tail));
