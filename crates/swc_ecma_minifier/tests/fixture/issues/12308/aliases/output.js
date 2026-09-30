var _Math_abs = Math.abs, _Object_keys = Object.keys, _Promise = Promise;
console.log(_Object_keys({
    a: 1
}).join(","));
console.log(_Object_keys({
    b: 2
}).join(","));
console.log(_Math_abs(-1), _Math_abs(-2), _Math_abs(-3));
const first = new _Promise((resolve)=>resolve(1));
const second = new _Promise((resolve)=>resolve(2));
const third = new _Promise((resolve)=>resolve(3));
console.log(first instanceof Promise, second instanceof Promise, third instanceof Promise);
Promise.all([
    first,
    second,
    third
]).then((values)=>console.log(JSON.stringify(values)));
Promise.resolve(4).then(console.log);
Promise.resolve(5).then(console.log);
