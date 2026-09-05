const obj = {};
const func = () => {};
const get = (value) => value;

console.log(obj?.[null?.veryLongProperty]);
console.log(func?.(null?.veryLongProperty));
console.log(get(null?.veryLongProperty)?.x);
console.log(({ value: null?.veryLongProperty })?.value);
console.log([null?.veryLongProperty]?.[0]);
console.log((null?.veryLongProperty, obj)?.x);
