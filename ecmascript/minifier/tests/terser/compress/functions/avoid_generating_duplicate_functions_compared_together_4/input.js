const x = () => null;
const y = () => x;
const fns = [y(), y()];
console.log(fns[0] === fns[1]);
const fns_obj = { a: y(), b: y() };
console.log(fns_obj.a === fns_obj.b);
