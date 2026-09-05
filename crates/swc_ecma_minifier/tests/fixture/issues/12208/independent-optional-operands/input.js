const obj = {};
const func = () => {};

console.log(obj?.[null?.veryLongProperty]);
console.log(func?.(null?.veryLongProperty));
