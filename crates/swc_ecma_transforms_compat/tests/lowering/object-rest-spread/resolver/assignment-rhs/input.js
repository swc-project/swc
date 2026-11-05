let source = [1, 2];
let tail;
const original = source;
const result = ([...{ 0: source, ...tail }] = source);
console.log(result === original, source, tail);

let object = { first: 1, second: 2 };
const objectResult = ({ first: object, ...tail } = object);
console.log(objectResult, object, tail);
