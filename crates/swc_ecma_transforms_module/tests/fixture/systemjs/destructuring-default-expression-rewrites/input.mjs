export let a;

const { x = await y } = obj;
const { meta = import.meta.url } = obj;
const { next = a++ } = obj;

console.log(x, meta, next);
